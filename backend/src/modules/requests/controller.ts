import type { Request, Response } from "express";
import { toValidationError } from "../../errors";
import { createRequestSchema, idParamSchema, listRequestSchema } from "./schema";
import { requestService } from "./service";

export async function createRequest(req: Request, res: Response){
    const parsed = createRequestSchema.safeParse(req.body);
    if (!parsed.success) {
        throw toValidationError(parsed.error);
    }
    const created = await requestService.createRequest(parsed.data);
    res.status(201).json({data: created});
}

export async function listRequests(req: Request, res: Response) {
  const parsed = listRequestSchema.safeParse(req.query);
  if (!parsed.success) {
    throw toValidationError(parsed.error);
  }

  const requests = await requestService.listRequests(parsed.data.status);
  res.status(200).json({ data: requests, meta: { count: requests.length } });
}

export async function getRequest(req: Request, res: Response) {
  const parsed = idParamSchema.safeParse(req.params);
  if (!parsed.success) {
    throw toValidationError(parsed.error);
  }

  const request = await requestService.getRequestById(parsed.data.id);
  res.status(200).json({ data: request });
}