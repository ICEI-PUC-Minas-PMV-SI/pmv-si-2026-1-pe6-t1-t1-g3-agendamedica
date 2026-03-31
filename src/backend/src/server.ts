import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import { logger } from "./utils/logger";
import authRoutes from "./modules/auth/auth.routes";

const app = express();
app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
});

app.use("/auth", authRoutes);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    logger.error("Unhandled error", { message: err.message, stack: err.stack });
    res.status(500).json({ error: "Erro interno do servidor." });
});

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
    logger.info(`MedHub API iniciada`, { port: PORT, env: process.env.NODE_ENV });
});

export default app;
