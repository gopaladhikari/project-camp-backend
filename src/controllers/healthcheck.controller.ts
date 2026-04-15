import { ApiError, ApiResponse } from "../utils/api-response.js";
import type { Response, Request } from "express";

export const healthCheck = (_req: Request, res: Response) => {
  try {
    res
      .status(200)
      .json(new ApiResponse(200, "Health Check Successful", {}));
  } catch (error) {
    res
      .status(500)
      .json(
        new ApiError(
          500,
          "Health Check Failed",
          (error as Error).message,
        ),
      );
  }
};
