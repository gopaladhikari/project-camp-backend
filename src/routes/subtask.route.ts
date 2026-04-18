import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  createSubtask,
  deleteSubtaskById,
  updateSubtaskById,
} from "../controllers/subtask.controller.js";
import { rbacMiddleware } from "../middlewares/rbac.middleware.js";
import { UserRoles } from "../utils/constants.js";

const subTaskRouter = Router();

subTaskRouter.use(verifyJwt);

subTaskRouter
  .route("/:projectId/t/:taskId/subtasks")
  .post(
    rbacMiddleware([UserRoles.ADMIN, UserRoles.PROJECT_ADMIN]),
    createSubtask,
  );

subTaskRouter
  .route("/:projectId/st/:subTaskId")
  .put(updateSubtaskById);

subTaskRouter
  .route("/:projectId/st/:subTaskId")
  .delete(
    rbacMiddleware([UserRoles.ADMIN, UserRoles.PROJECT_ADMIN]),
    deleteSubtaskById,
  );

export { subTaskRouter };
