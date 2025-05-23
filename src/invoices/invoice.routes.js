import { Router } from "express";
import {
  createInvoice,
  getInvoicesByClient,
  getInvoicesByHotel,
  getInvoicesByAdmin,
  createInvoiceEvent
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

router.get(
  "/admin",
  validarJWT,
  tieneRol("ADMIN"),
  getInvoicesByAdmin
);

router.post(
  "/create/event",
  validarJWT,
  tieneRol("CLIENT"),
  createInvoiceEvent
);


export default router;
