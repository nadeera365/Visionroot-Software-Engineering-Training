export interface ErrorDetail {
  field: string;
  message: string;
}
export class AppError extends Error {
  status: number;
  code: string;
  details: ErrorDetail[];

  constructor(
    status: number,
    code: string,
    message: string,
    details: ErrorDetail[] = [],
  ) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(404, "NOT_FOUND", message);
  }
}
