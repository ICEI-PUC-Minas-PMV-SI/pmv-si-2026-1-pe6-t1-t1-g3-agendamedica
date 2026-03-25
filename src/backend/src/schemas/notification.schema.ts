// src/backend/src/schemas/notification.schema.ts
import { z } from "zod";

export const UpdatePushTokenSchema = z.object({
  expoPushToken: z
    .string()
    .regex(/^ExponentPushToken\[.+\]$/, {
      message: "O token deve estar no formato ExponentPushToken[...]",
    }),
});

export const ListNotificationsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  unreadOnly: z.coerce.boolean().optional(),
});

export type UpdatePushTokenInput = z.infer<typeof UpdatePushTokenSchema>;
export type ListNotificationsQuery = z.infer<typeof ListNotificationsQuerySchema>;
