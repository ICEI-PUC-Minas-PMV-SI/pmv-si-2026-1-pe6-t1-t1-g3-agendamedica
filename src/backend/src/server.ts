import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import { logger } from "./utils/logger";

import clinicRoutes from "./modules/clinics/clinic.routes";
import appointmentRoutes from "./modules/appointment/appointment.routes";
import doctorRoutes from "./modules/doctors/doctor.routes";
import { env } from "./config/env"; // validates required env vars — throws on missing
import notificationRoutes from "./modules/notifications/notification.routes";
import userRoutes from "./modules/users/users.routes";
import authRoutes from "./modules/auth/auth.routes";

const app = express();

import cors from "cors";
app.use(cors());

app.use(express.json());
app.use("/appointments", appointmentRoutes);
app.use("/auth", authRoutes);
app.use("/notifications", notificationRoutes);
app.use("/users", userRoutes);

app.use("/clinics", clinicRoutes);
app.use("/doctors", doctorRoutes);

import { authenticate } from "./middleware/authenticate";
import { userRepository } from "./modules/users/user.repository";

app.get("/patients", authenticate, async (req: Request, res: Response) => {
    if (req.userRole !== "RECEPTIONIST" && req.userRole !== "DOCTOR") {
        return res.status(403).json({ error: "Acesso negado." });
    }
    const patients = await userRepository.findPatients();
    res.json(patients);
});

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
