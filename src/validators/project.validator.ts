import { body, param } from "express-validator";
import { avilableRoles, UserRoles } from "../utils/constants.js";

export const createProjectValidator = () => [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 4, max: 100 })
    .withMessage("Name must be between 4 and 100 characters")
    .trim()
    .escape(),

  body("description")
    .isLength({ min: 4, max: 500 })
    .withMessage("Description must be between 4 and 500 characters")
    .trim()
    .escape(),
];

export const updateProjectValidator = () => [
  param("projectId")
    .notEmpty()
    .withMessage("Project id is required")
    .isMongoId()
    .withMessage("Invalid project id")
    .trim(),

  body("name")
    .isLength({ min: 4, max: 20 })
    .withMessage("Name must be between 4 and 20 characters")
    .trim()
    .escape(),

  body("description")
    .isLength({ min: 4, max: 200 })
    .withMessage("Description must be between 4 and 200 characters")
    .trim()
    .escape(),
];

export const projectIdValidator = () => [
  param("projectId")
    .notEmpty()
    .withMessage("Project id is required")
    .isMongoId()
    .withMessage("Invalid project id")
    .trim(),
];

export const addProjectMemberValidator = () => [
  param("projectId")
    .notEmpty()
    .withMessage("Project id is required")
    .isMongoId()
    .withMessage("Invalid project id")
    .trim(),

  param("userId")
    .notEmpty()
    .withMessage("User id is required")
    .isMongoId()
    .withMessage("Invalid user id")
    .trim(),

  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(Object.values(UserRoles))
    .withMessage("Invalid role")
    .trim(),
];

export const projectIdAndUserIdValidator = () => [
  param("projectId")
    .notEmpty()
    .withMessage("Project id is required")
    .isMongoId()
    .withMessage("Invalid project id")
    .trim(),

  param("userId")
    .notEmpty()
    .withMessage("User id is required")
    .isMongoId()
    .withMessage("Invalid user id")
    .trim(),
];

export const projectIdAndUserIdAndRoleValidator = () => [
  ...projectIdAndUserIdValidator(),
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(avilableRoles)
    .withMessage("Invalid role")
    .trim(),
];
