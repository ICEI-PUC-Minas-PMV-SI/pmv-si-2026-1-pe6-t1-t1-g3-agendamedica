// src/backend/src/controllers/notification.controller.ts
import { Request, Response } from "express";
import { ListNotificationsQuerySchema } from "../schemas/notification.schema";
import { notificationService } from "../services/notification.service";

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
