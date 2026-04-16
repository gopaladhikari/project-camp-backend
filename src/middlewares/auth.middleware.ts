import { User } from "../models/user.model.js";
import { ApiError } from "../utils/api-responses.js";
import { asyncHandler } from "../utils/async-handler.js";
import jwt, { type JwtPayload } from "jsonwebtoken";

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

export const verifyJwt = asyncHandler(async (req, _res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.headers.authorization?.replace("Bearer ", "");

  if (!token)
    throw new ApiError(401, "Unauthorized", "No token provided");

  const decoded = jwt.verify(
    token,
    accessTokenSecret as string,
  ) as JwtPayload;

  if (!decoded)
    throw new ApiError(401, "Unauthorized", "Invalid token");

  const user = await User.findById(decoded._id);

  if (!user) throw new ApiError(401, "Unauthorized", "Invalid token");

  req.user = user;

  next();
});
