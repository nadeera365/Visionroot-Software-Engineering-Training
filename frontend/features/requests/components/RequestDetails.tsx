"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import { getRequest, updateRequestStatus } from "../requestsService";
import { getNextStatus, statusLabels } from "../statusFlow";
import type { ServiceRequest } from "../types";
import PriorityTag from "./PriorityDetails";
import { DetailsSkeleton } from "./Skeletons";
import StatusBadge from "./StatusBadge";
import StatusStepper from "./StatusStepper";

export default function RequestDetails({ id }: { id: string }) {
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");

  useEffect(() => {
    getRequest(id)
      .then(setRequest)
      .catch((err) => setLoadError(err instanceof Error ? err.message : "Something went wrong."))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleMoveToNext() {
    if (!request) return;
    const next = getNextStatus(request.status);
    if (!next) return;

    setUpdating(true);
    setUpdateError("");
    setUpdateMessage("");
    try {
      const updated = await updateRequestStatus(request.id, next);
      // Only after the server answered OK do we change the screen
      setRequest(updated);
      setUpdateMessage(`Status changed to ${statusLabels[updated.status]}.`);
    } catch (err) {
      // The old status stays on the screen, and we show why it failed
      setUpdateError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return <DetailsSkeleton />;
  }

  if (loadError || !request) {
    return (
      <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-5 text-rose-800">
        <p className="font-semibold">{loadError || "Request not found."}</p>
        <Link href="/requests" className="mt-3 inline-block text-sm font-medium underline">
          Back to all requests
        </Link>
      </div>
    );
  }

  const next = getNextStatus(request.status);

  return (
    <div className="mx-auto grid w-full max-w-3xl gap-4">
      <Link href="/requests" className="back-link">
        &larr; Back to all requests
      </Link>

      <div className="status-card">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-900">{request.title}</h1>
          <StatusBadge status={request.status} />
        </div>
        <p className="mt-3 break-words text-slate-600">{request.description}</p>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
            {request.category}
          </span>
          <PriorityTag priority={request.priority} />
          <span>Created {new Date(request.created_at).toLocaleString()}</span>
          <span>&middot; Updated {new Date(request.updated_at).toLocaleString()}</span>
        </div>

        <div className="status-card-divider">
          <StatusStepper status={request.status} />
        </div>
      </div>

      {updateMessage && (
        <p
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"
        >
          {updateMessage}
        </p>
      )}
      {updateError && (
        <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
          {updateError}
        </p>
      )}

      {next ? (
        <Button onClick={handleMoveToNext} loading={updating} className="w-fit">
          {updating ? "Saving..." : `Move to ${statusLabels[next]}`}
        </Button>
      ) : (
        <p className="text-sm text-slate-500">This request is closed. No more changes are possible.</p>
      )}
    </div>
  );
}
