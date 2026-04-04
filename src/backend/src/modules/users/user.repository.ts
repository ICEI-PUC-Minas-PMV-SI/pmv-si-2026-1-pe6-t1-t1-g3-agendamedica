import { prisma } from "../../lib/prisma";

class UserRepository {
    findById(userId: string) {
        return prisma.user.findUnique({
            where: { id: userId },
            select: { email: true, expoPushToken: true, role: true },
        });
    }

    updatePushToken(userId: string, expoPushToken: string) {
        return prisma.user.update({
            where: { id: userId },
            data: { expoPushToken },
            select: { id: true, expoPushToken: true },
        });
    }
}

export const userRepository = new UserRepository();
