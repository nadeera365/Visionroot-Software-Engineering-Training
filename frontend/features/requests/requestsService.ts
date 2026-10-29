import { apiRequest } from "@/services/apiClient";
import { mockCreateRequest, mockListRequests } from "./mockRequests";
import type { NewRequestInput, ServiceRequest } from "./types";

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

export async function listRequests(): Promise<ServiceRequest[]> {
    if (USE_MOCK_API) return mockListRequests();
    const result = await apiRequest<{ data: ServiceRequest[] }>("/requests");
    return result.data;
}

export async function createRequest(input: NewRequestInput): Promise<ServiceRequest> {
    if (USE_MOCK_API) return mockCreateRequest(input);
    const result = await apiRequest<{ data: ServiceRequest }>("/requests", {
        method: "POST",
        body: JSON.stringify(input),
    });
    return result.data;
}