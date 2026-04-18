import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  createSubtask,
  deleteSubtaskById,
  updateSubtaskById,
} from "../controllers/subtask.controller.js";

const subTaskRouter = Router();

subTaskRouter.use(verifyJwt);

subTaskRouter
  .route("/:projectId/t/:taskId/subtasks")
  .post(createSubtask);

subTaskRouter
  .route("/:projectId/st/:subTaskId")
  .put(updateSubtaskById);

subTaskRouter
  .route("/:projectId/st/:subTaskId")
  .delete(deleteSubtaskById);

export { subTaskRouter };
