import { beforeEach, describe, expect, it, vi } from "vitest";
import { requestRepository } from "../../src/modules/requests/repository.js";
import { requestService } from "../../src/modules/requests/service.js";
import {
  STATUSES,
  type ServiceRequest,
  type Status,
} from "../../src/modules/requests/types.js";

// The repository is replaced by a fake. These tests need no database and always give the same result.
vi.mock("../../src/modules/requests/repository.js", () => ({
  requestRepository: {
    create: vi.fn(),
    findAll: vi.fn(),
    findById: vi.fn(),
    updateStatus: vi.fn(),
  },
}));

const repository = vi.mocked(requestRepository);

// A fixture: a ready-made request that tests can change a little
function makeRequest(overrides: Partial<ServiceRequest> = {}): ServiceRequest {
  return {
    id: "6f05c43f-2c78-4a9a-b5ae-b70369148699",
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

beforeEach(() => {
  vi.resetAllMocks();
});

describe("createRequest", () => {
  it("always saves a new request with status OPEN", async () => {
    repository.create.mockResolvedValue(makeRequest());

    await requestService.createRequest({
      title: "Wi-Fi not working",
      description: "No signal on 2nd floor",
      category: "IT",
      priority: "HIGH",
    });

    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({ status: "OPEN" }),
    );
  });
});

describe("getRequestById", () => {
  it("returns the request when it exists", async () => {
    const request = makeRequest();
    repository.findById.mockResolvedValue(request);

    await expect(requestService.getRequestById(request.id)).resolves.toEqual(
      request,
    );
  });

  it("throws NOT_FOUND when the request does not exist", async () => {
    repository.findById.mockResolvedValue(undefined);

    await expect(
      requestService.getRequestById("missing"),
    ).rejects.toMatchObject({
      status: 404,
      code: "NOT_FOUND",
    });
  });
});

describe("updateStatus: status transitions", () => {
  // The rule written out by hand, separate from the code. OPEN -> IN_PROGRESS -> RESOLVED -> CLOSED.
  const expectedNext: Record<Status, Status | null> = {
    OPEN: "IN_PROGRESS",
    IN_PROGRESS: "RESOLVED",
    RESOLVED: "CLOSED",
    CLOSED: null,
  };

  // Every possible pair (4 x 4 = 16 cases)
  const allPairs = STATUSES.flatMap((from) =>
    STATUSES.map((to) => [from, to, expectedNext[from] === to] as const),
  );

  it.each(allPairs)("%s -> %s (allowed: %s)", async (from, to, allowed) => {
    const request = makeRequest({ status: from });
    repository.findById.mockResolvedValue(request);
    repository.updateStatus.mockResolvedValue({ ...request, status: to });

    const result = requestService.updateRequestStatus(request.id, to);

    if (allowed) {
      await expect(result).resolves.toMatchObject({ status: to });
      expect(repository.updateStatus).toHaveBeenCalledWith(request.id, to);
    } else {
      await expect(result).rejects.toMatchObject({
        status: 400,
        code: "INVALID_STATUS_TRANSITION",
      });
      // The invalid change must never reach the database
      expect(repository.updateStatus).not.toHaveBeenCalled();
    }
  });

  it("throws NOT_FOUND when the request does not exist", async () => {
    repository.findById.mockResolvedValue(undefined);

    await expect(
      requestService.updateRequestStatus("missing", "IN_PROGRESS"),
    ).rejects.toMatchObject({
      status: 404,
      code: "NOT_FOUND",
    });
    expect(repository.updateStatus).not.toHaveBeenCalled();
  });
});
