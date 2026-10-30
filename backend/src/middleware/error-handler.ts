import type { NextFunction, Request, Response } from "express";
import { AppError, NotFoundError } from "../errors";

// Used when no route matches the URL
export function notFoundHandler(_req: Request, _res: Response, next: NextFunction) {
  next(new NotFoundError("Route not found."));
}

// One place that turns every error into the same JSON shape
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    res.status(err.status).json({
      error: { code: err.code, message: err.message, details: err.details },
    });
    return;
  }

  // express.json() throws this when the body is not valid JSON
  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({
      error: { code: "VALIDATION_ERROR", message: "Request body must be valid JSON.", details: [] },
    });
    return;
  }

  // Unexpected error: log it on the server, send a safe message to the client
  console.error(err);
  res.status(500).json({
    error: { code: "INTERNAL_ERROR", message: "Something went wrong.", details: [] },
  });
}