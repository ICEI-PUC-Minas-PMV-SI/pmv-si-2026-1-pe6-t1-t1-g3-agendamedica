import { Router } from "express";
import * as ClinicController from "./clinic.controller";

const routes = Router();

routes.post("/", ClinicController.create);
routes.get("/", ClinicController.listAll);

export default routes;
