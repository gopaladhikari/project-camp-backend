import { asyncHandler } from "../utils/async-handler.js";
import { ApiError, ApiResponse } from "../utils/api-responses.js";
import { Project } from "../models/project.model.js";
import { isValidObjectId } from "mongoose";
import { ProjectMember } from "../models/project-member.model.js";

// Getting all projects
export const getProjects = asyncHandler(async (req, res) => {
  const user = req.user!;

  const projects = await ProjectMember.aggregate([
    {
      $match: {
        user: user._id,
      },
    },
    {
      $lookup: {
        from: "projects",
        localField: "project",
        foreignField: "_id",
        as: "project",

        pipeline: [
          {
            $lookup: {
              from: "projectmembers",
              localField: "_id",
              foreignField: "projects",
              as: "projectmembers",
            },
          },
          {
            $addFields: {
              members: {
                $size: "$projectmembers",
              },
            },
          },
        ],
      },
    },

    {
      $unwind: "$project",
    },

    {
      $project: {
        project: {
          _id: 1,
          name: 1,
          description: 1,
          project: 1,
          createdBy: 1,
          members: 1,
          createdAt: 1,
          updatedAt: 1,
        },
        role: 1,
      },
    },
  ]);

  if (!projects) throw new ApiError(400, "No projects found");

  return res.status(200).json(
    new ApiResponse(200, "Projects fetched successfully", {
      projects,
    }),
  );
});

export const getProjectById = asyncHandler(async (req, res) => {
  const projectId = req.params.projectId;

  if (!isValidObjectId(projectId))
    throw new ApiError(400, "Invalid project ID");

  const project = await Project.findById(projectId);

  if (!project) throw new ApiError(400, "Project not found");

  return res
    .status(200)
    .json(new ApiResponse(200, "Project found", { project }));
});

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
