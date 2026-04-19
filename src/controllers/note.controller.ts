import { asyncHandler } from "../utils/async-handler.js";
import { ApiError, ApiResponse } from "../utils/api-responses.js";
import { isValidObjectId } from "mongoose";
import { Note } from "../models/note.model.js";
import mongoose from "mongoose";

// List all the notes of a specifc project
export const getProjectNotes = asyncHandler(async (req, res) => {
  const projectId = req.params.projectId as string;

  if (!isValidObjectId(projectId))
    throw new ApiError(400, "Invalid project id.");

  const notes = await Note.find({ project: projectId });

  if (notes.length === 0)
    throw new ApiError(404, "There are no notes in this project");

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Notes fetched successfully", { notes }),
    );
});

export const createProjectNote = asyncHandler(async (req, res) => {
  const projectId = req.params.projectId as string;

  const { title, description } = req.body;

  if (!isValidObjectId(projectId))
    throw new ApiError(400, "Invalid project id.");

  const note = await Note.create({
    title,
    description,
    project: new mongoose.Types.ObjectId(projectId),
    createdBy: req.user!._id,
  });

  if (!note) throw new ApiError(500, "Failed to create note.");

  return res
    .status(201)
    .json(
      new ApiResponse(201, "Note created successfully", { note }),
    );
});

export const getNoteById = asyncHandler(async (req, res) => {
  const noteId = req.params.noteId as string;
  const projectId = req.params.projectId as string;

  if (!isValidObjectId(noteId))
    throw new ApiError(400, "Invalid note id.");

  if (!isValidObjectId(projectId))
    throw new ApiError(400, "Invalid project id.");

  const note = await Note.findOne({
    _id: noteId,
    project: projectId,
  });

  if (!note) throw new ApiError(404, "Note not found.");

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Note fetched successfully", { note }),
    );
});

export const updateNote = asyncHandler(async (req, res) => {
  const noteId = req.params.noteId as string;
  const projectId = req.params.projectId as string;

  if (!isValidObjectId(noteId))
    throw new ApiError(400, "Invalid note id.");

  if (!isValidObjectId(projectId))
    throw new ApiError(400, "Invalid project id.");

  const { title, description } = req.body;

  const note = await Note.findOneAndUpdate(
    { _id: noteId, project: projectId },
    { title, description },
    {
      returnDocument: "after",
    },
  );

  if (!note) throw new ApiError(404, "Note not found.");

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Note updated successfully", { note }),
    );
});

export const deleteNote = asyncHandler(async (req, res) => {
  const noteId = req.params.noteId as string;
  const projectId = req.params.projectId as string;

  if (!isValidObjectId(noteId))
    throw new ApiError(400, "Invalid note id.");

  if (!isValidObjectId(projectId))
    throw new ApiError(400, "Invalid project id.");

  const note = await Note.findOneAndDelete({
    _id: noteId,
    project: projectId,
  });

  if (!note) throw new ApiError(404, "Note not found.");

  return res
    .status(200)
    .json(new ApiResponse(200, "Note deleted successfully", null));
});
