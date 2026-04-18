import { Router } from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectMembers,
  addMemberToProject,
  updateProjectMemberRole,
  deleteProjectMember,
} from "../controllers/project.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validator.middleware.js";

const projectRouter = Router();

projectRouter.route("/").get(verifyJwt, getProjects);

projectRouter.route("/").post(verifyJwt, createProject);

projectRouter.route("/:projectId").get(verifyJwt, getProjectById);

projectRouter.route("/:projectId").put(verifyJwt, updateProject);

projectRouter.route("/:projectId").delete(verifyJwt, deleteProject);

projectRouter
  .route("/:projectId/members")
  .get(verifyJwt, getProjectMembers);

projectRouter
  .route("/:projectId/members")
  .post(verifyJwt, addMemberToProject);

projectRouter
  .route("/:projectId/members/:userId")
  .put(verifyJwt, updateProjectMemberRole);

projectRouter
  .route("/:projectId/members/:userId")
  .delete(verifyJwt, deleteProjectMember);

export { projectRouter };
