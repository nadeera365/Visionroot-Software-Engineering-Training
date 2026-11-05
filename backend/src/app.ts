import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/environment.js";
import { checkDatabase } from "./database/connection.js";
import { AppError } from "./errors.js";
import { log } from "./logger.js";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.js";
import { requestLogger } from "./middleware/request-logger.js";
import { requestRoutes } from "./modules/requests/routes.js";

export const app = express();

app.use(helmet());

if (env.nodeEnv !== "test") {
  app.use(requestLogger);
}

app.use(cors({ origin: env.frontendOrigin }));
app.use(express.json());

app.get("/api/health", async (_req, res) => {
  try {
    await checkDatabase();
  } catch (error) {
    log("error", "Health check failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    throw new AppError(
      503,
      "SERVICE_UNAVAILABLE",
      "Database is not reachable.",
    );
  }
  res.status(200).json({ status: "ok", database: "connected" });
});

app.use("/api/requests", requestRoutes);

// These two must stay last
app.use(notFoundHandler);
app.use(errorHandler);
