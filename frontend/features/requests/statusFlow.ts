import type { Status } from "./types";

export const statusLabels: Record<Status, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed"
};

const nextStatus: Record<Status, Status | null> = {
  OPEN: "IN_PROGRESS",
  IN_PROGRESS: "RESOLVED",
  RESOLVED: "CLOSED",
  CLOSED: null,
};

export function getNextStatus(currentStatus: Status): Status | null {
  return nextStatus[currentStatus];
}