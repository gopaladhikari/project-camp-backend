import { Router } from "express";
import { registerUser } from "../controllers/auth.controller.js";
import { validateRequest } from "../middlewares/validator.middleware.js";
import { userRegisterValidator } from "../validators/index.js";

const authRouter = Router();

authRouter
  .route("/register")
  .post(userRegisterValidator(), validateRequest, registerUser);

export { authRouter };
