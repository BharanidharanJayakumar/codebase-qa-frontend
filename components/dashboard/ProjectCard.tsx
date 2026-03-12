"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { Project } from "@/types/api";

interface ProjectCardProps {
  project: Project;
  onDelete: (projectId: string) => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  const name = project.slug || project.project_id;
  const timeAgo = getTimeAgo(project.indexed_at * 1000);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateX(((y - centerY) / centerY) * -6);
    setRotateY(((x - centerX) / centerX) * 6);
    setGlowPos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md transition-shadow hover:shadow-lg hover:shadow-indigo-500/10"
      style={{
        transform: `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: "transform 0.15s ease-out",
      }}
    >
      {/* Mouse-following glow */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(99,102,241,0.12) 0%, transparent 50%)`,
          opacity: rotateX !== 0 || rotateY !== 0 ? 1 : 0,
        }}
      />

      <div className="relative z-10 p-5">
        <Link
          href={`/project/${project.slug}/overview?path=${encodeURIComponent(project.project_root)}`}
          className="block"
        >
          <h3 className="text-lg font-semibold mb-1 group-hover:text-[#818cf8] transition-colors">
            {name}
          </h3>

          {(project as any).github_url && (
            <p className="text-xs text-[var(--muted-foreground)] mb-3 truncate">
              {(project as any).github_url}
            </p>
          )}

          <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M13 2H3a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V3a1 1 0 00-1-1zM6 2v12" />
              </svg>
              {project.total_files} files
            </span>
            <span>{timeAgo}</span>
          </div>
        </Link>

        <div className="mt-3 flex items-center gap-2">
          <Link
            href={`/project/${project.slug}/overview?path=${encodeURIComponent(project.project_root)}`}
            className="rounded-md border border-[var(--border)] px-3 py-1 text-xs font-medium transition-colors hover:bg-[var(--muted)]"
          >
            Overview
          </Link>
          <Link
            href={`/project/${project.slug}?path=${encodeURIComponent(project.project_root)}&mode=chat`}
            className="rounded-md border border-[var(--border)] px-3 py-1 text-xs font-medium transition-colors hover:bg-[var(--muted)]"
          >
            Chat
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(project.project_id);
            }}
            className="ml-auto rounded-md p-1 text-[var(--muted-foreground)] opacity-0 transition-opacity hover:text-[var(--destructive)] group-hover:opacity-100"
            title="Delete project"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 011.334-1.334h2.666a1.333 1.333 0 011.334 1.334V4m2 0v9.333a1.333 1.333 0 01-1.334 1.334H4.667a1.333 1.333 0 01-1.334-1.334V4h9.334z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}
