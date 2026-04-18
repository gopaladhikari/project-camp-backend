import mongoose, { isValidObjectId } from "mongoose";
import { ApiError, ApiResponse } from "../utils/api-responses.js";
import { asyncHandler } from "../utils/async-handler.js";
import { Task } from "../models/task.model.js";
import { Project } from "../models/project.model.js";

// List all tasks of a specific project
export const getTasks = asyncHandler(async (req, res) => {
  const projectId = req.params.projectId as string;

  if (!isValidObjectId(projectId))
    throw new ApiError(400, "Invalid project id");

  const tasks = await Task.find({ project: projectId })
    .populate("project")
    .populate("assignedTo", "avatar username fullName")
    .populate("assignedBy", "avatar username fullName");

  if (!tasks) throw new ApiError(404, "Task not found");

  return res
    .status(200)
    .json(new ApiResponse(200, "Task list fetched", { tasks }));
});

// Create a new task in a project
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, assignedTo } = req.body;
  const projectId = req.params.projectId as string;

  if (!isValidObjectId(projectId))
    throw new ApiError(400, "Invalid project id");

  const project = await Project.findById(projectId);

  if (!project) throw new ApiError(404, "Project not found");

  const files = (req.files || []) as Express.Multer.File[];

  const attachments = files.map((file) => {
    return {
      url: `${process.env.SERVER_URL}/images/${file.originalname}`,
      mimeType: file.mimetype,
      size: file.size,
    };
  });

  const task = await Task.create({
    title,
    description,
    status,
    assignedTo: new mongoose.Types.ObjectId(assignedTo),
    project: new mongoose.Types.ObjectId(req.user?._id),
    assignedBy: project.createdBy,
    attachments,
  });

  if (!task) throw new ApiError(400, "Task creation failed");

  return res
    .status(201)
    .json(new ApiResponse(201, "Task created", { task }));
});

// Get task details by task id and project id
export const getTaskById = asyncHandler(async (req, res) => {
  const { taskId, projectId } = req.params;

  if (!isValidObjectId(taskId))
    throw new ApiError(400, "Invalid task id");

  if (!isValidObjectId(projectId))
    throw new ApiError(400, "Invalid project id");

  const task = await Task.aggregate([
    {
      $match: {
        _id: taskId,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "assignedTo",
        foreignField: "_id",
        as: "assignedTo",
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
      $lookup: {
        from: "subtasks",
        localField: "_id",
        foreignField: "task",
        as: "subtask",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "createdBy",
              foreignField: "_id",
              as: "createdBy",
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
        ],
      },
    },
    {
      $addFields: {
        createdBy: {
          $arrayElemAt: ["$createdBy", 0],
        },
      },
    },

    {
      $addFields: {
        subtask: {
          $arrayElemAt: ["$subtask", 0],
        },
      },
    },
  ]);

  if (task.length === 0) throw new ApiError(404, "Task not found");

  return res.status(200).json(
    new ApiResponse(200, "Task fetched successfully", {
      task: task[0],
    }),
  );
});

// Update task details by task id and project id
export const updateTaskById = asyncHandler(async (req, res) => {
  const projectId = req.params.projectId as string;
  const taskId = req.params.taskId as string;

  if (!isValidObjectId(projectId))
    throw new ApiError(400, "Invalid project id");

  if (!isValidObjectId(taskId))
    throw new ApiError(400, "Invalid task id");

  const { title, description, status, assignedTo } = req.body;

  const task = await Task.findOneAndUpdate(
    {
      _id: taskId,
      project: projectId,
    },
    {
      title,
      description,
      status,
      assignedTo: new mongoose.Types.ObjectId(assignedTo),
    },
    {
      new: true,
    },
  );

  if (!task) throw new ApiError(400, "Task update failed");

  return res.status(200).json(
    new ApiResponse(200, "Task updated", {
      task,
    }),
  );
});

// Delete task by task id and project id
export const deleteTaskById = asyncHandler(async (req, res) => {
  const projectId = req.params.projectId as string;
  const taskId = req.params.taskId as string;

  if (!isValidObjectId(projectId))
    throw new ApiError(400, "Invalid project id");

  if (!isValidObjectId(taskId))
    throw new ApiError(400, "Invalid task id");

  const task = await Task.findOneAndDelete({
    _id: taskId,
    project: projectId,
  });

  if (!task) throw new ApiError(400, "Task not found");

  return res
    .status(200)
    .json(new ApiResponse(200, "Task deleted", null));
});
