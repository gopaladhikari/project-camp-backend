import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError, ApiResponse } from "../utils/api-responses.js";
import crypto from "crypto";
import type { IUser } from "../types/user.types.js";
import {
  emailVerificationEmailTemplate,
  sendEmail,
} from "../utils/mail.js";
import { siteUrl } from "../utils/constants.js";
import type { CookieOptions } from "express";
import jwt from "jsonwebtoken";

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

const cookiesOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
};

// Register new user
export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

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
    "-password -refreshToken -emailVerificationToken -emailVerificationExpires",
  );

  return res
    .status(201)
    .json(new ApiResponse(201, "User created", { user }));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) throw new ApiError(400, "User not found");

  const isPasswordValid = await user.isPasswordValid(password);

  if (!isPasswordValid)
    throw new ApiError(400, "Invalid email or password.");

  const { accessToken, refreshToken } =
    generateAccessAndRefreshTokens(user);

  await user.save();

  const loggedInUser = await User.findById(user._id).select(
    "-password -accessToken -refreshToken -emailVerificationToken -emailVerificationExpires",
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookiesOptions)
    .cookie("refreshToken", refreshToken, cookiesOptions)
    .json(
      new ApiResponse(200, "User logged in successfully", {
        user: loggedInUser,
        accessToken,
        refreshToken,
      }),
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
  const user = req.user!;

  await User.findByIdAndUpdate(
    user._id,
    {
      $unset: {
        accessToken: 1,
        refreshToken: 1,
      },
    },
    {
      returnDocument: "after",
    },
  );

  return res
    .status(200)
    .clearCookie("accessToken", cookiesOptions)
    .clearCookie("refreshToken", cookiesOptions)
    .json(new ApiResponse(200, "User logged out", null));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = req.user!;

  return res
    .status(200)
    .json(new ApiResponse(200, "User details", { user }));
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { verificationToken } = req.params;

  if (!verificationToken)
    throw new ApiError(400, "Invalid token here");

  const hashedVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken as string)
    .digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hashedVerificationToken,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) throw new ApiError(400, "Token is invalid or expired.");

  user.isEmailVerified = true;

  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Email verified", null));
});

export const resendEmailVerification = asyncHandler(
  async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) throw new ApiError(400, "User not found");

    if (user.isEmailVerified)
      throw new ApiError(409, "Email already verified");

    const { hashToken, tokenExpiry, unhashedToken } =
      user.generateToken();

    user.emailVerificationToken = hashToken;
    user.emailVerificationExpires = new Date(tokenExpiry);

    const content = emailVerificationEmailTemplate(
      `${siteUrl}/verify-email?token=${unhashedToken}`,
      user.username,
    );

    await sendEmail(content, user.email, "Verify your email");

    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, "Email verification resent", null));
  },
);

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incmoingRefreshToken =
    req.cookies.refreshToken || req.headers.authorization;

  if (!incmoingRefreshToken) throw new ApiError(400, "Invalid token");

  const decodedToken = jwt.verify(
    incmoingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET as string,
  ) as jwt.JwtPayload;

  const user = await User.findById(decodedToken._id).select(
    "-password -emailVerificationToken -emailVerificationExpires",
  );

  if (!user) throw new ApiError(400, "Invalid token");

  if (incmoingRefreshToken !== user.refreshToken)
    throw new ApiError(400, "Invalid token");

  const { accessToken, refreshToken: newRefreshToken } =
    generateAccessAndRefreshTokens(user);

  await user.save();

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookiesOptions)
    .cookie("refreshToken", newRefreshToken, cookiesOptions)
    .json(new ApiResponse(200, "Access token refreshed", { user }));
});
