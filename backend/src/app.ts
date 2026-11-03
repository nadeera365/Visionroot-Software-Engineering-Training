import express from "express";
import { errorHandler, notFoundHandler } from "./middleware/error-handler";
import { requestRoutes } from "./modules/requests/routes";
import { checkDatabase } from "./database/connection.js";
import { AppError } from "./errors.js";
import cors from "cors";
import { env } from "./config/environment";

export const app = express();
app.use(cors({ origin: env.FRONTEND_ORIGIN }));

app.use(express.json());

app.get("/api/health", async (_req, res) => {
  try {
    await checkDatabase();
  } catch (error) {
    console.error("Health check failed:", error instanceof Error ? error.message : error);
    throw new AppError(503, "SERVICE_UNAVAILABLE", "Database is not reachable.");
  }
  res.status(200).json({ status: "ok", database: "connected" });
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok", database: "not connected yet" });
});

app.use("/api/requests", requestRoutes);

// These two must stay last
app.use(notFoundHandler);
app.use(errorHandler);