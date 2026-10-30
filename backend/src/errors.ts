import type { ZodError } from "zod";

export interface ErrorDetail{
    field: string;
    message: string;
}

export class AppError extends Error {
    status : number;
    code : string;
    details: ErrorDetail[];

    constructor(status: number, code: string, message: string, details: ErrorDetail[] = []) {
        super(message);
        this.status = status;
        this.code = code;
        this.details = details;
    }
}

export class NotFoundError extends AppError {
    constructor(message: string) {
        super(404, "NOT_FOUND", message,);
    }
}

export function toValidationError(err: ZodError): AppError {
    const details: ErrorDetail[] = err.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
    }));
    return new AppError(400, "VALIDATION_ERROR", "The request contains invalid fields.", details);
}