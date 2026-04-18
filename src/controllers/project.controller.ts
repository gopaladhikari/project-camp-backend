import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError, ApiResponse } from "../utils/api-responses.js";
import { Project } from "../models/project.model.js";
import mongoose, { isValidObjectId } from "mongoose";
import { ProjectMember } from "../models/project-member.model.js";
import { UserRoles } from "../utils/constants.js";

// Getting all projects
export const getProjects = asyncHandler(async (req, res) => {
  const user = req.user!;

  const projects = await Project.find({ createdBy: user._id });

  if (!projects) throw new ApiError(400, "No projects found");

  return res
    .status(200)
    .json(new ApiResponse(200, "Projects found", projects));
});

// Creating a project
export const createProject = asyncHandler(async (req, res) => {
  const user = req.user!;

  const { name, description } = req.body;

  const project = await Project.create({
    name,
    description,
    createdBy: new mongoose.Types.ObjectId(user._id),
  });

  await ProjectMember.create({
    project: new mongoose.Types.ObjectId(project._id),
    user: new mongoose.Types.ObjectId(user._id),
    role: UserRoles.ADMIN,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Project created", { project }));
});

export const getProjectById = asyncHandler(async (req, res) => {});

export const updateProject = asyncHandler(async (req, res) => {
  const user = req.user!;

  const projectId = req.params.projectId;

  if (!isValidObjectId(projectId))
    throw new ApiError(400, "Invalid project ID");

  const { name, description } = req.body;

  const project = await Project.findById(projectId);

  if (!project) throw new ApiError(400, "Project not found");

  if (project.createdBy.toString() !== user._id.toString())
    throw new ApiError(
      400,
      "You are not authorized to update this project",
    );

  const updatedProject = await project.updateOne({
    name,
    description,
  });

  return res.status(200).json(
    new ApiResponse(200, "Project updated", {
      project: updatedProject,
    }),
  );
});

export const deleteProject = asyncHandler(async (req, res) => {
  const user = req.user!;
  const projectId = req.params.projectId;

  if (!isValidObjectId(projectId))
    throw new ApiError(400, "Invalid project ID");

  const project = await Project.findOneAndDelete({
    _id: projectId,
    createdBy: user._id,
  });

  if (!project) throw new ApiError(400, "Project not found");

  return res
    .status(200)
    .json(new ApiResponse(200, "Project deleted", null));
});

export const getProjectMembers = asyncHandler(async (req, res) => {});

export const addProjectMember = asyncHandler(async (req, res) => {});

export const updateProjectMemberRole = asyncHandler(
  async (req, res) => {},
);

export const deleteProjectMember = asyncHandler(
  async (req, res) => {},
);
