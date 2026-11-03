import { apiRequest } from "@/services/apiClient";
import type { NewRequestInput, ServiceRequest, Status } from "./types";

export async function listRequests(): Promise<ServiceRequest[]> {
  const result = await apiRequest<{ data: ServiceRequest[] }>("/requests");
  return result.data;
}

export async function getRequest(id: string): Promise<ServiceRequest> {
  const result = await apiRequest<{ data: ServiceRequest }>(`/requests/${id}`);
  return result.data;
}

export async function createRequest(input: NewRequestInput): Promise<ServiceRequest> {
  const result = await apiRequest<{ data: ServiceRequest }>("/requests", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return result.data;
}

export async function updateRequestStatus(id: string, status: Status): Promise<ServiceRequest> {
  const result = await apiRequest<{ data: ServiceRequest }>(`/requests/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  return result.data;
}