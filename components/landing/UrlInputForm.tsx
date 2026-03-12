"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { indexerApi } from "@/lib/api/indexer";
import { ApiError } from "@/lib/api/client";

type IndexMode = "github" | "local";

export function UrlInputForm() {
  const [mode, setMode] = useState<IndexMode>("github");
  const [url, setUrl] = useState("");
  const [localPath, setLocalPath] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");
  const [showPrivateModal, setShowPrivateModal] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Redirect to login if not authenticated
    if (!user) {
      router.push("/login");
      return;
    }

    if (mode === "github" && !url.trim()) return;
    if (mode === "local" && !localPath.trim()) return;

    setLoading(true);
    setError("");
    setProgress(mode === "github" ? "Cloning repository..." : "Scanning files...");

    try {
      if (mode === "github") {
        setProgress("Cloning repository...");
        const result = await indexerApi.cloneAndIndex(url.trim());
        setProgress("Indexing complete!");
        const slug = result.slug || result.owner_repo?.replace("/", "-") || "project";
        router.push(`/project/${slug}/overview?path=${encodeURIComponent(result.project_root)}`);
      } else {
        setProgress("Indexing local folder...");
        const result = await indexerApi.indexLocal(localPath.trim());
        setProgress("Indexing complete!");
        const name = localPath.trim().split("/").filter(Boolean).pop() || "project";
        router.push(`/project/${name}/overview?path=${encodeURIComponent(result.project_root)}`);
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        setShowPrivateModal(true);
      } else {
        setError(err instanceof Error ? err.message : "Failed to index");
      }
    } finally {
      setLoading(false);
      setProgress("");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
        {/* Mode toggle */}
        <div className="flex rounded-lg border border-[var(--border)] overflow-hidden self-start">
          <button
            type="button"
            onClick={() => { setMode("github"); setError(""); }}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${
              mode === "github"
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            GitHub URL
          </button>
          <button
            type="button"
            onClick={() => { setMode("local"); setError(""); }}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${
              mode === "local"
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            Local Path
          </button>
        </div>

        {/* Input */}
        <div className="flex gap-2">
          {mode === "github" ? (
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://github.com/owner/repo"
              className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-base outline-none placeholder:text-[var(--muted-foreground)] focus:ring-2 focus:ring-[var(--primary)]"
              disabled={loading}
            />
          ) : (
            <input
              type="text"
              value={localPath}
              onChange={(e) => setLocalPath(e.target.value)}
              placeholder="/projects/my-app"
              className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-base outline-none placeholder:text-[var(--muted-foreground)] focus:ring-2 focus:ring-[var(--primary)]"
              disabled={loading}
            />
          )}
          <button
            type="submit"
            disabled={loading || (mode === "github" ? !url.trim() : !localPath.trim())}
            className="rounded-lg bg-[var(--primary)] px-6 py-3 font-medium text-[var(--primary-foreground)] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Indexing..." : user ? "Index" : "Sign in to Index"}
          </button>
        </div>

        {mode === "local" && !loading && (
          <p className="text-xs text-[var(--muted-foreground)]">
            Enter the path to a folder mounted in the engine container (e.g. /projects/my-app)
          </p>
        )}
        {loading && (
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
            <p className="text-sm text-[var(--muted-foreground)]">
              {progress || "Processing..."}
            </p>
          </div>
        )}
        {error && (
          <p className="text-sm text-[var(--destructive)]">{error}</p>
        )}
      </form>

      {/* Private repo modal */}
      {showPrivateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--background)] p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber-600 dark:text-amber-400">
                  <rect x="5" y="9" width="10" height="8" rx="1" />
                  <path d="M7 9V6a3 3 0 016 0v3" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Private Repository</h3>
            </div>
            <p className="mb-2 text-sm text-[var(--muted-foreground)]">
              This repository is private or doesn&apos;t exist. Codebase QA currently only supports <strong>public GitHub repositories</strong>.
            </p>
            <p className="mb-5 text-sm text-[var(--muted-foreground)]">
              Private repo support is coming soon. In the meantime, you can:
            </p>
            <ul className="mb-5 space-y-1 text-sm text-[var(--muted-foreground)]">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-[var(--primary)]">&#x2022;</span>
                Use a public repository URL
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-[var(--primary)]">&#x2022;</span>
                Clone it locally and use the &quot;Local Path&quot; option
              </li>
            </ul>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setShowPrivateModal(false); setMode("local"); }}
                className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--muted)]"
              >
                Try Local Path
              </button>
              <button
                onClick={() => setShowPrivateModal(false)}
                className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] transition-opacity hover:opacity-90"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
