import { Router } from "express";
import {
  createInvoice,
  getInvoicesByClient,
  getInvoicesByHotel
} from "./invoice.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRol } from "../middlewares/validar-roles.js";

const router = Router();

router.post(
  "/create",
  validarJWT,
  tieneRol("CLIENT"),
  createInvoice
);

router.get(
  "/client",
  validarJWT,
  tieneRol("CLIENT"),
  getInvoicesByClient
);

router.get(
  "/hotel",
  validarJWT,
  tieneRol("HOTEL"),
  getInvoicesByHotel
);

export default router;
