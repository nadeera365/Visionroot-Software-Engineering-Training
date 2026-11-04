"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/requests", label: "All requests" },
  { href: "/requests/new", label: "New request" },
];

function isActive(href: string, pathname: string) {
  if (href === "/requests") {
    return pathname === "/requests" || (pathname.startsWith("/requests/") && pathname !== "/requests/new");
  }
  return pathname === href;
}

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1">
      {links.map((link) => {
        const active = isActive(link.href, pathname);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              active ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
