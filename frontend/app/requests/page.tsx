import Link from "next/link";
import RequestList from "@/features/requests/components/RequestList";

export default function RequestsPage() {
    return (
        <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-2xl font-bold">Service requests</h1>
                <Link
                  href="/requests/new"
                  className="rounded-md bg-blue-700 px-4 py-2 text-white hover:bg-blue-800"
                >
                  New request
                </Link>
            </div>
            <RequestList />
        </div>
    )
}