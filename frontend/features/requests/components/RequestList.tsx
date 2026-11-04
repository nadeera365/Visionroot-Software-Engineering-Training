"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import { buttonClasses } from "@/components/buttonStyles";
import { listRequests } from "../requestsService";
import type { ServiceRequest } from "../types";
import PriorityTag from "./PriorityDetails";
import { ListSkeleton } from "./Skeletons";
import StatusBadge from "./StatusBadge";

export default function RequestList() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    listRequests()
      .then(setRequests)
      .catch((err) => setError(err instanceof Error ? err.message : "Something went wrong."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <ListSkeleton />;
  }

  if (error) {
    return (
      <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-5 text-rose-800">
        <p className="font-semibold">We could not load the requests</p>
        <p className="mt-1 text-sm">{error}</p>
        <Button variant="secondary" className="mt-4" onClick={() => window.location.reload()}>
          Try again
        </Button>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-slate-300 bg-white p-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-4.5a1 1 0 00-.9.6l-.7 1.8a1 1 0 01-.9.6h-3a1 1 0 01-.9-.6l-.7-1.8a1 1 0 00-.9-.6H4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="mt-4 font-semibold text-slate-900">No requests yet</p>
        <p className="mt-1 text-sm text-slate-500">Create the first one and it will show up here.</p>
        <Link href="/requests/new" className={`${buttonClasses("primary")} mt-5`}>
          Create a request
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {requests.map((request) => (
        <li
          key={request.id}
          className="relative flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-4">
            <h2 className="min-w-0 break-words text-base font-semibold text-slate-900">
              {/* The ::after layer makes the whole card clickable */}
              <Link
                href={`/requests/${request.id}`}
                className="after:absolute after:inset-0 hover:text-indigo-700"
              >
                {request.title}
              </Link>
            </h2>
            <StatusBadge status={request.status} />
          </div>
          <p className="mt-2 line-clamp-2 break-words text-sm text-slate-600">{request.description}</p>
          <div className="mt-auto flex flex-wrap items-center gap-2 pt-4 text-xs text-slate-500">
            <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
              {request.category}
            </span>
            <PriorityTag priority={request.priority} />
            <span className="ml-auto">{new Date(request.created_at).toLocaleDateString()}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
