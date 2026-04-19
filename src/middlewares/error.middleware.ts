import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-responses.js";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (process.env.NODE_ENV === "development") console.error(err);

  if (err instanceof ApiError)
    return res.status(err.status).json(err);

  return res
    .status(500)
    .json(new ApiError(500, "Internal server error"));
};
