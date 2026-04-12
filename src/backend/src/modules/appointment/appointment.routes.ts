import { Router } from "express";
import { AppointmentController } from "./appointment.controller";

const router = Router();
const controller = new AppointmentController();

router.post("/createAppointment", (req, res, next) => controller.create(req, res, next));
router.get("/listAppointments", (req, res, next) => controller.listByUser(req, res, next));
router.post("/cancelAppointment", (req, res, next) => controller.cancel(req, res, next));

export default router;
