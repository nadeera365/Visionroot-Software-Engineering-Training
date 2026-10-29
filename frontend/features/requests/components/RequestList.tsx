"use client";

import { useState, useEffect } from "react";
import { listRequests } from "../requestsService";
import type { ServiceRequest } from "../types";
import StatusBadge from "./StatusBadge";

export default function RequestList() {
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        listRequests()
        .then(setRequests)
        .catch((err)=> setError(err instanceof Error ? err.message : "something went wrong"))
        .finally(() => setLoading(false));
    }, []);

    if (loading){
        return <p className="rounded-md border border-gray-300 bg-white p-4">Loading...</p>;
    }

    if (error){
        return(
            <div role="alert" className="rounded-md border border-red-600 bg-white p-4 text-red-700">
                <p>{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 rounded-md border border-red-600 px-3 py-1 hover:bg-red-50"
                >
                  Try again
                </button>
            </div>
        )
    }

    if (requests.length === 0){
        return(
            <p className="rounded-md border border-gray-300 bg-white p-4">No requests found.</p>
        )
    }
    return(
        <ul className="grid gap-3">
            {requests.map((request) => (
                <li key={request.id} className="rounded-lg border border-gray-300 bg-white p-4">
                    <div className="flex items-start justify-between gap-2">
                        <h2 className="text-lg font-bold">{request.title}</h2>
                        <StatusBadge status={request.status} />
                    </div>
                    <p className="mt-1 wrap-break-word text-gray-700">{request.description}</p>
                    <p className="mt-2 text-sm text-gray-500">
                        {request.category} · {request.priority} priority ·{" "}
                        {new Date(request.created_at).toLocaleDateString()}
                    </p>
                </li>
            ))}
        </ul>
    )
}