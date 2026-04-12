import { Request, Response } from "express";
import { RegisterSchema, LoginSchema } from "./auth.schema";
import { authService } from "./auth.service";

export async function register(req: Request, res: Response) {
    const result = RegisterSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error.flatten() });
    }

    try {
        const user = await authService.register(result.data);
        return res.status(201).json(user);
    } catch (error: unknown) {
        if (error instanceof Error) {
            const status = "statusCode" in error ? Number(error.statusCode) : 400;
            return res.status(status).json({ error: error.message });
        }
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
}

export async function login(req: Request, res: Response) {
    const result = LoginSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error.flatten() });
    }

    try {
        const data = await authService.login(result.data);
        return res.json(data);
    } catch (error: unknown) {
        if (error instanceof Error) {
            const status = "statusCode" in error ? Number(error.statusCode) : 401;
            return res.status(status).json({ error: error.message });
        }

        return res.status(500).json({ error: "Erro interno do servidor" });
    }
}
