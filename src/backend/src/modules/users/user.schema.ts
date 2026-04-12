import { z } from "zod";

export const UpdatePushTokenSchema = z.object({
    expoPushToken: z.string().regex(/^(ExponentPushToken|ExpoPushToken)\[.+\]$/, {
        message: "O token deve estar no formato ExponentPushToken[...] ou ExpoPushToken[...]",
    }),
});

export type UpdatePushTokenInput = z.infer<typeof UpdatePushTokenSchema>;
