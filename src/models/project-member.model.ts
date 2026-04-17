import mongoose, { Schema } from "mongoose";
import { UserRoles, avilableRoles } from "../utils/constants.js";

const projectMemberSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    role: {
      type: String,
      enum: avilableRoles,
      default: UserRoles.MEMBER,
      required: true,
    },
  },
  { timestamps: true },
);

export const ProjectMember = mongoose.model(
  "ProjectMember",
  projectMemberSchema,
);
