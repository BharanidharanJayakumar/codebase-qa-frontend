"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const isBlock = match || (typeof children === "string" && children.includes("\n"));

          if (isBlock) {
            return (
              <CodeBlock language={match?.[1] || ""}>
                {String(children).replace(/\n$/, "")}
              </CodeBlock>
            );
          }

          return (
            <code
              className="rounded bg-[var(--accent)] px-1.5 py-0.5 text-xs font-mono"
              {...props}
            >
              {children}
            </code>
          );
        },
        p({ children }) {
          return <p className="mb-3 last:mb-0">{children}</p>;
        },
        ul({ children }) {
          return <ul className="mb-3 ml-4 list-disc space-y-1 last:mb-0">{children}</ul>;
        },
        ol({ children }) {
          return <ol className="mb-3 ml-4 list-decimal space-y-1 last:mb-0">{children}</ol>;
        },
        h1({ children }) {
          return <h1 className="mb-2 text-lg font-bold">{children}</h1>;
        },
        h2({ children }) {
          return <h2 className="mb-2 text-base font-bold">{children}</h2>;
        },
        h3({ children }) {
          return <h3 className="mb-2 text-sm font-bold">{children}</h3>;
        },
        a({ href, children }) {
          return (
            <a href={href} className="underline underline-offset-2 hover:opacity-80" target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          );
        },
        blockquote({ children }) {
          return (
            <blockquote className="mb-3 border-l-2 border-[var(--border)] pl-3 text-[var(--muted-foreground)] last:mb-0">
              {children}
            </blockquote>
          );
        },
        table({ children }) {
          return (
            <div className="mb-3 overflow-x-auto last:mb-0">
              <table className="min-w-full text-xs">{children}</table>
            </div>
          );
        },
        th({ children }) {
          return <th className="border border-[var(--border)] px-2 py-1 text-left font-semibold">{children}</th>;
        },
        td({ children }) {
          return <td className="border border-[var(--border)] px-2 py-1">{children}</td>;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

function CodeBlock({ children, language }: { children: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative mb-3 rounded-md bg-[var(--background)] border border-[var(--border)] overflow-hidden last:mb-0">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-[var(--border)]">
        <span className="text-xs text-[var(--muted-foreground)]">{language || "code"}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-3 text-xs font-mono leading-5">
        <code>{children}</code>
      </pre>
    </div>
  );
}
