import { Router } from "express";
import {
  getProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  getProjectMembers,
  addProjectMember,
  updateProjectMemberRole,
  deleteProjectMember,
} from "../controllers/project.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validator.middleware.js";

const projectRouter = Router();

export { projectRouter };
