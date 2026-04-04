import { Request, Response, NextFunction } from "express";
import { UserRole } from "@prisma/client";
import { userRepository } from "../modules/users/user.repository";

export function authorize(...roles: UserRole[]) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const user = await userRepository.findById(req.userId);

            if (!user) {
                res.status(401).json({ error: "Usuário não encontrado." });
                return;
            }

            if (!roles.includes(user.role)) {
                res.status(403).json({ error: "Acesso negado." });
                return;
            }

            req.userRole = user.role;
            return next();
        } catch (err) {
            return next(err);
        }
    };
}
