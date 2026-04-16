import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError, ApiResponse } from "../utils/api-responses.js";
import type { IUser } from "../types/user.types.js";
import {
  emailVerificationEmailTemplate,
  sendEmail,
} from "../utils/mail.js";
import { siteUrl } from "../utils/constants.js";

// Generate access and refresh tokens
const generateAccessAndRefreshTokens = (user: IUser) => {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.accessToken = accessToken;
    user.refreshToken = refreshToken;

    return { accessToken, refreshToken };
  } catch (error) {
    const err = error as Error;
    throw new ApiError(400, err.message);
  }
};

// Register new user
export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.body;

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) throw new ApiError(400, "User already exists");

  const newUser = await User.create({
    username,
    email,
    password,
  });

  if (!newUser) throw new ApiError(400, "Something went wrong");

  const { hashToken, tokenExpiry, unhashedToken } =
    newUser.generateToken();

  generateAccessAndRefreshTokens(newUser);

  newUser.emailVerificationToken = hashToken;
  newUser.emailVerificationExpires = new Date(tokenExpiry);

  await newUser.save();

  const content = emailVerificationEmailTemplate(
    `${siteUrl}/verify-email?token=${unhashedToken}`,
    newUser.username,
  );

  await sendEmail(content, newUser.email, "Verify your email");

  const user = await User.findById(newUser._id).select(
    "-password -refreshToken -accessToken -emailVerificationToken -emailVerificationExpires",
  );

  return res
    .status(201)
    .json(new ApiResponse(201, "User created", { user }));
});

const loginUser = asyncHandler(async (req, res) => {});

const verifyEmail = asyncHandler(async (req, res) => {});
