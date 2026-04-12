import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import { logger } from "./utils/logger";
import appointmentRoutes from "./modules/appointment/appointment.routes";
import { env } from "./config/env"; // validates required env vars — throws on missing
import notificationRoutes from "./modules/notifications/notification.routes";
import userRoutes from "./modules/users/users.routes";
import authRoutes from "./modules/auth/auth.routes";

const app = express();

app.use(express.json());
app.use("/appointments", appointmentRoutes);
app.use("/auth", authRoutes);
app.use("/notifications", notificationRoutes);
app.use("/users", userRoutes);

app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    logger.error("Unhandled error", { message: err.message, stack: err.stack });
    res.status(500).json({ error: "Erro interno do servidor." });
});

app.listen(env.PORT, () => {
    logger.info(`MedHub API iniciada`, { port: env.PORT, env: env.NODE_ENV });
});

export default app;
