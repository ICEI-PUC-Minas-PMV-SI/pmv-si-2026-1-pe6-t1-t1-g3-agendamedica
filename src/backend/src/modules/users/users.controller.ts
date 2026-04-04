// src/backend/src/controllers/user.controller.ts
import { Request, Response } from "express";
import { UpdatePushTokenSchema } from "../notifications/notification.schema";
import { prisma } from "../../lib/prisma";

export async function updatePushToken(req: Request, res: Response): Promise<void> {
    const result = UpdatePushTokenSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ error: result.error.flatten() });
        return;
    }
    const user = await prisma.user.update({
        where: { id: req.userId },
        data: { expoPushToken: result.data.expoPushToken },
        select: { id: true, expoPushToken: true },
    });
    res.json(user);
}
