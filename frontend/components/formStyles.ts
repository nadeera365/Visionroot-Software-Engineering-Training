export function inputClasses(hasError: boolean) {
  const base =
    "w-full rounded-lg border bg-white px-3 py-2.5 text-sm shadow-sm transition " +
    "placeholder:text-slate-400 focus:outline-none focus:ring-2";
  const color = hasError
    ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
    : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-200";
  return `${base} ${color}`;
}
