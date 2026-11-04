import { z } from "zod";
import { CATEGORIES, PRIORITIES, STATUSES } from "./types.js";

export const createRequestSchema = z.object({
  title: z
    .string({ error: "Title is required" })
    .trim()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(100, { message: "Title must be at most 100 characters long" }),
  description: z
    .string({ error: "Description is required" })
    .trim()
    .min(1, { message: "Description is required" })
    .max(1000, { message: "Description must be at most 1000 characters long" }),
  category: z.enum(CATEGORIES, {
    error: "Category must be IT, Facilities or Other.",
  }),
  priority: z
    .enum(PRIORITIES, { error: "Priority must be LOW, MEDIUM or HIGH." })
    .default("MEDIUM"),
});

export const listRequestSchema = z.object({
  status: z
    .enum(STATUSES, {
      error: "Status must be OPEN, IN_PROGRESS, RESOLVED or CLOSED.",
    })
    .optional(),
});

export const idParamSchema = z.object({
  id: z.string().uuid("Request ID must be a valid UUID"),
});

export const updateRequestSchema = z.object({
  status: z.enum(STATUSES, {
    error: "Status must be OPEN, IN_PROGRESS, RESOLVED or CLOSED.",
  }),
});
