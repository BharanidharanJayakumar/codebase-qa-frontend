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
    if (!user) { router.push("/login"); return; }
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
        {/* Mode toggle — pill style */}
        <div className="flex rounded-full border border-[#2a2a4a] bg-[#0d0d20] overflow-hidden self-start">
          <button
            type="button"
            onClick={() => { setMode("github"); setError(""); }}
            className={`px-5 py-1.5 text-sm font-medium transition-all ${
              mode === "github"
                ? "bg-gradient-to-r from-[#6366f1] to-[#818cf8] text-white shadow-lg shadow-indigo-500/25"
                : "text-[#8888aa] hover:text-white"
            }`}
          >
            GitHub URL
          </button>
          <button
            type="button"
            onClick={() => { setMode("local"); setError(""); }}
            className={`px-5 py-1.5 text-sm font-medium transition-all ${
              mode === "local"
                ? "bg-gradient-to-r from-[#6366f1] to-[#818cf8] text-white shadow-lg shadow-indigo-500/25"
                : "text-[#8888aa] hover:text-white"
            }`}
          >
            Local Path
          </button>
        </div>

        {/* Input + button */}
        <div className="flex gap-2">
          <input
            type="text"
            value={mode === "github" ? url : localPath}
            onChange={(e) => mode === "github" ? setUrl(e.target.value) : setLocalPath(e.target.value)}
            placeholder={mode === "github" ? "https://github.com/owner/repo" : "/projects/my-app"}
            className="flex-1 rounded-xl border border-[#2a2a4a] bg-[#0a0a1a]/80 px-4 py-3.5 text-base text-white outline-none placeholder:text-[#555570] focus:border-[#6366f1] focus:shadow-lg focus:shadow-indigo-500/20 transition-all"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || (mode === "github" ? !url.trim() : !localPath.trim())}
            className="btn-3d rounded-xl px-7 py-3.5 font-semibold text-white disabled:opacity-40 disabled:transform-none disabled:shadow-none"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Indexing...
              </span>
            ) : user ? "Index" : "Sign in"}
          </button>
        </div>

        {mode === "local" && !loading && (
          <p className="text-xs text-[#555570]">
            Enter the path to a folder mounted in the engine container
          </p>
        )}
        {loading && (
          <div className="flex items-center gap-3">
            <div className="h-1 flex-1 rounded-full bg-[#1a1a2e] overflow-hidden">
              <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] animate-pulse" />
            </div>
            <p className="text-sm text-[#a5b4fc] shrink-0">{progress || "Processing..."}</p>
          </div>
        )}
        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}
      </form>

      {/* Private repo modal */}
      {showPrivateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="glass-card glow-border mx-4 w-full max-w-md rounded-2xl p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber-400">
                  <rect x="5" y="9" width="10" height="8" rx="1" />
                  <path d="M7 9V6a3 3 0 016 0v3" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Private Repository</h3>
            </div>
            <p className="mb-2 text-sm text-[#8888aa]">
              This repository is private or doesn&apos;t exist. Only <strong className="text-white">public GitHub repositories</strong> are supported.
            </p>
            <p className="mb-5 text-sm text-[#8888aa]">
              You can clone it locally and use the &quot;Local Path&quot; option instead.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setShowPrivateModal(false); setMode("local"); }}
                className="rounded-xl border border-[#2a2a4a] bg-[#1a1a2e] px-4 py-2 text-sm font-medium text-[#a5b4fc] transition-all hover:bg-[#2a2a4a]"
              >
                Try Local Path
              </button>
              <button
                onClick={() => setShowPrivateModal(false)}
                className="btn-3d rounded-xl px-4 py-2 text-sm font-semibold text-white"
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
