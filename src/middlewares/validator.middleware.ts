import { validationResult } from "express-validator";
import { ApiError } from "../utils/api-responses.js";
import { asyncHandler } from "../utils/async-handler.js";

export const validateRequest = asyncHandler(
  async (req, _res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) return next();

    const err: Record<string, string>[] = [];

    errors.array().forEach((error) => {
      err.push({
        [error.type]: error.msg,
      });
    });

    throw new ApiError(422, "Validation failed", err);
  },
);
