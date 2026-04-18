import { Router } from "express";
import {
  getTasks,
  createTask,
  getTaskById,
  updateTaskById,
  deleteTaskById,
} from "../controllers/task.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const taskRouter = Router();

taskRouter.use(verifyJwt);

export { taskRouter };
