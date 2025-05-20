import { Router } from "express";
import { login, register, registerHotelAdmin } from "../auth/auth.controller.js";
import { registerValidator, loginValidator, registerHotelAdminValidator } from "../middlewares/validator.js";

const router = Router();

router.post(
  '/login',
  loginValidator,
  login
);

router.post(
  '/register',
  registerValidator,
  register
);

router.post(
    '/register-hotel-admin',
    registerHotelAdminValidator,
    registerHotelAdmin
  );

export default router;
