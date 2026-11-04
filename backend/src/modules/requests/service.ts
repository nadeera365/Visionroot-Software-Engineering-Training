import { AppError, NotFoundError } from "../../errors";
import { requestRepository } from "./repository";
import type { CreateRequestInput, ServiceRequest, Status } from "./types";

const nextStatus: Record<Status, Status | null> = {
  OPEN: "IN_PROGRESS",
  IN_PROGRESS: "RESOLVED",
  RESOLVED: "CLOSED",
  CLOSED: null,
};
export const requestService = {
  createRequest(input: CreateRequestInput): Promise<ServiceRequest> {
    return requestRepository.create({ ...input, status: "OPEN" });
  },
  listRequests(status?: Status): Promise<ServiceRequest[]> {
    return requestRepository.findAll(status);
  },
  async getRequestById(id: string): Promise<ServiceRequest> {
    const request = await requestRepository.findById(id);
    if (!request) {
      throw new NotFoundError("Request not found");
    }
    return request;
  },
  async updateRequestStatus(
    id: string,
    newStatus: Status,
  ): Promise<ServiceRequest> {
    const request = await requestService.getRequestById(id);

    if (nextStatus[request.status] !== newStatus) {
      throw new AppError(
        400,
        "INVALID_STATUS_TRANSITION",
        `Cannot change status from ${request.status} to ${newStatus}.`,
      );
    }

    const updated = await requestRepository.updateStatus(id, newStatus);
    if (!updated) {
      throw new NotFoundError("Request not found.");
    }
    return updated;
  },
};
