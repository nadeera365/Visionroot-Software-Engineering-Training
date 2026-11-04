import type { ZodType } from "zod";
import { AppError } from "./errors.js";

// Checks data against a schema. Returns the clean data, or throws a 400 error with one detail per bad field.
export function parseOrThrow<T>(schema: ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const details = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    throw new AppError(
      400,
      "VALIDATION_ERROR",
      "The request contains invalid fields.",
      details,
    );
  }
  return result.data;
}
