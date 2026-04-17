import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError, ApiResponse } from "../utils/api-responses.js";
import { Project } from "../models/project.model.js";

export const getProjects = asyncHandler(async (req, res) => {});

export const createProject = asyncHandler(async (req, res) => {});

export const getProjectById = asyncHandler(async (req, res) => {});

export const updateProject = asyncHandler(async (req, res) => {});

export const deleteProject = asyncHandler(async (req, res) => {});

export const getProjectMembers = asyncHandler(async (req, res) => {});

export const addProjectMember = asyncHandler(async (req, res) => {});

export const updateProjectMemberRole = asyncHandler(
  async (req, res) => {},
);

export const deleteProjectMember = asyncHandler(
  async (req, res) => {},
);
