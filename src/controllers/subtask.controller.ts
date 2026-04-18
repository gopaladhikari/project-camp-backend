import mongoose, { isValidObjectId } from "mongoose";
import { ApiError, ApiResponse } from "../utils/api-responses.js";
import { asyncHandler } from "../utils/async-handler.js";
import { Subtask } from "../models/subtask.model.js";
import { Project } from "../models/project.model.js";

// Create a subtask of a task in a project
export const createSubtask = asyncHandler(async (req, res) => {
  const projectId = req.params.projectId as string;
  const taskId = req.params.taskId as string;

  if (!isValidObjectId(projectId))
    throw new ApiError(400, "Invalid project id");

  if (!isValidObjectId(taskId))
    throw new ApiError(400, "Invalid task id");

  const { title, description, status } = req.body;

  const project = await Project.findById(projectId);

  if (!project) throw new ApiError(404, "Project not found");

  const subtask = await Subtask.create({
    title,
    description,
    status,
    task: new mongoose.Types.ObjectId(taskId),
  });

  if (!subtask) throw new ApiError(400, "Subtask creation failed");

  return res
    .status(201)
    .json(new ApiResponse(201, "Subtask created", { subtask }));
});

// Update subtask details by subtask id and project id
export const updateSubtaskById = asyncHandler(async (req, res) => {
  const projectId = req.params.projectId as string;

  const subtaskId = req.params.subTaskId as string;

  const { title, description, status } = req.body;

  if (!isValidObjectId(projectId))
    throw new ApiError(400, "Invalid project id");

  if (!isValidObjectId(subtaskId))
    throw new ApiError(400, "Invalid subtask id");

  const project = await Project.findById(projectId);

  if (!project) throw new ApiError(404, "Project not found");

  const subtask = await Subtask.findOneAndUpdate(
    {
      _id: subtaskId,
      project: projectId,
    },
    {
      title,
      description,
      status,
    },
    {
      new: true,
    },
  );
  if (!subtask) throw new ApiError(400, "Subtask update failed");
  return res.status(200).json(
    new ApiResponse(200, "Subtask updated", {
      subtask,
    }),
  );
});

// Delete subtask by subtask id and project id
export const deleteSubtaskById = asyncHandler(async (req, res) => {
  const projectId = req.params.projectId as string;

  const subtaskId = req.params.subTaskId as string;

  if (!isValidObjectId(projectId))
    throw new ApiError(400, "Invalid project id");

  if (!isValidObjectId(subtaskId))
    throw new ApiError(400, "Invalid subtask id");

  const project = await Project.findById(projectId);

  if (!project) throw new ApiError(404, "Project not found");

  const subtask = await Subtask.findByIdAndDelete({
    _id: subtaskId,
  });

  if (!subtask) throw new ApiError(400, "Subtask not found");

  return res
    .status(200)
    .json(new ApiResponse(200, "Subtask deleted", null));
});
