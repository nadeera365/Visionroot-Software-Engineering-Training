import type { Request, Response } from "express";
import { parseOrThrow } from "../../validation.js";
import {
  createRequestSchema,
  idParamSchema,
  listRequestSchema,
  updateRequestSchema,
} from "./schema.js";
import { requestService } from "./service.js";

// Controllers handle HTTP only: read the request, validate it, call the service, send the response.

export async function createRequest(req: Request, res: Response) {
  const input = parseOrThrow(createRequestSchema, req.body);
  const created = await requestService.createRequest(input);
  res.status(201).json({ data: created });
}

export async function listRequests(req: Request, res: Response) {
  const { status } = parseOrThrow(listRequestSchema, req.query);
  const requests = await requestService.listRequests(status);
  res.status(200).json({ data: requests, meta: { count: requests.length } });
}

export async function getRequest(req: Request, res: Response) {
  const { id } = parseOrThrow(idParamSchema, req.params);
  const request = await requestService.getRequestById(id);
  res.status(200).json({ data: request });
}

export async function updateRequestStatus(req: Request, res: Response) {
  const { id } = parseOrThrow(idParamSchema, req.params);
  const { status } = parseOrThrow(updateRequestSchema, req.body);
  const updated = await requestService.updateRequestStatus(id, status);
  res.status(200).json({ data: updated });
}
