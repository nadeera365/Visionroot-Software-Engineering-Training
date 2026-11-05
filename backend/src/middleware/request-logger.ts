import type { NextFunction, Request, Response } from "express";
import { log } from "../logger";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const path = req.originalUrl.split("?")[0];

  res.on("finish", () => {
    log("info", "request", {
      method: req.method,
      path,
      status: res.statusCode,
      duration: Date.now() - start,
    });
  });

  next();
}
