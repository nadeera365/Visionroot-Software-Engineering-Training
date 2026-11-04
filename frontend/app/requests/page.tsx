import Link from "next/link";
import { buttonClasses } from "@/components/buttonStyles";
import RequestList from "@/features/requests/components/RequestList";

export default function RequestsPage() {
  return (
    <div>
      <div className="mb-8 flex flex-col items-center gap-4 text-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Service requests</h1>
          <p className="mt-2 text-sm text-slate-500">Track every request from open to closed.</p>
        </div>
        <Link href="/requests/new" className={buttonClasses("primary")}>
          + New request
        </Link>
      </div>
      <RequestList />
    </div>
  );
}
