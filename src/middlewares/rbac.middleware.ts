import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/async-handler.js";
import { avilableRoles } from "../utils/constants.js";
import { ProjectMember } from "../models/project-member.model.js";
import { ApiError } from "../utils/api-responses.js";

export const rbacMiddleware = (roles: typeof avilableRoles) =>
  asyncHandler(async (req, _res, next) => {
    const projectId = req.params.projectId as string;

    if (!isValidObjectId(projectId))
      throw new Error("Invalid ObjectId");

    const project = await ProjectMember.findOne({
      project: projectId,
      user: req.user!._id as mongoose.Types.ObjectId,
    });

    if (!project) throw new ApiError(400, "Project not found", null);

    const givenRole = project.role;

    req.user!.role = givenRole;

    if (!roles.includes(givenRole))
      throw new ApiError(403, "Forbidden", null);

    next();
  });
