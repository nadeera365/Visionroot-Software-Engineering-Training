import RequestForm from "@/features/requests/components/RequestForm";

export default function NewRequestPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-center text-3xl font-bold tracking-tight text-slate-900">Create a request</h1>
      <p className="mb-8 mt-2 text-center text-sm text-slate-500">Tell us what is wrong and we will take it from there.</p>
      <RequestForm />
    </div>
  );
}
