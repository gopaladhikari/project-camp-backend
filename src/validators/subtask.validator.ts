import { body, param } from "express-validator";

export const createSubtaskValidator = () => [
  param("projectId")
    .notEmpty()
    .withMessage("Project id is required")
    .isMongoId()
    .withMessage("Invalid project id")
    .trim(),

  param("taskId")
    .notEmpty()
    .withMessage("Task id is required")
    .isMongoId()
    .withMessage("Invalid task id")
    .trim(),

  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 4, max: 100 })
    .withMessage("Title must be between 4 and 100 characters")
    .trim()
    .escape(),

  body("description")
    .isLength({ min: 4, max: 500 })
    .withMessage("Description must be between 4 and 500 characters")
    .trim()
    .escape(),

  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isBoolean()
    .withMessage("Invalid status")
    .trim(),
];

export const updateSubtaskValidator = () => [
  param("projectId")
    .notEmpty()
    .withMessage("Project id is required")
    .isMongoId()
    .withMessage("Invalid project id")
    .trim(),

  param("subTaskId")
    .notEmpty()
    .withMessage("Subtask id is required")
    .isMongoId()
    .withMessage("Invalid subtask id")
    .trim(),

  body("title")
    .isLength({ min: 4, max: 100 })
    .withMessage("Title must be between 4 and 100 characters")
    .trim()
    .escape(),

  body("description")
    .isLength({ min: 4, max: 500 })
    .withMessage("Description must be between 4 and 500 characters")
    .trim()
    .escape(),

  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isBoolean()
    .withMessage("Invalid status")
    .trim(),
];
