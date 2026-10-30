import {z} from "zod";

export const createRequestSchema = z.object({
    title: z.string({error: "Title is required"}).trim().min(3, {message: "Title must be at least 3 characters long"}).max(100, {message: "Title must be at most 100 characters long"}),
    description: z.string({error: "Description is required"}).trim().min(1, {message: "Description is required"}).max(1000, {message: "Description must be at most 1000 characters long"}),
    category: z.enum(["IT", "Facilities", "Other"], {error: "Category must be IT, Facilities or Other."}),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"], {error: "Priority must be LOW, MEDIUM or HIGH."}).default("MEDIUM"),
});

export const listRequestSchema = z.object({
    status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"], {error: "Status must be OPEN, IN_PROGRESS, RESOLVED or CLOSED."}).optional(),
});

export const idParamSchema = z.object({
    id: z.string().uuid("Request ID must be a valid UUID"),
});