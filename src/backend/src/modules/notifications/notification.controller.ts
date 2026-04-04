// src/backend/src/controllers/notification.controller.ts
import { Request, Response } from "express";
import { UserRole } from "@prisma/client";
import { ListNotificationsQuerySchema, SendNotificationSchema } from "./notification.schema";
import { notificationService } from "./notification.service";
import { userRepository } from "../users/user.repository";

export async function listNotifications(req: Request, res: Response): Promise<void> {
    const result = ListNotificationsQuerySchema.safeParse(req.query);
    if (!result.success) {
        res.status(400).json({ error: result.error.flatten() });
        return;
    }
    const data = await notificationService.listByUser(req.userId, result.data);
    res.json(data);
}

export async function getUnreadCount(req: Request, res: Response): Promise<void> {
    const count = await notificationService.countUnread(req.userId);
    res.json({ count });
}

export async function markAsRead(req: Request, res: Response): Promise<void> {
    try {
        const notification = await notificationService.markRead(req.userId, req.params.id);
        res.json(notification);
    } catch (err: unknown) {
        if ((err as NodeJS.ErrnoException).code === "NOT_FOUND") {
            res.status(404).json({ error: "Notificação não encontrada." });
            return;
        }
        throw err;
    }
}

export async function markAllAsRead(req: Request, res: Response): Promise<void> {
    await notificationService.markAllRead(req.userId);
    res.status(204).send();
}

export async function sendNotification(req: Request, res: Response): Promise<void> {
    const result = SendNotificationSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ error: result.error.flatten() });
        return;
    }

    const { userId: targetUserId, ...rest } = result.data;

    if (req.userRole === UserRole.PATIENT && targetUserId !== req.userId) {
        res.status(403).json({ error: "Pacientes só podem enviar notificações para si mesmos." });
        return;
    }

    const targetUser = await userRepository.findById(targetUserId);

    if (!targetUser) {
        res.status(404).json({ error: "Usuário destinatário não encontrado." });
        return;
    }

    const notification = await notificationService.notify({
        userId: targetUserId,
        userEmail: targetUser.email,
        expoPushToken: targetUser.expoPushToken,
        ...rest,
    });

    res.status(201).json(notification);
}
