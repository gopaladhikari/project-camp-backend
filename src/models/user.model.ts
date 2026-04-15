import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
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
      required: true,
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

export const User = mongoose.model("User", userSchema);
