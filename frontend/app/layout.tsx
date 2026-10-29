import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Service Requests",
  description: "Submit and track service requests",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <header className="bg-gray-900 text-white">
          <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-2 px-4 py-3">
            <span className="font-bold">Service Requests</span>
            <nav className="flex gap-4">
              <Link href="/requests" className="hover:underline">
                All requests
              </Link>
              <Link href="/requests/new" className="hover:underline">
                New request
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}