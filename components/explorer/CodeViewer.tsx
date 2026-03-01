"use client";

import { useEffect, useState } from "react";
import { useFileContent } from "@/lib/hooks/useFileContent";
import { detectLanguage } from "@/lib/explorer/language-detector";

interface CodeViewerProps {
  filePath: string | null;
  projectPath?: string;
}

export function CodeViewer({ filePath, projectPath }: CodeViewerProps) {
  const { content, extension, isLoading, error } = useFileContent(filePath, projectPath);
  const [highlighted, setHighlighted] = useState<string>("");
  const [highlighting, setHighlighting] = useState(false);

  useEffect(() => {
    if (!content || !filePath) {
      setHighlighted("");
      return;
    }

    let cancelled = false;
    setHighlighting(true);

    fetch("/api/highlight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: content,
        lang: detectLanguage(filePath),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setHighlighted(data.html || "");
      })
      .catch(() => {
        if (!cancelled) setHighlighted("");
      })
      .finally(() => {
        if (!cancelled) setHighlighting(false);
      });

    return () => {
      cancelled = true;
    };
  }, [content, filePath]);

  if (!filePath) {
    return (
      <div className="flex h-full items-center justify-center text-[var(--muted-foreground)]">
        <p>Select a file to view its contents</p>
      </div>
    );
  }

  if (isLoading || highlighting) {
    return (
      <div className="p-4">
        <div className="mb-3 font-mono text-sm text-[var(--muted-foreground)]">{filePath}</div>
        <div className="space-y-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-4 animate-pulse rounded bg-[var(--muted)]"
              style={{ width: `${40 + Math.random() * 50}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-[var(--destructive)]">
        Failed to load file: {filePath}
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border)] bg-[var(--background)] px-4 py-2">
        <span className="font-mono text-sm text-[var(--muted-foreground)] truncate">
          {filePath}
        </span>
        {extension && (
          <span className="rounded bg-[var(--muted)] px-2 py-0.5 text-xs text-[var(--muted-foreground)]">
            {extension}
          </span>
        )}
      </div>
      {highlighted ? (
        <div
          className="p-4 text-sm font-mono leading-6 [&_pre]:!bg-transparent [&_code]:!bg-transparent"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      ) : (
        <pre className="p-4 text-sm font-mono leading-6 whitespace-pre-wrap">
          {content}
        </pre>
      )}
    </div>
  );
}
