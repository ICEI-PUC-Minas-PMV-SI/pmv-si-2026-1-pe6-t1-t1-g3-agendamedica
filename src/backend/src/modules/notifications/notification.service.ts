import nodemailer from "nodemailer";
import { Expo, ExpoPushToken } from "expo-server-sdk";
import { Notification } from "@prisma/client";
import { notificationRepository, NotificationCreateParams } from "./notification.repository";
import { logger } from "../../utils/logger";

export interface NotifyParams extends NotificationCreateParams {
    userEmail: string;
    emailSubject: string;
    emailHtml: string;
    expoPushToken?: string | null;
    pushData?: Record<string, unknown>;
}

class NotificationService {
    private transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    private expo = new Expo({
        accessToken: process.env.EXPO_ACCESS_TOKEN,
    });

    async listByUser(userId: string, opts: { page: number; limit: number; unreadOnly?: boolean }) {
        const [data, total] = await notificationRepository.listByUser(userId, opts);
        return {
            data,
            pagination: {
                page: opts.page,
                limit: opts.limit,
                total,
                totalPages: Math.ceil(total / opts.limit),
            },
        };
    }

    countUnread(userId: string) {
        return notificationRepository.countUnread(userId);
    }

    markRead(userId: string, notificationId: string) {
        return notificationRepository.markRead(userId, notificationId);
    }

    markAllRead(userId: string) {
        return notificationRepository.markAllRead(userId);
    }

    async sendEmail(to: string, subject: string, html: string) {
        await this.transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to,
            subject,
            html,
        });
    }

    async sendPush(token: string, title: string, body: string, data?: Record<string, unknown>) {
        if (!Expo.isExpoPushToken(token)) {
            logger.warn("push:invalid-token", { token });
            return;
        }
        const tickets = await this.expo.sendPushNotificationsAsync([
            { to: token as ExpoPushToken, title, body, data },
        ]);
        tickets.forEach((ticket) => {
            if (ticket.status === "error") {
                logger.error("push:ticket-error", ticket);
            }
        });
    }

    async notify(params: NotifyParams): Promise<Notification> {
        const notification = await notificationRepository.create({
            userId: params.userId,
            type: params.type,
            title: params.title,
            message: params.message,
            appointmentId: params.appointmentId,
        });

        void this.sendEmail(params.userEmail, params.emailSubject, params.emailHtml).catch(
            (err: Error) =>
                logger.error("email:failed", { message: err.message, stack: err.stack }),
        );

        if (params.expoPushToken) {
            void this.sendPush(
                params.expoPushToken,
                params.title,
                params.message,
                params.pushData,
            ).catch((err: Error) =>
                logger.error("push:failed", { message: err.message, stack: err.stack }),
            );
        }

        return notification;
    }
}

export const notificationService = new NotificationService();
