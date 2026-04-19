import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  getProjectNotes,
  createProjectNote,
  deleteNote,
  getNoteById,
  updateNote,
} from "../controllers/note.controller.js";
import { rbacMiddleware } from "../middlewares/rbac.middleware.js";
import { UserRoles } from "../utils/constants.js";
import { validateRequest } from "../middlewares/validator.middleware.js";
import { projectIdValidator } from "../validators/project.validator.js";
import {
  noteIdAndProjectIdValidator,
  noteValidator,
} from "../validators/note.validator.js";

const noteRouter = Router();

noteRouter.use(verifyJwt);

noteRouter
  .route("/:projectId")
  .get(projectIdValidator(), validateRequest, getProjectNotes)
  .post(
    rbacMiddleware([UserRoles.ADMIN]),
    noteIdAndProjectIdValidator(),
    noteValidator(),
    validateRequest,
    createProjectNote,
  );

noteRouter
  .route("/:projectId/n/:noteId")
  .get(noteIdAndProjectIdValidator(), validateRequest, getNoteById)
  .put(
    rbacMiddleware([UserRoles.ADMIN]),
    noteIdAndProjectIdValidator(),
    noteValidator(),
    validateRequest,
    updateNote,
  )
  .delete(
    rbacMiddleware([UserRoles.ADMIN]),
    noteIdAndProjectIdValidator(),
    validateRequest,
    deleteNote,
  );

export { noteRouter };
