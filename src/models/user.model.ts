import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt, { type SignOptions } from "jsonwebtoken";
import type { IUser } from "../types/user.types.js";

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;
const accessTokenExpiry = process.env
  .ACCESS_TOKEN_EXPIRY as SignOptions["expiresIn"];
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string;
const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY;

const userSchema = new Schema<IUser>(
  {
    avatar: {
      type: String,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    fullName: {
      type: String,
    },

    password: {
      type: String,
      required: [true, "Please provide a password"],
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    refreshToken: {
      type: String,
    },

    accessToken: {
      type: String,
    },

    forgotPasswordToken: {
      type: String,
    },

    fogotPasswordExpires: {
      type: Date,
    },
    emailVerificationToken: {
      type: String,
    },

    emailVerificationExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (this.password && this.isModified("password"))
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordValid = async function (
  password: string,
) {
  const isMatch = await bcrypt.compare(password, this.password);

  return isMatch;
};

userSchema.methods.generateAccessToken = function () {
  const payload = {
    _id: this._id,
    username: this.username,
    email: this.email,
  };

  return jwt.sign(payload, accessTokenSecret, {
    expiresIn: accessTokenExpiry as NonNullable<
      SignOptions["expiresIn"]
    >,
  });
};

userSchema.methods.generateRefreshToken = function () {
  const payload = {
    _id: this._id,
  };

  return jwt.sign(payload, refreshTokenSecret, {
    expiresIn: refreshTokenExpiry as NonNullable<
      SignOptions["expiresIn"]
    >,
  });
};

userSchema.methods.generateToken = function () {
  const unhashedToken = crypto.randomBytes(64).toString("hex");

  const hashToken = crypto
    .createHash("sha256")
    .update(unhashedToken)
    .digest("hex");

  const tokenExpiry = Date.now() + 20 * 60 * 1000; // 20 minutes

  return {
    unhashedToken,
    hashToken,
    tokenExpiry,
  };
};

export const User = mongoose.model("User", userSchema);
