// src/backend/src/services/notification.service.ts
import nodemailer from "nodemailer";
import { Expo, ExpoPushToken } from "expo-server-sdk";
import { NotificationType, Notification } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { logger } from "../../utils/logger";

interface CreateParams {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    appointmentId?: string;
}

export interface NotifyParams extends CreateParams {
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

    async create(params: CreateParams) {
        return prisma.notification.create({ data: params });
    }

    async listByUser(userId: string, opts: { page: number; limit: number; unreadOnly?: boolean }) {
        const { page, limit, unreadOnly } = opts;
        const where = { userId, ...(unreadOnly ? { read: false } : {}) };
        const [data, total] = await Promise.all([
            prisma.notification.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma.notification.count({ where }),
        ]);
        return {
            data,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }

    async countUnread(userId: string) {
        return prisma.notification.count({ where: { userId, read: false } });
    }

    async markRead(userId: string, notificationId: string) {
        const notification = await prisma.notification.findFirst({
            where: { id: notificationId, userId },
        });
        if (!notification) {
            const err = new Error("Notification not found");
            (err as NodeJS.ErrnoException).code = "NOT_FOUND";
            throw err;
        }
        return prisma.notification.update({
            where: { id: notificationId },
            data: { read: true },
        });
    }

    async markAllRead(userId: string) {
        return prisma.notification.updateMany({
            where: { userId, read: false },
            data: { read: true },
        });
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
        const notification = await this.create({
            userId: params.userId,
            type: params.type,
            title: params.title,
            message: params.message,
            appointmentId: params.appointmentId,
        });

        void this.sendEmail(params.userEmail, params.emailSubject, params.emailHtml).catch((err) =>
            logger.error("email:failed", err),
        );

        if (params.expoPushToken) {
            void this.sendPush(
                params.expoPushToken,
                params.title,
                params.message,
                params.pushData,
            ).catch((err) => logger.error("push:failed", err));
        }

        return notification;
    }
}

export const notificationService = new NotificationService();
