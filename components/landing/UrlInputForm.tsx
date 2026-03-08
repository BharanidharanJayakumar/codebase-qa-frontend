"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { indexerApi } from "@/lib/api/indexer";

type IndexMode = "github" | "local";

export function UrlInputForm() {
  const [mode, setMode] = useState<IndexMode>("github");
  const [url, setUrl] = useState("");
  const [localPath, setLocalPath] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");
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
        const slug = result.owner_repo.replace("/", "-");
        router.push(`/project/${slug}?path=${encodeURIComponent(result.project_root)}`);
      } else {
        setProgress("Indexing local folder...");
        const result = await indexerApi.indexLocal(localPath.trim());
        setProgress("Indexing complete!");
        const name = localPath.trim().split("/").filter(Boolean).pop() || "project";
        router.push(`/project/${name}?path=${encodeURIComponent(result.project_root)}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to index");
    } finally {
      setLoading(false);
      setProgress("");
    }
  };

  return (
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
  );
}
