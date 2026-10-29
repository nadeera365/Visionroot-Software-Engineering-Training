import RequestForm from "@/features/requests/components/RequestForm";

export default function NewRequestPage() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Create a request</h1>
      <RequestForm />
    </div>
  );
}