import { body, param } from "express-validator";

export const noteIdAndProjectIdValidator = () => [
  param("noteId")
    .notEmpty()
    .withMessage("Note id is required")
    .isMongoId()
    .withMessage("Invalid note id")
    .trim(),
  param("projectId")
    .notEmpty()
    .withMessage("Project id is required")
    .isMongoId()
    .withMessage("Invalid project id")
    .trim(),
];

export const noteValidator = () => [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 4, max: 20 })
    .withMessage("Title must be between 4 and 20 characters")
    .trim(),
  body("description")
    .optional()
    .withMessage("Description is required")
    .isLength({ min: 4, max: 1000 })
    .withMessage("Description must be between 4 and 1000 characters")
    .trim(),
];
