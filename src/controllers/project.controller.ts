import { asyncHandler } from "../utils/async-handler.js";
import { ApiError, ApiResponse } from "../utils/api-responses.js";
import { Project } from "../models/project.model.js";
import { isValidObjectId } from "mongoose";
import { ProjectMember } from "../models/project-member.model.js";
import { avilableRoles, UserRoles } from "../utils/constants.js";

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

export const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const user = req.user!;

  const newProject = await Project.create({
    name,
    description,
    createdBy: user._id,
  });

  if (!newProject) throw new ApiError(400, "Something went wrong");

  await ProjectMember.create({
    project: newProject._id,
    user: user._id,
    role: UserRoles.ADMIN,
  });

  return res.status(201).json(
    new ApiResponse(201, "Project created", {
      project: newProject,
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

export const getProjectMembers = asyncHandler(async (req, res) => {
  const projectId = req.params.projectId;

  if (!isValidObjectId(projectId))
    throw new ApiError(400, "Invalid project ID");

  const project = await Project.findById(projectId);

  if (!project) throw new ApiError(400, "Project not found");

  const projectMembers = await ProjectMember.aggregate([
    {
      $match: {
        project: project._id,
      },
    },

    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",

        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              email: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },

    {
      $addFields: {
        user: {
          $arrayElemAt: ["$user", 0],
        },
      },
    },
    {
      $project: {
        project: 1,
        user: 1,
        role: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  if (!projectMembers)
    throw new ApiError(400, "No project members found");

  return res.status(200).json(
    new ApiResponse(200, "Project members fetched successfully", {
      projectMembers,
    }),
  );
});

export const updateProjectMemberRole = asyncHandler(
  async (req, res) => {
    const { role } = req.body;

    const projectId = req.params.projectId as string;

    const userId = req.params.userId as string;

    if (!isValidObjectId(userId))
      throw new ApiError(400, "Invalid user ID");

    if (!isValidObjectId(projectId))
      throw new ApiError(400, "Invalid project ID");

    if (!avilableRoles.includes(role))
      throw new ApiError(400, "Invalid role");

    const projectmember = await ProjectMember.findOneAndUpdate(
      {
        project: projectId,
        user: userId,
      },
      {
        $set: {
          role,
        },
      },
      {
        returnDocument: "after",
        upsert: true,
      },
    );

    if (!projectmember)
      throw new ApiError(400, "Project member not found");

    return res.status(200).json(
      new ApiResponse(200, "Project member updated", {
        projectmember,
      }),
    );
  },
);

export const deleteProjectMember = asyncHandler(async (req, res) => {
  const projectId = req.params.projectId as string;
  const userId = req.params.userId as string;

  if (!isValidObjectId(userId))
    throw new ApiError(400, "Invalid user ID");

  if (!isValidObjectId(projectId))
    throw new ApiError(400, "Invalid project ID");

  const deletedProjectMember = await ProjectMember.findOneAndDelete({
    project: projectId,
    user: userId,
  });

  if (!deletedProjectMember)
    throw new ApiError(400, "Project member not found");

  return res.status(200).json(
    new ApiResponse(200, "Project member deleted", {
      deletedProjectMember: deletedProjectMember,
    }),
  );
});

export const addMemberToProject = asyncHandler(async (req, res) => {
  const projectId = req.params.projectId as string;
  const userId = req.params.userId as string;

  const { role } = req.body;

  if (!isValidObjectId(userId))
    throw new ApiError(400, "Invalid user ID");

  if (!isValidObjectId(projectId))
    throw new ApiError(400, "Invalid project ID");

  const projectMember = await ProjectMember.findOneAndUpdate(
    {
      project: projectId,
      user: userId,
    },

    {
      project: projectId,
      user: userId,
      role,
    },
    {
      returnDocument: "after",
      upsert: true,
    },
  );

  if (!projectMember) throw new ApiError(400, "Something went wrong");

  return res.status(200).json(
    new ApiResponse(200, "Project member added", {
      projectMember,
    }),
  );
});
