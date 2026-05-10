import { Request, Response } from "express";
import { RegisterSchema, LoginSchema } from "./auth.schema";
import { authService } from "./auth.service";

export async function register(req: Request, res: Response) {
    console.log("BODY RECEBIDO:", JSON.stringify(req.body));
    const result = RegisterSchema.safeParse(req.body);
    if (!result.success) {
        console.log("ZOD ERRO:", JSON.stringify(result.error.flatten()));
        const fields = result.error.flatten().fieldErrors;
        const message = Object.values(fields).flat()[0] ?? "Dados inválidos.";
        return res.status(400).json({ error: message });
    }

    try {
        const user = await authService.register(result.data);
        return res.status(201).json(user);
    } catch (error: unknown) {
        if (error instanceof Error) {
            const status = "statusCode" in error ? Number((error as any).statusCode) : 400;
            return res.status(status).json({ error: error.message });
        }
        return res.status(500).json({ error: "Erro interno do servidor." });
    }
}

export async function login(req: Request, res: Response) {
    const result = LoginSchema.safeParse(req.body);
    if (!result.success) {
        const fields = result.error.flatten().fieldErrors;
        const message = Object.values(fields).flat()[0] ?? "Dados inválidos.";
        return res.status(400).json({ error: message });
    }

    try {
        const data = await authService.login(result.data);
        return res.json(data);
    } catch (error: unknown) {
        if (error instanceof Error) {
            const status = "statusCode" in error ? Number((error as any).statusCode) : 401;
            return res.status(status).json({ error: error.message });
        }
        return res.status(500).json({ error: "Erro interno do servidor." });
    }
}
