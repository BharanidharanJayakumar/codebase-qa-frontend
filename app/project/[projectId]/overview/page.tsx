"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { qaApi } from "@/lib/api/qa";
import { StatCounter } from "@/components/project/StatCounter";
import { ArchBadges } from "@/components/project/ArchBadges";
import { ActionCards } from "@/components/project/ActionCards";
import { QuickChips } from "@/components/project/QuickChips";
import type { ProjectSummary, SymbolCategoryItem } from "@/types/api";

const ProjectGlobe = dynamic(
  () => import("@/components/project/ProjectGlobe").then((m) => m.ProjectGlobe),
  { ssr: false }
);

export default function OverviewPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectId = params.projectId as string;
  const projectPath = searchParams.get("path") || "";

  const [summary, setSummary] = useState<ProjectSummary | null>(null);
  const [categories, setCategories] = useState<Record<string, SymbolCategoryItem[]>>({});
  const [files, setFiles] = useState<{ path: string; ext: string; size: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectPath) return;

    const load = async () => {
      try {
        const [summaryRes, categoriesRes, filesRes] = await Promise.all([
          qaApi.getProjectSummary(projectPath),
          qaApi.getProjectCategories(projectPath),
          qaApi.listProjectFiles(projectPath),
        ]);

        if (summaryRes.summary) setSummary(summaryRes.summary);
        if (categoriesRes.categories) setCategories(categoriesRes.categories);
        if (filesRes.files) {
          setFiles(
            filesRes.files.map((f) => ({
              path: f.relative_path,
              ext: f.extension,
              size: f.size_bytes,
            }))
          );
        }
      } catch (err) {
        console.error("Failed to load overview:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [projectPath]);

  const navigateToProject = (mode?: string) => {
    const base = `/project/${projectId}?path=${encodeURIComponent(projectPath)}`;
    router.push(mode ? `${base}&mode=${mode}` : base);
  };

  const handleQuickQuestion = (question: string) => {
    router.push(
      `/project/${projectId}?path=${encodeURIComponent(projectPath)}&mode=chat&q=${encodeURIComponent(question)}`
    );
  };

  // Compute stats
  const totalFiles = files.length;
  const totalLines = summary?.total_lines || 0;
  const totalSymbols = summary?.total_symbols
    ? Object.values(summary.total_symbols).reduce((a, b) => a + b, 0)
    : 0;
  const primaryLang = summary?.languages
    ? Object.entries(summary.languages).sort(([, a], [, b]) => b - a)[0]?.[0] || "—"
    : "—";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#818cf8] border-t-transparent" />
          <p className="text-sm text-[var(--muted-foreground)]">Loading project intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center gap-3"
      >
        <button
          onClick={() => router.push("/dashboard")}
          className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
        >
          Dashboard
        </button>
        <span className="text-[var(--muted-foreground)]">/</span>
        <h1 className="text-xl font-bold">{projectId}</h1>
      </motion.div>

      {/* 3D Globe */}
      {files.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden"
        >
          <ProjectGlobe files={files} />
        </motion.div>
      )}

      {/* Description */}
      {summary?.project_description && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 text-center text-lg text-[var(--muted-foreground)] italic"
        >
          &ldquo;{summary.project_description}&rdquo;
        </motion.p>
      )}

      {/* Stats grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCounter value={totalFiles} label="Files" />
        <StatCounter value={totalLines} label="Lines" />
        <StatCounter value={totalSymbols} label="Symbols" />
        <motion.div
          className="rounded-xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-3xl font-bold uppercase">{primaryLang}</div>
          <div className="mt-1 text-sm text-[var(--muted-foreground)]">Primary</div>
        </motion.div>
      </div>

      {/* Frameworks */}
      {summary?.framework_hints && summary.framework_hints.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6 flex flex-wrap gap-2"
        >
          {summary.framework_hints.map((fw) => (
            <span
              key={fw}
              className="rounded-full border border-[#818cf8]/30 bg-[#818cf8]/10 px-3 py-1 text-sm font-medium text-[#818cf8]"
            >
              {fw}
            </span>
          ))}
        </motion.div>
      )}

      {/* Architecture badges */}
      {Object.keys(categories).length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            Architecture
          </h2>
          <ArchBadges categories={categories} />
        </motion.div>
      )}

      {/* Action cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mb-8"
      >
        <h2 className="mb-4 text-center text-lg font-semibold">What would you like to do?</h2>
        <ActionCards
          onChat={() => navigateToProject("chat")}
          onExplore={() => navigateToProject("code")}
          onSearch={() => navigateToProject("search")}
          onArchitecture={() => navigateToProject("chat")}
        />
      </motion.div>

      {/* Quick question chips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center"
      >
        <p className="mb-3 text-sm text-[var(--muted-foreground)]">Quick questions</p>
        <QuickChips onSelect={handleQuickQuestion} />
      </motion.div>
    </div>
  );
}
