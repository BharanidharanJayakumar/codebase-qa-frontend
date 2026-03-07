"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const isProject = pathname.startsWith("/project/");
  const isLogin = pathname === "/login";

  // Hide navbar on the project page (it has its own header) and login page
  if (isProject || isLogin) return null;

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold">
          Codebase QA
        </Link>
        <div className="flex items-center gap-4">
          {user && (
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
          )}
          {user && (
            <div className="flex items-center gap-3">
              {user.is_anonymous ? (
                <span className="text-xs text-[var(--muted-foreground)]">Guest</span>
              ) : (
                <span className="text-xs text-[var(--muted-foreground)] truncate max-w-[150px]">
                  {user.user_metadata?.full_name || user.email || "User"}
                </span>
              )}
              <button
                onClick={() => signOut()}
                className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              >
                Sign out
              </button>
            </div>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
