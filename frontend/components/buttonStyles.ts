export type ButtonVariant = "primary" | "secondary";

// All buttons and button-like links share these classes, so they always look the same.
const base =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold shadow-sm transition " +
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 " +
  "active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-linear-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700",
  secondary: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
};

export function buttonClasses(variant: ButtonVariant = "primary") {
  return `${base} ${variants[variant]}`;
}
