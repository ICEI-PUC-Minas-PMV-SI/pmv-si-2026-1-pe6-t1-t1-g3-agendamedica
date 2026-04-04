// src/backend/src/modules/notifications/notification.routes.ts
import { Router } from "express";
import { UserRole } from "@prisma/client";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import {
    listNotifications,
    getUnreadCount,
    markAllAsRead,
    markAsRead,
    sendNotification,
} from "./notification.controller";

const router = Router();

router.use(authenticate);

router.get("/", listNotifications);
router.get("/unread-count", getUnreadCount);
router.patch("/read-all", markAllAsRead);
router.patch("/:id/read", markAsRead);
router.post(
    "/send",
    authorize(UserRole.RECEPTIONIST, UserRole.DOCTOR, UserRole.PATIENT),
    sendNotification,
);

export default router;
