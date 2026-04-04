import { z } from "zod";
import { NotificationType } from "@prisma/client";

export const UpdatePushTokenSchema = z.object({
    expoPushToken: z.string().regex(/^(ExponentPushToken|ExpoPushToken)\[.+\]$/, {
        message: "O token deve estar no formato ExponentPushToken[...] ou ExpoPushToken[...]",
    }),
});

export const ListNotificationsQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
    unreadOnly: z.preprocess((value) => {
        if (value === undefined) return undefined;
        if (value === true || value === false) return value;
        if (value === "true") return true;
        if (value === "false") return false;
        return value;
    }, z.boolean().optional()),
});

export const SendNotificationSchema = z.object({
    userId: z.string().uuid(),
    type: z.nativeEnum(NotificationType),
    title: z.string().min(1),
    message: z.string().min(1),
    emailSubject: z.string().min(1),
    emailHtml: z.string().min(1),
    appointmentId: z.string().uuid().optional(),
});

export type UpdatePushTokenInput = z.infer<typeof UpdatePushTokenSchema>;
export type ListNotificationsQuery = z.infer<typeof ListNotificationsQuerySchema>;
export type SendNotificationInput = z.infer<typeof SendNotificationSchema>;
