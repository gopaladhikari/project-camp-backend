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

app.use("/api/v1/healthcheck", healthCheckRouter);

export { app };
