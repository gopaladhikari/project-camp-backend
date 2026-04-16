import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError, ApiResponse } from "../utils/api-responses.js";
import type { IUser } from "../types/user.types.js";
import {
  emailVerificationEmailTemplate,
  sendEmail,
} from "../utils/mail.js";
import { siteUrl } from "../utils/constants.js";
import type { CookieOptions } from "express";

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
    .json(new ApiResponse(200, "User logged out", {}));
});

export const verifyEmail = asyncHandler(async (req, res) => {});
