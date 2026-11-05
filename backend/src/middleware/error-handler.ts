import type { NextFunction, Request, Response } from "express";
import { AppError, NotFoundError } from "../errors.js";
import { log } from "../logger.js";
// Used when no route matches the URL
export function notFoundHandler(
  _req: Request,
  _res: Response,
  next: NextFunction,
) {
  next(new NotFoundError("Route not found."));
}

// Some errors come from Express itself (for example a body that is too large, 413).
// They carry their own 4xx status. These are the client's mistakes, not server errors.
function getClientErrorStatus(err: unknown): number | null {
  if (typeof err === "object" && err !== null && "status" in err) {
    const status = err.status;
    if (typeof status === "number" && status >= 400 && status < 500) {
      return status;
    }
  }
  return null;
}

// One place that turns every error into the same JSON shape
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    res.status(err.status).json({
      error: { code: err.code, message: err.message, details: err.details },
    });
    return;
  }

  // express.json() throws this when the body is not valid JSON
  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Request body must be valid JSON.",
        details: [],
      },
    });
    return;
  }

  const clientStatus = getClientErrorStatus(err);
  if (clientStatus) {
    const tooLarge = clientStatus === 413;
    res.status(clientStatus).json({
      error: {
        code: tooLarge ? "PAYLOAD_TOO_LARGE" : "BAD_REQUEST",
        message: tooLarge
          ? "Request body is too large."
          : "The request could not be processed.",
        details: [],
      },
    });
    return;
  }

  // Unexpected error: log it on the server, send a safe message to the client
  log("error", "Unexpected error occurred", {
    error: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
  });
  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "Something went wrong.",
      details: [],
    },
  });
}
