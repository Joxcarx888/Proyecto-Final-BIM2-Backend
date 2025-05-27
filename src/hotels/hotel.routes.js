import { Router } from "express"
import { check } from "express-validator"
import { getHotels, addHotel, updateHotel, getHotelById, deleteHotel, getHotelByName } from "./hotel.controller.js"
import { existeHotelById, existeHotelByName } from "../helpers/db-validator.js"
import { validarCampos } from "../middlewares/validar-campos.js"
import { deleteFileOnError } from "../middlewares/delete-file-on-error.js"

const router = Router()

router.get("/", getHotels)

router.get(
    "/get-hotel-by-id/:id",
    [
        check("id").custom(existeHotelById)
    ],
    getHotelById
)

router.get(
    "/get-hotel-by-name/:name",
    [
        check("name").custom(existeHotelByName)
    ],
    getHotelByName
)

router.delete(
    "/delete-hotel/:id",
    [
        check("id").custom(existeHotelById)
    ],
    deleteHotel
)

router.post(
    "/add-hotel/",
    [
        validarCampos,
        deleteFileOnError
    ],
    addHotel
)

router.put(
    "/update-hotel/:id",
    [
        validarCampos,
        deleteFileOnError,
        check("id").custom(existeHotelById)
    ],
    updateHotel
)

export default router