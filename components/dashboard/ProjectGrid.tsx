"use client";

import { useState } from "react";
import Link from "next/link";
import { useProjects } from "@/lib/hooks/useProjects";
import { indexerApi } from "@/lib/api/indexer";
import { ProjectCard } from "./ProjectCard";

export function ProjectGrid() {
  const { projects, isLoading, error, refresh } = useProjects();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDelete = async (projectId: string) => {
    setDeleteConfirm(projectId);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(deleteConfirm);
    setDeleteConfirm(null);
    try {
      await indexerApi.deleteProject(deleteConfirm);
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
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--muted)]">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--muted-foreground)]">
            <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        </div>
        <p className="text-lg font-medium mb-2">No projects indexed yet</p>
        <p className="text-sm text-[var(--muted-foreground)] mb-6 max-w-xs">
          Index a GitHub repository to start asking questions about its codebase.
        </p>
        <Link
          href="/"
          className="rounded-lg bg-[var(--primary)] px-6 py-2.5 text-sm font-medium text-[var(--primary-foreground)] transition-opacity hover:opacity-90"
        >
          Index Your First Repo
        </Link>
      </div>
    );
  }

  const projectToDelete = projects.find((p) => p.project_id === deleteConfirm);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div key={project.project_id} className={deleting === project.project_id ? "opacity-50 pointer-events-none" : ""}>
            <ProjectCard project={project} onDelete={handleDelete} />
          </div>
        ))}
      </div>

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-sm rounded-lg border border-[var(--border)] bg-[var(--background)] p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Delete Project</h3>
            <p className="text-sm text-[var(--muted-foreground)] mb-4">
              Are you sure you want to delete <strong>{projectToDelete?.slug || deleteConfirm}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm transition-colors hover:bg-[var(--muted)]"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
