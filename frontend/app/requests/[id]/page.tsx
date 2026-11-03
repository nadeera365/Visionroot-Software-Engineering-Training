import { Suspense } from "react";
import RequestDetails from "@/features/requests/components/RequestDetails";


async function DetailsContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RequestDetails id={id} />;
}

export default function RequestDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p className="rounded-md border border-gray-300 bg-white p-4">Loading request...</p>}>
      <DetailsContent params={params} />
    </Suspense>
  );
}