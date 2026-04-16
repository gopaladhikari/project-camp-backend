import { body } from "express-validator";

export const userRegisterValidator = () => [
  body("username")
    .isLength({ min: 4, max: 20 })
    .withMessage("Username must be between 4 and 20 characters")
    .isLowercase()
    .withMessage("Username must be lowercase")
    .trim()
    .escape(),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .trim()
    .escape(),

  body("password")
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be between 6 and 20 characters")
    .trim()
    .escape(),
];
