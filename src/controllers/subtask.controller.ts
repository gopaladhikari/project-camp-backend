import { isValidObjectId } from "mongoose";
import { ApiError, ApiResponse } from "../utils/api-responses.js";
import { asyncHandler } from "../utils/async-handler.js";
import { Subtask } from "../models/subtask.model.js";

// Create a subtask of a task in a project
export const createSubtask = asyncHandler(async (req, res) => {});

// Update subtask details by subtask id and project id
export const updateSubtaskById = asyncHandler(async (req, res) => {});

// Delete subtask by subtask id and project id
export const deleteSubtaskById = asyncHandler(async (req, res) => {});
