import { Router } from "express";
import {
  registerUser,
  loginUser,
  verifyEmail,
  logoutUser,
} from "../controllers/auth.controller.js";
import { validateRequest } from "../middlewares/validator.middleware.js";
import {
  userLoginValidator,
  userRegisterValidator,
} from "../validators/auth.validator.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter
  .route("/register")
  .post(userRegisterValidator(), validateRequest, registerUser);

authRouter
  .route("/login")
  .post(userLoginValidator(), validateRequest, loginUser);

authRouter.route("/logout").post(verifyJwt, logoutUser);

authRouter.route("/verify-email").post(verifyEmail);

export { authRouter };
