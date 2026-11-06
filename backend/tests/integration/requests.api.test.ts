import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { app } from "../../src/app.js";
import { checkDatabase } from "../../src/database/connection.js";
import { requestRepository } from "../../src/modules/requests/repository.js";
import type { ServiceRequest } from "../../src/modules/requests/types.js";

// Real app (routes, validation, service, error handler). Only the database parts are replaced by fakes.
vi.mock("../../src/modules/requests/repository.js", () => ({
  requestRepository: {
    create: vi.fn(),
    findAll: vi.fn(),
    findById: vi.fn(),
    updateStatus: vi.fn(),
  },
}));
vi.mock("../../src/database/connection.js", () => ({
  pool: {},
  checkDatabase: vi.fn(),
}));

const repository = vi.mocked(requestRepository);

const knownId = "6f05c43f-2c78-4a9a-b5ae-b70369148699";
const unknownId = "8f2a3c1e-6b5d-4a70-9a2d-1c3e5f7a9b11";

const validBody = {
  title: "Wi-Fi not working",
  description: "No signal on 2nd floor",
  category: "IT",
  priority: "HIGH",
};

function makeRequest(overrides: Partial<ServiceRequest> = {}): ServiceRequest {
  return {
    id: knownId,
    title: "Wi-Fi not working",
    description: "No signal on 2nd floor",
    category: "IT",
    priority: "HIGH",
    status: "OPEN",
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

// Every error must have the same shape: { error: { code, message, details } }
function expectErrorShape(body: {
  error?: { code?: unknown; message?: unknown; details?: unknown };
}) {
  expect(typeof body.error?.code).toBe("string");
  expect(typeof body.error?.message).toBe("string");
  expect(Array.isArray(body.error?.details)).toBe(true);
}

beforeEach(() => {
  vi.resetAllMocks();
});

describe("POST /api/requests", () => {
  it("creates a request: 201, status OPEN, priority defaults to MEDIUM, client status ignored", async () => {
    repository.create.mockResolvedValue(makeRequest({ priority: "MEDIUM" }));
    const bodyWithoutPriority = {
      title: validBody.title,
      description: validBody.description,
      category: validBody.category,
    };

    const response = await request(app)
      .post("/api/requests")
      .send({
        ...bodyWithoutPriority,
        status: "CLOSED",
        title: "  Wi-Fi not working  ",
      });

    expect(response.status).toBe(201);
    expect(response.body.data.status).toBe("OPEN");
    expect(repository.create).toHaveBeenCalledWith({
      title: "Wi-Fi not working", // trimmed
      description: "No signal on 2nd floor",
      category: "IT",
      priority: "MEDIUM", // default
      status: "OPEN", // the client's CLOSED was ignored
    });
  });

  it.each([
    ["an empty object", {}, ["category", "description", "title"]],
    ["a title that is too short", { ...validBody, title: "ab" }, ["title"]],
    [
      "a title that is too long",
      { ...validBody, title: "a".repeat(101) },
      ["title"],
    ],
    [
      "a description with only spaces",
      { ...validBody, description: "   " },
      ["description"],
    ],
    [
      "a description that is too long",
      { ...validBody, description: "a".repeat(1001) },
      ["description"],
    ],
    ["an unknown category", { ...validBody, category: "Food" }, ["category"]],
    ["an unknown priority", { ...validBody, priority: "URGENT" }, ["priority"]],
    ["a title that is not text", { ...validBody, title: 123 }, ["title"]],
  ])("rejects %s with 400 VALIDATION_ERROR", async (_name, body, badFields) => {
    const response = await request(app).post("/api/requests").send(body);

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expectErrorShape(response.body);
    const fields = response.body.error.details.map(
      (detail: { field: string }) => detail.field,
    );
    expect([...fields].sort()).toEqual(badFields);
    expect(repository.create).not.toHaveBeenCalled(); // bad input never reaches the database
  });

  it("rejects a body that is not valid JSON with 400", async () => {
    const response = await request(app)
      .post("/api/requests")
      .set("Content-Type", "application/json")
      .send("{bad json");

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });
});

describe("GET /api/requests", () => {
  it("lists requests with a count", async () => {
    repository.findAll.mockResolvedValue([makeRequest()]);

    const response = await request(app).get("/api/requests");

    expect(response.status).toBe(200);
    expect(response.body.meta.count).toBe(1);
    expect(repository.findAll).toHaveBeenCalledWith(undefined);
  });

  it("passes a valid status filter to the repository", async () => {
    repository.findAll.mockResolvedValue([]);

    const response = await request(app).get("/api/requests?status=CLOSED");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ data: [], meta: { count: 0 } });
    expect(repository.findAll).toHaveBeenCalledWith("CLOSED");
  });

  it("rejects an unknown status filter with 400", async () => {
    const response = await request(app).get("/api/requests?status=WRONG");

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(repository.findAll).not.toHaveBeenCalled();
  });
});

