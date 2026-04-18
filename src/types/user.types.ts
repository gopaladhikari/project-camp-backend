import type { Document } from "mongoose";
import type { UserRoles } from "../utils/constants.js";

export type IUser = {
  isPasswordValid(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
  generateToken(): {
    unhashedToken: string;
    hashToken: string;
    tokenExpiry: number;
  };
  avatar: string;
  username: string;
  email: string;
  fullName: string;
  password: string;
  isEmailVerified: boolean;
  refreshToken: string;
  accessToken: string;
  forgotPasswordToken: string | undefined;
  fogotPasswordExpires: Date | undefined;
  emailVerificationToken: string | undefined;
  emailVerificationExpires: Date | undefined;
  role: UserRoles;
} & Document;
