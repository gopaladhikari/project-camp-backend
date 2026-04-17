import type { Document } from "mongoose";

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
  forgotPasswordToken: string;
  fogotPasswordExpires: Date;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
} & Document;
