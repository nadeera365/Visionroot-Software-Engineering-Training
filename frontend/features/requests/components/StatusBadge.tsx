import type { Status } from "../types";

const styles: Record<Status, string> = {
    OPEN: "bg-blue-100 text-blue-800",
    IN_PROGRESS: "bg-yellow-100 text-yellow-800",
    RESOLVED: "bg-green-100 text-green-800",
    CLOSED: "bg-gray-200 text-gray-700",
};

const labels: Record<Status, string> = {
    OPEN: "Open",
    IN_PROGRESS: "In Progress",
    RESOLVED: "Resolved",
    CLOSED: "Closed",
}

export default function StatusBadge({ status }: { status: Status }) {
    return(
        <span className={`rounded-full px-3 py-1 text-ts font-bold ${styles[status]}`}>
            {labels[status]}
        </span>
    );
}