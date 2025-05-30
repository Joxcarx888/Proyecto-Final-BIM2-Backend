import { Router } from "express";
import { check } from "express-validator";
import {
    createEvent,
    getEvents,
    listEventsAdmin,
    updateEvent,
    deleteEvent,
    listAllEvents,
    listEventsByHotel
} from "./event.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRol } from "../middlewares/validar-roles.js";
import { existenteEvent } from "../helpers/db-validator.js";

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        tieneRol("CLIENT"),
        check("event", "El nombre del evento es obligatorio").not().isEmpty(),
        check("cronograma", "La fecha del evento es obligatoria").isDate(),
        check("time", "La hora debe estar en formato hh:mm")
            .matches(/^([01]\d|2[0-3]):([0-5]\d)$/),
        check("hotel", "El nombre del hotel es obligatorio").not().isEmpty(),
        validarCampos,
    ],
    createEvent
);

router.get(
    '/',
    validarJWT,
    tieneRol("CLIENT"),
    getEvents

    );

router.get(
    '/hotel', 
    validarJWT,
    listEventsAdmin
);

router.put(
    "/:id",
    [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existenteEvent),
        check("event", "El nombre del evento es obligatorio").not().isEmpty(),
        check("date", "La fecha del evento es obligatoria").isDate(),
        check("time", "La hora debe estar en formato hh:mm")
            .matches(/^([01]\d|2[0-3]):([0-5]\d)$/),
        validarCampos,
    ],
    updateEvent
);


router.delete(
    "/:id",
    [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existenteEvent),
        validarCampos,
    ],
    deleteEvent
);

router.get(
    '/all',
    listAllEvents
);

router.get(
    '/byHotel/:id',
     listEventsByHotel
);

export default router;
