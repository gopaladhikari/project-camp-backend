import { body, param } from "express-validator";

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

export const userLoginValidator = () => [
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

export const forgotPasswordValidator = () => [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .trim(),
];

export const resetPasswordValidator = () => [
  param("resetToken").notEmpty().withMessage("Invalid token").trim(),
  body("newPassword")
    .isLength({ min: 6, max: 20 })
    .withMessage("New password must be between 6 and 20 characters")
    .trim(),
];

export const changePasswordValidator = () => [
  body("oldPassword")
    .isLength({ min: 6, max: 20 })
    .withMessage("Old password must be between 6 and 20 characters")
    .trim(),
  body("newPassword")
    .isLength({ min: 6, max: 20 })
    .withMessage("New password must be between 6 and 20 characters")
    .trim(),
];
