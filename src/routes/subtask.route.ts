import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  createSubtask,
  deleteSubtaskById,
  updateSubtaskById,
} from "../controllers/subtask.controller.js";
import { rbacMiddleware } from "../middlewares/rbac.middleware.js";
import { UserRoles } from "../utils/constants.js";
import { validateRequest } from "../middlewares/validator.middleware.js";
import {
  createSubtaskValidator,
  updateSubtaskValidator,
} from "../validators/subtask.validator.js";

const subTaskRouter = Router();

subTaskRouter.use(verifyJwt);

subTaskRouter
  .route("/:projectId/t/:taskId/subtasks")
  .post(
    rbacMiddleware([UserRoles.ADMIN, UserRoles.PROJECT_ADMIN]),
    createSubtaskValidator(),
    validateRequest,
    createSubtask,
  );

subTaskRouter
  .route("/:projectId/st/:subTaskId")
  .put(
    rbacMiddleware([UserRoles.ADMIN, UserRoles.PROJECT_ADMIN]),
    updateSubtaskValidator(),
    validateRequest,
    updateSubtaskById,
  );

subTaskRouter
  .route("/:projectId/st/:subTaskId")
  .delete(
    rbacMiddleware([UserRoles.ADMIN, UserRoles.PROJECT_ADMIN]),
    deleteSubtaskById,
  );

export { subTaskRouter };
