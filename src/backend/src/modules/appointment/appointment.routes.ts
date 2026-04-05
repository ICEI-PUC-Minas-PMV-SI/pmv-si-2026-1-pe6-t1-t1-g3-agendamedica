import { Router } from "express";
import { AppointmentController } from "./appointment.controller";

const router = Router();
const controller = new AppointmentController();

router.post("/cadastrar", (req, res, next) => controller.create(req, res, next));
router.post("/listar", (req, res, next) => controller.listByUser(req, res, next));
router.post("/cancelar", (req, res, next) => controller.cancel(req, res, next));

export default router;
