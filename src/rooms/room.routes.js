import { Router } from "express";
import {
  addRoom,
  getRoomsByHotelId,
  getMyHotelRooms
} from "./room.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRol } from "../middlewares/validar-roles.js";

const router = Router();


router.post(
  '/',
  validarJWT,
  tieneRol('HOTEL'),
  addRoom
);


router.get(
  '/hotel/:id',
  getRoomsByHotelId
);


router.get(
  '/my-hotel',
  validarJWT,
  getMyHotelRooms
);

export default router;
