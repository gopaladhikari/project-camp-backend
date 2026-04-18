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

const taskRouter = Router();

taskRouter.use(verifyJwt);

taskRouter
  .route("/:projectId")
  .get(getTasks)
  .post(
    rbacMiddleware([UserRoles.ADMIN, UserRoles.PROJECT_ADMIN]),
    createTask,
  );

taskRouter
  .route("/:projectId/t/:taskId")
  .get(getTaskById)
  .put(
    rbacMiddleware([UserRoles.ADMIN, UserRoles.PROJECT_ADMIN]),
    updateTaskById,
  )
  .delete(
    rbacMiddleware([UserRoles.ADMIN, UserRoles.PROJECT_ADMIN]),
    deleteTaskById,
  );

export { taskRouter };
