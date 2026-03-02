"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const pathname = usePathname();
  const isProject = pathname.startsWith("/project/");

  // Hide navbar on the project page (it has its own header)
  if (isProject) return null;

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold">
          Codebase QA
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className={`text-sm transition-colors hover:text-[var(--foreground)] ${
              pathname === "/dashboard"
                ? "text-[var(--foreground)]"
                : "text-[var(--muted-foreground)]"
            }`}
          >
            Dashboard
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
