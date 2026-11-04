import type { Status } from "./types";

export const statusOrder: Status[] = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

export const statusLabels: Record<Status, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};


export function getNextStatus(status: Status): Status | null {
  return statusOrder[statusOrder.indexOf(status) + 1] ?? null;
}
