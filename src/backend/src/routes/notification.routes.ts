// src/backend/src/routes/notification.routes.ts
import { Router } from "express";
import { UserRole } from "@prisma/client";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import {
  listNotifications,
  getUnreadCount,
  markAllAsRead,
  markAsRead,
  sendNotification,
} from "../controllers/notification.controller";

const router = Router();

router.use(authenticate);

router.get("/", listNotifications);
router.get("/unread-count", getUnreadCount);
// IMPORTANT: /read-all must be registered BEFORE /:id/read to avoid Express route conflict
router.patch("/read-all", markAllAsRead);
router.patch("/:id/read", markAsRead);
router.post(
  "/send",
  authorize(UserRole.RECEPTIONIST, UserRole.DOCTOR, UserRole.PATIENT),
  sendNotification,
);

export default router;
