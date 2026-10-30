import { NotFoundError } from "../../errors";
import {requestsRepository} from "./repository";
import type {CreateRequestInput, ServiceRequest, Status} from "./types";

export const requestService = {
    createRequest(input: CreateRequestInput): Promise<ServiceRequest> {
        return requestsRepository.create({...input, status: "OPEN"});
    },
    listRequests(status?: Status): Promise<ServiceRequest[]> {
        return requestsRepository.findAll(status);
    },
    async getRequestById(id: string): Promise<ServiceRequest> {
        const request = await requestsRepository.findById(id);
        if (!request) {
            throw new NotFoundError("Request not found");
        }
        return request;
    }
}