describe("GET /api/requests/:id", () => {
  it("returns the request", async () => {
    repository.findById.mockResolvedValue(makeRequest());

    const response = await request(app).get(`/api/requests/${knownId}`);

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(knownId);
  });

  it("returns 404 NOT_FOUND for an id that does not exist", async () => {
    repository.findById.mockResolvedValue(undefined);

    const response = await request(app).get(`/api/requests/${unknownId}`);

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("NOT_FOUND");
    expectErrorShape(response.body);
  });

  it("returns 400 for an id that is not a UUID, without asking the database", async () => {
    const response = await request(app).get("/api/requests/abc");

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(repository.findById).not.toHaveBeenCalled();
  });
});

describe("PATCH /api/requests/:id/status", () => {
  it("moves a request to the next status", async () => {
    repository.findById.mockResolvedValue(makeRequest({ status: "OPEN" }));
    repository.updateStatus.mockResolvedValue(
      makeRequest({ status: "IN_PROGRESS" }),
    );

    const response = await request(app)
      .patch(`/api/requests/${knownId}/status`)
      .send({ status: "IN_PROGRESS" });

    expect(response.status).toBe(200);
    expect(response.body.data.status).toBe("IN_PROGRESS");
  });

  it("rejects skipping a step (OPEN -> CLOSED) with 400 INVALID_STATUS_TRANSITION", async () => {
    repository.findById.mockResolvedValue(makeRequest({ status: "OPEN" }));

    const response = await request(app)
      .patch(`/api/requests/${knownId}/status`)
      .send({ status: "CLOSED" });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("INVALID_STATUS_TRANSITION");
    expect(repository.updateStatus).not.toHaveBeenCalled();
  });

  it("rejects an unknown status value with 400 VALIDATION_ERROR", async () => {
    const response = await request(app)
      .patch(`/api/requests/${knownId}/status`)
      .send({ status: "DONE" });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("returns 404 when the request does not exist", async () => {
    repository.findById.mockResolvedValue(undefined);

    const response = await request(app)
      .patch(`/api/requests/${unknownId}/status`)
      .send({ status: "IN_PROGRESS" });

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("NOT_FOUND");
  });
});

describe("health check and error handling", () => {
  it("health: 200 when the database answers", async () => {
    vi.mocked(checkDatabase).mockResolvedValue(undefined);

    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok", database: "connected" });
  });

  it("health: 503 SERVICE_UNAVAILABLE when the database is down", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(checkDatabase).mockRejectedValue(
      new Error("connect ECONNREFUSED"),
    );

    const response = await request(app).get("/api/health");

    expect(response.status).toBe(503);
    expect(response.body.error.code).toBe("SERVICE_UNAVAILABLE");
  });

  it("unknown route: 404 NOT_FOUND in the same error shape", async () => {
    const response = await request(app).get("/api/nothing");

    expect(response.status).toBe(404);
    expectErrorShape(response.body);
  });

  it("unexpected error: 500 with a safe message that does not leak details", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    repository.findAll.mockRejectedValue(
      new Error("password authentication failed for user admin:secret123"),
    );

    const response = await request(app).get("/api/requests");

    expect(response.status).toBe(500);
    expect(response.body.error.code).toBe("INTERNAL_ERROR");
    expect(JSON.stringify(response.body)).not.toContain("secret123");
  });
});

describe("regression tests", () => {
  // Bug: a request body over the size limit returned 500 (a server error) instead of 413 (the client's mistake).
  it("a request body that is too large returns 413 PAYLOAD_TOO_LARGE, not 500", async () => {
    const response = await request(app)
      .post("/api/requests")
      .send({ ...validBody, description: "a".repeat(200_000) });

    expect(response.status).toBe(413);
    expect(response.body.error.code).toBe("PAYLOAD_TOO_LARGE");
    expectErrorShape(response.body);
  });
});
