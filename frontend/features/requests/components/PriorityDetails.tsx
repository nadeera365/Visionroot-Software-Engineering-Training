import type { Priority } from "../types";

const styles: Record<Priority, string> = {
  HIGH: "bg-rose-50 text-rose-700",
  MEDIUM: "bg-amber-50 text-amber-700",
  LOW: "bg-emerald-50 text-emerald-700",
};

export default function PriorityTag({ priority }: { priority: Priority }) {
  return (
    <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${styles[priority]}`}>
      {priority.charAt(0) + priority.slice(1).toLowerCase()} priority
    </span>
  );
}
