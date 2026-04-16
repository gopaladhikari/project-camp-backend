import { Router } from "express";
import {
  registerUser,
  loginUser,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { validateRequest } from "../middlewares/validator.middleware.js";
import {
  userLoginValidator,
  userRegisterValidator,
} from "../validators/auth.validator.js";

const authRouter = Router();

authRouter
  .route("/register")
  .post(userRegisterValidator(), validateRequest, registerUser);

authRouter
  .route("/login")
  .post(userLoginValidator(), validateRequest, loginUser);

authRouter.route("/verify-email").post(verifyEmail);

export { authRouter };
