import { Router } from "express";
import { AppointmentController } from "./appointment.controller";
import { authenticate } from "../../middleware/authenticate";

const router = Router();
const controller = new AppointmentController();

router.use(authenticate);

router.get("/", (req, res, next) => controller.listAppointments(req, res, next));
router.get("/:id", (req, res, next) => controller.getById(req, res, next));
router.post("/createAppointment", (req, res, next) => controller.create(req, res, next));
router.get("/listAppointments", (req, res, next) => controller.listByUser(req, res, next));
router.post("/cancelAppointment", (req, res, next) => controller.cancel(req, res, next));
router.patch("/confirmAppointment", (req, res, next) => controller.confirm(req, res, next));
router.patch("/:id", (req, res, next) => controller.update(req, res, next));

export default router;
