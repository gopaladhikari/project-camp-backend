import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env["CORS_ORIGIN"] || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Routes

import { healthCheckRouter } from "./routes/healthcheck.route.js";
import { authRouter } from "./routes/auth.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { projectRouter } from "./routes/project.route.js";
import { taskRouter } from "./routes/task.route.js";
import { subTaskRouter } from "./routes/subtask.route.js";

app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/tasks", subTaskRouter);

// Customm Error Handler

app.use(errorHandler);

export { app };
