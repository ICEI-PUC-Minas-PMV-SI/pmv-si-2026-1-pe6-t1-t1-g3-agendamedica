import { Request, Response, NextFunction } from "express";
import { UserRole } from "@prisma/client";

export function authorize(...roles: UserRole[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.userRole) {
            res.status(401).json({ error: "Token inválido ou expirado." });
            return;
        }

        if (!roles.includes(req.userRole)) {
            res.status(403).json({ error: "Acesso negado." });
            return;
        }

        return next();
    };
}
