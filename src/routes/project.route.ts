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
import { rbacMiddleware } from "../middlewares/rbac.middleware.js";
import {
  addProjectMemberValidator,
  createProjectValidator,
  projectIdValidator,
  projectIdAndUserIdValidator,
  updateProjectValidator,
  projectIdAndUserIdAndRoleValidator,
} from "../validators/project.validator.js";
import { avilableRoles, UserRoles } from "../utils/constants.js";

const projectRouter = Router();

projectRouter.use(verifyJwt);

projectRouter.route("/").get(getProjects);

projectRouter
  .route("/")
  .post(createProjectValidator(), validateRequest, createProject);

projectRouter
  .route("/:projectId")
  .get(
    rbacMiddleware(avilableRoles),
    projectIdValidator(),
    validateRequest,
    getProjectById,
  )
  .put(
    rbacMiddleware([UserRoles.ADMIN]),
    updateProjectValidator(),
    validateRequest,
    updateProject,
  )
  .delete(
    rbacMiddleware([UserRoles.ADMIN]),
    projectIdValidator(),
    validateRequest,
    deleteProject,
  );

projectRouter
  .route("/:projectId/members")
  .get(projectIdValidator(), validateRequest, getProjectMembers)
  .post(
    rbacMiddleware([UserRoles.ADMIN]),
    addProjectMemberValidator(),
    validateRequest,
    addMemberToProject,
  );

projectRouter
  .route("/:projectId/members/:userId")
  .put(
    rbacMiddleware([UserRoles.ADMIN]),
    projectIdAndUserIdAndRoleValidator(),
    validateRequest,
    updateProjectMemberRole,
  )
  .delete(
    rbacMiddleware([UserRoles.ADMIN]),
    projectIdAndUserIdValidator(),
    validateRequest,
    deleteProjectMember,
  );

export { projectRouter };
