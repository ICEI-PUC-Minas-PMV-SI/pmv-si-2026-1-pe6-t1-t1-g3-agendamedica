import { Router } from "express";
import { AppointmentController } from "./controller";

const router = Router();
const controller = new AppointmentController();

router.post("/", (req, res, next) => controller.create(req, res, next));

export default router;
