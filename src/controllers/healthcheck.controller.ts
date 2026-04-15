import { ApiError, ApiResponse } from "../utils/api-responses.js";
import type { Response, Request } from "express";
import { asyncHandler } from "../utils/async-handler.js";

export const healthCheck = asyncHandler(
  async (_req: Request, res: Response) => {
    try {
      res.status(200).json(new ApiResponse(200, "OK", true));
    } catch (error) {
      throw new ApiError(500, (error as Error).message);
    }
  },
);
