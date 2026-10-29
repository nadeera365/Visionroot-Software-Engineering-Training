const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

export class ApiError extends Error {
    status: number;

    constructor( message: string, status: number) {
      super(message);
      this.status = status;
  }
}

export async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...options?.headers },
    });
  } catch {
    // The server is down or the network failed showing a generic error message to the user
    throw new ApiError("Cannot reach the server. Please try again.", 0);
  }

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    
    throw new ApiError(body?.error?.message ?? "Something went wrong.", response.status);
  }

  return body as T;
}