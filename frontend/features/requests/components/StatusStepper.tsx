import { statusLabels, statusOrder } from "../statusFlow";
import type { Status } from "../types";

// Shows where the request is in the workflow: finished steps, the current step, and the steps to come.
export default function StatusStepper({ status }: { status: Status }) {
  const currentIndex = statusOrder.indexOf(status);

  return (
    <ol className="grid grid-cols-4 gap-2" aria-label="Request progress">
      {statusOrder.map((step, index) => {
        const done = index < currentIndex;
        const current = index === currentIndex;

        const circle = done
          ? "bg-linear-to-br from-indigo-500 to-violet-600 text-white shadow-sm"
          : current
            ? "bg-white text-indigo-700 ring-2 ring-indigo-500 shadow-md shadow-indigo-500/30"
            : "bg-slate-100 text-slate-400";
        const label = current ? "text-indigo-700" : done ? "text-slate-700" : "text-slate-400";

        return (
          <li
            key={step}
            aria-current={current ? "step" : undefined}
            className="flex flex-col items-center gap-2 text-center"
          >
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${circle}`}
            >
              {done ? (
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                  <path d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 111.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z" />
                </svg>
              ) : (
                index + 1
              )}
            </span>
            <span className={`text-xs font-medium ${label}`}>{statusLabels[step]}</span>
          </li>
        );
      })}
    </ol>
  );
}
