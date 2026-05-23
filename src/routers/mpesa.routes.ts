// src/routes/mpesa.routes.ts

import { Router } from "express";
import { MpesaController } from "../controller/mpesa.controller";

const router = Router();

const controller =
    new MpesaController();



router.post(
    "/callback",
    controller.callback
);

export default router;