import { Router } from "express";
import {
  registerUser,
  loginUser,
  verifyEmail,
  logoutUser,
  getCurrentUser,
  resendEmailVerification,
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

authRouter.route("/current-user").get(verifyJwt, getCurrentUser);

authRouter
  .route("/verify-email/:verificationToken")
  .post(verifyEmail);

authRouter
  .route("/resend-email-verification")
  .post(resendEmailVerification);

export { authRouter };
