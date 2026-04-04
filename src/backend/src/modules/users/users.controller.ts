// src/backend/src/controllers/user.controller.ts
import { Request, Response } from "express";
import { UpdatePushTokenSchema } from "../notifications/notification.schema";
import { userRepository } from "./user.repository";

export async function updatePushToken(req: Request, res: Response): Promise<void> {
    const result = UpdatePushTokenSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ error: result.error.flatten() });
        return;
    }
    const user = await userRepository.updatePushToken(req.userId, result.data.expoPushToken);
    res.json(user);
}
