import express from "express";
import { errorHandler, notFoundHandler } from "./middleware/error-handler";
import { requestRoutes } from "./modules/requests/routes";

export const app = express();

app.use(express.json());


app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok", database: "not connected yet" });
});

app.use("/api/requests", requestRoutes);

// These two must stay last
app.use(notFoundHandler);
app.use(errorHandler);