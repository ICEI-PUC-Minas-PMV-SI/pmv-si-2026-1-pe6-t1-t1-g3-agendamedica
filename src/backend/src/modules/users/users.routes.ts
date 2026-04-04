// src/backend/src/routes/user.routes.ts
import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { updatePushToken } from "./users.controller";

const router = Router();

router.use(authenticate);

router.patch("/me/push-token", updatePushToken);

export default router;
