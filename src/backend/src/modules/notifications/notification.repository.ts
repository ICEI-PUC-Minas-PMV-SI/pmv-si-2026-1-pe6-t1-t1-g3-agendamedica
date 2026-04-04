import { NotificationType } from "@prisma/client";
import { prisma } from "../../lib/prisma";

interface CreateParams {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    appointmentId?: string;
}

class NotificationRepository {
    create(params: CreateParams) {
        return prisma.notification.create({ data: params });
    }

    listByUser(userId: string, opts: { page: number; limit: number; unreadOnly?: boolean }) {
        const { page, limit, unreadOnly } = opts;
        const where = { userId, ...(unreadOnly ? { read: false } : {}) };
        return Promise.all([
            prisma.notification.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma.notification.count({ where }),
        ]);
    }

    countUnread(userId: string) {
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

    markAllRead(userId: string) {
        return prisma.notification.updateMany({
            where: { userId, read: false },
            data: { read: true },
        });
    }
}

export const notificationRepository = new NotificationRepository();
export type { CreateParams as NotificationCreateParams };
