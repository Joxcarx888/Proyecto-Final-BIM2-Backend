import { Router } from "express";
import { 
  listarReservacionesCliente, 
  listarReservacionesHotel, 
  listarTodasReservacionesAdmin,
  addReservation,
  removeRooms
} from "../reservations/reservation.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRol } from "../middlewares/validar-roles.js";

const router = Router();

router.get(
  '/client',
  validarJWT,
  tieneRol('CLIENT'),
  listarReservacionesCliente
);

router.get(
  '/hotel',
  validarJWT,
  tieneRol('HOTEL'),
  listarReservacionesHotel
);

router.get(
  '/admin',
  validarJWT,
  tieneRol('ADMIN'),
  listarTodasReservacionesAdmin
);

router.post(
  '/reservation/:id',
  validarJWT,
  addReservation
)

router.delete(
  '/delete-rooms/:id',
  validarJWT,
  removeRooms
)

export default router;
