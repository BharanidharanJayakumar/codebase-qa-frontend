"use client";

import type { ReactNode } from "react";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  relevantFiles?: string[];
  onFileClick?: (filePath: string) => void;
  children?: ReactNode;
}

export function ChatMessage({ role, content, relevantFiles, onFileClick, children }: ChatMessageProps) {
  return (
    <div className={`flex gap-3 ${role === "user" ? "justify-end" : ""}`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 text-sm leading-relaxed ${
          role === "user"
            ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
            : "bg-[var(--muted)]"
        }`}
      >
        {children || (
          role === "assistant" && content ? (
            <MarkdownRenderer content={content} />
          ) : (
            <div className="whitespace-pre-wrap">{content}</div>
          )
        )}
        {relevantFiles && relevantFiles.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {relevantFiles.map((file) => (
              <button
                key={file}
                onClick={() => onFileClick?.(file)}
                className="rounded bg-[var(--accent)] px-2 py-0.5 text-xs font-mono text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
              >
                {file.split("/").pop()}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
