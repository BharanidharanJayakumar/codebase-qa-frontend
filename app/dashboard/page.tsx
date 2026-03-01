import Link from "next/link";
import { ProjectGrid } from "@/components/dashboard/ProjectGrid";

export default function DashboardPage() {
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-[var(--muted-foreground)] mt-1">
              Your indexed repositories
            </p>
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
