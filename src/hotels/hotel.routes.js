import { Router } from "express"
import { check } from "express-validator"
import { getHotels, addHotel, updateHotel, getHotelById, deleteHotel } from "./hotel.controller.js"
import { existeHotelById } from "../helpers/db-validator.js"
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

// router.put(
//     "/update-user/:id",
//     [
//         check("id", "Is not a valid ID").isMongoId(),
//         check("id").custom(userExistsById),
//         validateFields,
//         deleteFileOnError
//     ],
//     updateUser
// )

// router.put(
//     "/update-role/:id",
//     [
//         check("id", "Is not a valid ID").isMongoId(),
//         check("id").custom(userExistsById),
//         validateFields,
//         deleteFileOnError
//     ],
//     updateRoleUser
// )

// router.put(
//     "/update-shoppingCart/:id",
//     [
//         check("id", "Is not a valid ID").isMongoId(),
//         check("id").custom(productExistById),
//         validateFields,
//         deleteFileOnError
//     ],
//     addProductToUser
// )

// router.delete(
//     "/delete-user/:id",
//     [
//         check("id", "Is not a valid ID").isMongoId(),
//         check("id").custom(userExistsById),
//         validateFields,
//         deleteFileOnError
//     ],
//     deleteUser
// )

export default router