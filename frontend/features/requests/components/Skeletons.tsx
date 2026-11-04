import Skeleton from "@/components/Skeleton";

// Placeholders with the same shape as the real content, shown while data loads.
// The hidden text is for screen readers.

export function ListSkeleton() {
  return (
    <div role="status" aria-busy="true" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <span className="sr-only">Loading requests...</span>
      {[0, 1, 2].map((item) => (
        <div key={item} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <Skeleton className="h-5 w-2/5" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="mt-3 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-3/5" />
          <div className="mt-4 flex gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DetailsSkeleton() {
  return (
    <div role="status" aria-busy="true" className="grid gap-4">
      <span className="sr-only">Loading request...</span>
      <Skeleton className="h-5 w-32" />
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <Skeleton className="h-7 w-1/2" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="mt-4 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-4/5" />
        <div className="mt-6 grid grid-cols-4 gap-2">
          {[0, 1, 2, 3].map((item) => (
            <Skeleton key={item} className="mx-auto h-8 w-8 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
