import { Router } from "express";
import * as ClinicController from "./clinic.controller";

const routes = Router();

routes.post("/", ClinicController.create);
routes.get("/", ClinicController.listAll);

// Nova rota que o Omar pediu:
routes.patch("/:id", ClinicController.update);

export default routes;
