// src/backend/src/middleware/authorize.ts
import { Request, Response, NextFunction } from "express";
import { UserRole } from "@prisma/client";
import { prisma } from "../lib/prisma";

export function authorize(...roles: UserRole[]) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: { role: true },
      });

      if (!user) {
        res.status(401).json({ error: "Usuário não encontrado." });
        return;
      }

      if (!roles.includes(user.role)) {
        res.status(403).json({ error: "Acesso negado." });
        return;
      }

      req.userRole = user.role;
      next();
    } catch {
      next(new Error("Erro ao verificar permissões."));
    }
  };
}
