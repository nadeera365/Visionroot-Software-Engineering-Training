"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getRequest, updateRequestStatus } from "../requestsService";
import { getNextStatus, statusLabels } from "../statusFlow";
import type { ServiceRequest } from "../types";
import StatusBadge from "./StatusBadge";

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
    return <p className="rounded-md border border-gray-300 bg-white p-4">Loading request...</p>;
  }

  if (loadError || !request) {
    return (
      <div role="alert" className="rounded-md border border-red-600 bg-white p-4 text-red-700">
        <p>{loadError || "Request not found."}</p>
        <Link href="/requests" className="mt-2 inline-block underline">
          Back to all requests
        </Link>
      </div>
    );
  }

  const next = getNextStatus(request.status);

  return (
    <div className="grid gap-4">
      <Link href="/requests" className="text-blue-700 underline">
        Back to all requests
      </Link>

      <div className="rounded-lg border border-gray-300 bg-white p-4">
        <div className="flex items-start justify-between gap-2">
          <h1 className="text-2xl font-bold">{request.title}</h1>
          <StatusBadge status={request.status} />
        </div>
        <p className="mt-2 wrap-break-word text-gray-700">{request.description}</p>
        <dl className="mt-4 grid gap-1 text-sm text-gray-600 sm:grid-cols-2">
          <div>Category: {request.category}</div>
          <div>Priority: {request.priority}</div>
          <div>Created: {new Date(request.created_at).toLocaleString()}</div>
          <div>Updated: {new Date(request.updated_at).toLocaleString()}</div>
        </dl>
      </div>

      {updateMessage && (
        <p role="status" className="rounded-md border border-green-700 p-3 text-green-800">
          {updateMessage}
        </p>
      )}
      {updateError && (
        <p role="alert" className="rounded-md border border-red-600 p-3 text-red-700">
          {updateError}
        </p>
      )}

      {next ? (
        <button
          onClick={handleMoveToNext}
          disabled={updating}
          className="w-fit rounded-md bg-blue-700 px-4 py-2 text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {updating ? "Saving..." : `Move to ${statusLabels[next]}`}
        </button>
      ) : (
        <p className="text-gray-600">This request is closed. No more changes are possible.</p>
      )}
    </div>
  );
}