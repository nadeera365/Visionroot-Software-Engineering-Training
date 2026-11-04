import { Suspense } from "react";
import RequestDetails from "@/features/requests/components/RequestDetails";
import { DetailsSkeleton } from "@/features/requests/components/Skeletons";

// The id comes from the URL. Reading it must happen inside <Suspense>.
async function DetailsContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RequestDetails id={id} />;
}

export default function RequestDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<DetailsSkeleton />}>
      <DetailsContent params={params} />
    </Suspense>
  );
}
