import { Router } from "express";
import { 
  listarReservacionesCliente, 
  listarReservacionesHotel, 
  listarTodasReservacionesAdmin,
  addReservation,
<<<<<<< HEAD
  removeRooms,
  deleteReservation
=======
  removeRooms
>>>>>>> acarrillo-2020412
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
<<<<<<< HEAD
  tieneRol('CLIENT'),
=======
>>>>>>> acarrillo-2020412
  addReservation
)

router.delete(
<<<<<<< HEAD
  '/delete-rooms',
  validarJWT,
  tieneRol('CLIENT'),
  removeRooms
);

router.delete(
  '/reservation/:id', 
  validarJWT,
  tieneRol('CLIENT'),
  deleteReservation
);

=======
  '/delete-rooms/:id',
  validarJWT,
  removeRooms
)
>>>>>>> acarrillo-2020412

export default router;
