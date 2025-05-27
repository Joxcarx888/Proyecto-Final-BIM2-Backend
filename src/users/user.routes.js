import { Router } from "express";
import { check } from "express-validator";
import { updateUser, deleteUser, acceptUser, getUsers } from "./user.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

// Editar usuario
router.put(
  "/editar/:id?",
  [
    validarJWT,
    check("id", "No es un ID válido").optional().isMongoId(),
    check("name", "El nombre es obligatorio").optional().notEmpty(),
    check("email", "El email no es válido").optional().isEmail(),
    check("newPassword", "La nueva contraseña debe tener al menos 8 caracteres").optional().isLength({ min: 8 }),
    validarCampos
  ],
  updateUser
);

router.delete(
  "/eliminar/:id?",
  [
    validarJWT,
    check("password", "La contraseña es obligatoria")
      .if((value, { req }) => req.usuario.role === "USER")
      .notEmpty(),
    validarCampos
  ],
  deleteUser
);

router.put(
  "/aceptar/:id",
  [
    validarJWT,
    check("id", "El ID no es válido").isMongoId(),
    validarCampos
  ],
  acceptUser
);

router.get(
  "/listar",
  [
    validarJWT,
    validarCampos
  ],
  getUsers
);

export default router;
