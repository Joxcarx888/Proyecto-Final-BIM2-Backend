import { Router } from "express";
import { check } from "express-validator";
import {
    createEvent,
    getEvents,
    listEventsAdmin,
    updateEvent,
    deleteEvent,
} from "./event.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { existenteEvent } from "../helpers/db-validator.js";

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        check("event", "El nombre del evento es obligatorio").not().isEmpty(),
        check("cronograma", "La fecha del evento es obligatoria").isDate(),
        check("time", "La duración del evento es obligatoria").isNumeric(),
        check("hotel", "El nombre del hotel es obligatorio").not().isEmpty(),
        validarCampos,
    ],
    createEvent
);

router.get('/', validarJWT, getEvents);

router.get(
    '/admin/all', 
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
        check("cronograma", "La fecha del evento es obligatoria").isDate(),
        check("time", "La duración del evento es obligatoria").isNumeric(),
        check("hotel", "El nombre del hotel es obligatorio").not().isEmpty(),
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

export default router;
