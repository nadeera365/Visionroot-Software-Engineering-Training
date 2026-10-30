import { Router } from "express";
import { createRequest, getRequest, listRequests } from "./controller";

export const requestRoutes = Router();

requestRoutes.post("/", createRequest);
requestRoutes.get("/", listRequests);
requestRoutes.get("/:id", getRequest);