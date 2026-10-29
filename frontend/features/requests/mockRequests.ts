import type { NewRequestInput, ServiceRequest } from "./types"; 

const requests: ServiceRequest[] = [];

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function mockListRequests(): Promise<ServiceRequest[]> {
  await wait(500);
  return [...requests];
}

export async function mockCreateRequest(input: NewRequestInput): Promise<ServiceRequest> {
  await wait(500);
  const now = new Date();
  const created: ServiceRequest = {
    id: crypto.randomUUID(),
    ...input, 
    status: "OPEN",
    created_at: now,
    updated_at: now,
  };
  requests.unshift(created);
  return created;
}