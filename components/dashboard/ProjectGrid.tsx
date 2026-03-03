"use client";

import { useState } from "react";
import Link from "next/link";
import { useProjects } from "@/lib/hooks/useProjects";
import { indexerApi } from "@/lib/api/indexer";
import { ProjectCard } from "./ProjectCard";

export function ProjectGrid() {
  const { projects, isLoading, error, refresh } = useProjects();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (projectId: string) => {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    setDeleting(projectId);
    try {
      await indexerApi.deleteProject(projectId);
      refresh();
    } catch {
      alert("Failed to delete project");
    } finally {
      setDeleting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-lg border border-[var(--border)] bg-[var(--muted)]"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center text-[var(--destructive)]">
        Failed to load projects. Is the backend running?
      </p>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 text-[var(--muted-foreground)]">
        <p className="text-lg mb-2">No projects indexed yet</p>
        <p className="text-sm">
          Go to the <Link href="/" className="underline hover:text-[var(--foreground)]">home page</Link> to index a GitHub repository.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <div key={project.project_id} className={deleting === project.project_id ? "opacity-50 pointer-events-none" : ""}>
          <ProjectCard project={project} onDelete={handleDelete} />
        </div>
      ))}
    </div>
  );
}
