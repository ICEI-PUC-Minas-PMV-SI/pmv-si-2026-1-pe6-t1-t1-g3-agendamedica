import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { UserRole } from "@prisma/client";
import { env } from "../config/env";

declare global {
    namespace Express {
        interface Request {
            userId: string;
            userRole?: UserRole;
        }
    }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) {
        res.status(401).json({ error: "Token não fornecido." });
        return;
    }

    try {
        const token = auth.slice(7);
        const payload = jwt.verify(token, env.JWT_SECRET, {
            algorithms: ["HS256"],
        }) as jwt.JwtPayload;
        if (typeof payload.sub !== "string") {
            res.status(401).json({ error: "Token inválido ou expirado." });
            return;
        }
        req.userId = payload.sub;
        return next();
    } catch {
        res.status(401).json({ error: "Token inválido ou expirado." });
    }
}
