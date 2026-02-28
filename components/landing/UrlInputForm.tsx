"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { indexerApi } from "@/lib/api/indexer";

export function UrlInputForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError("");

    try {
      const result = await indexerApi.cloneAndIndex(url.trim());
      const slug = result.owner_repo.replace("/", "-");
      router.push(`/project/${slug}?path=${encodeURIComponent(result.project_root)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to index repository");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://github.com/owner/repo"
          className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-base outline-none placeholder:text-[var(--muted-foreground)] focus:ring-2 focus:ring-[var(--primary)]"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="rounded-lg bg-[var(--primary)] px-6 py-3 font-medium text-[var(--primary-foreground)] transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Indexing..." : "Index"}
        </button>
      </div>
      {loading && (
        <p className="text-sm text-[var(--muted-foreground)]">
          Cloning and indexing repository — this may take a moment...
        </p>
      )}
      {error && (
        <p className="text-sm text-[var(--destructive)]">{error}</p>
      )}
    </form>
  );
}
