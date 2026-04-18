import { Router } from "express";
import {
  getTasks,
  createTask,
  getTaskById,
  updateTaskById,
  deleteTaskById,
} from "../controllers/task.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { rbacMiddleware } from "../middlewares/rbac.middleware.js";
import { UserRoles } from "../utils/constants.js";
import { validateRequest } from "../middlewares/validator.middleware.js";
import {
  createTaskValidator,
  taskIdValidator,
  updateTaskValidator,
} from "../validators/task.validator.js";

const taskRouter = Router();

taskRouter.use(verifyJwt);

taskRouter
  .route("/:projectId")
  .get(getTasks)
  .post(
    rbacMiddleware([UserRoles.ADMIN, UserRoles.PROJECT_ADMIN]),
    createTaskValidator(),
    validateRequest,
    createTask,
  );

taskRouter
  .route("/:projectId/t/:taskId")
  .get(getTaskById)
  .put(
    rbacMiddleware([UserRoles.ADMIN, UserRoles.PROJECT_ADMIN]),
    updateTaskValidator(),
    validateRequest,
    updateTaskById,
  )
  .delete(
    rbacMiddleware([UserRoles.ADMIN, UserRoles.PROJECT_ADMIN]),
    taskIdValidator(),
    validateRequest,
    deleteTaskById,
  );

export { taskRouter };
