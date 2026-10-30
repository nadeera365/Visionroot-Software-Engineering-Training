import { randomUUID } from "crypto";
import type { NewRequestRecord, ServiceRequest, Status } from "./types"; 
import { request } from "express";

const requests: ServiceRequest[] = [];

export const requestsRepository = {
    async create(record: NewRequestRecord): Promise<ServiceRequest> {
        const now = new Date().toISOString();
        const created: ServiceRequest = {
            ...record,
            id: randomUUID(),
            created_at: new Date(now),
            updated_at: new Date(now),
        };
        requests.unshift(created);
        return created;
    },
    async findAll(status?: Status): Promise<ServiceRequest[]> {
        if (status) {
            return requests.filter((request) => request.status === status);
        }
        return [...requests];
    },
    async findById(id: string): Promise<ServiceRequest | undefined> {
        return requests.find((request) => request.id === id);
    }
}