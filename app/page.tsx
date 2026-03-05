"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { UrlInputForm } from "@/components/landing/UrlInputForm";

const features = [
  {
    title: "14 Languages",
    desc: "Python, JS, TS, Go, Java, Rust, C#, Ruby, PHP, C/C++ and more",
  },
  {
    title: "Instant Indexing",
    desc: "Pure Python indexing — no API calls. 100 files in under a second",
  },
  {
    title: "Real Source Code",
    desc: "Answers from actual code, not summaries. BM25 + semantic retrieval",
  },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4">
      {/* Subtle gradient backdrop */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, var(--muted) 0%, transparent 70%)",
        }}
      />

      <main className="flex max-w-2xl flex-col items-center gap-8 text-center">
        <h1 className="text-5xl font-bold tracking-tight">
          Codebase QA
        </h1>
        <p className="text-lg text-[var(--muted-foreground)]">
          Paste a GitHub URL. Ask questions about any codebase.
          <br />
          No IDE required. Instant answers from actual source code.
        </p>

        <UrlInputForm />

        <div className="flex gap-6 text-sm text-[var(--muted-foreground)]">
          {user ? (
            <Link
              href="/dashboard"
              className="underline underline-offset-4 hover:text-[var(--foreground)]"
            >
              View Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="underline underline-offset-4 hover:text-[var(--foreground)]"
            >
              Sign in to view your projects
            </Link>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 text-left">
          {features.map((card, i) => (
            <div
              key={card.title}
              className="animate-fade-in-up rounded-lg border border-[var(--border)] p-4"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <h3 className="font-semibold mb-1">{card.title}</h3>
              <p className="text-sm text-[var(--muted-foreground)]">{card.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
