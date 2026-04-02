import { Router } from "express";
import { AppointmentController } from "./controller";

const router = Router();
const controller = new AppointmentController();

router.post("/cadastrar", (req, res, next) => controller.create(req, res, next));
router.post("/listar", (req, res, next) => controller.listByUser(req, res, next));

export default router;
