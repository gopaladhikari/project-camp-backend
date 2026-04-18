import { isValidObjectId } from "mongoose";

import { ApiError, ApiResponse } from "../utils/api-responses.js";
import { asyncHandler } from "../utils/async-handler.js";
import { Task } from "../models/task.model.js";

// List all tasks of a specific project
export const getTasks = asyncHandler(async (req, res) => {
  const projectId = req.params.projectId as string;

  if (!isValidObjectId(projectId))
    throw new ApiError(400, "Invalid project id");

  const tasks = await Task.find({ project: projectId })
    .populate("project")
    .populate("assignedTo")
    .populate("assignedBy");

  if (!tasks) throw new ApiError(404, "Task not found");

  return res
    .status(200)
    .json(new ApiResponse(200, "Task list fetched", { tasks }));
});

// Create a new task in a project
export const createTask = asyncHandler(async (req, res) => {});

// Get task details by task id and project id
export const getTaskById = asyncHandler(async (req, res) => {});

// Update task details by task id and project id
export const updateTaskById = asyncHandler(async (req, res) => {});

// Delete task by task id and project id
export const deleteTaskById = asyncHandler(async (req, res) => {});
