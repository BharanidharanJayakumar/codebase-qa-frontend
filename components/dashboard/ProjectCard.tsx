"use client";

import Link from "next/link";
import type { Project } from "@/types/api";

interface ProjectCardProps {
  project: Project;
  onDelete: (projectId: string) => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const name = project.slug || project.project_id;
  const date = new Date(project.indexed_at * 1000).toLocaleDateString();

  return (
    <div className="group relative rounded-lg border border-[var(--border)] p-5 transition-colors hover:border-[var(--muted-foreground)]">
      <Link
        href={`/project/${project.slug}?path=${encodeURIComponent(project.project_root)}`}
        className="block"
      >
        <h3 className="font-semibold text-lg mb-1 group-hover:underline">
          {name}
        </h3>
        <p className="text-sm text-[var(--muted-foreground)] mb-3 truncate">
          {project.project_root}
        </p>
        <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
          <span>{project.total_files} files</span>
          <span>Indexed {date}</span>
        </div>
      </Link>
      <button
        onClick={(e) => {
          e.preventDefault();
          onDelete(project.project_id);
        }}
        className="absolute top-3 right-3 rounded p-1 text-[var(--muted-foreground)] opacity-0 transition-opacity hover:text-[var(--destructive)] group-hover:opacity-100"
        title="Delete project"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 011.334-1.334h2.666a1.333 1.333 0 011.334 1.334V4m2 0v9.333a1.333 1.333 0 01-1.334 1.334H4.667a1.333 1.333 0 01-1.334-1.334V4h9.334z" />
        </svg>
      </button>
    </div>
  );
}
