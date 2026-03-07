"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { ProjectGrid } from "@/components/dashboard/ProjectGrid";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              {user.is_anonymous
                ? "Guest Dashboard"
                : `Welcome, ${user.user_metadata?.full_name?.split(" ")[0] || "there"}`}
            </h1>
            <p className="text-[var(--muted-foreground)] mt-1">
              Your indexed repositories
            </p>
            {user.is_anonymous && (
              <p className="text-xs text-amber-500 mt-1">
                Guest accounts are limited. Sign in to save your projects permanently.
              </p>
            )}
          </div>
          <Link
            href="/"
            className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] transition-opacity hover:opacity-90"
          >
            + Index New Repo
          </Link>
        </div>
        <ProjectGrid />
      </div>
    </div>
  );
}
