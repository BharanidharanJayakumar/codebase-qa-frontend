import Link from "next/link";
import { UrlInputForm } from "@/components/landing/UrlInputForm";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
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
          <Link
            href="/dashboard"
            className="underline underline-offset-4 hover:text-[var(--foreground)]"
          >
            View Dashboard
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 text-left">
          <div className="rounded-lg border border-[var(--border)] p-4">
            <h3 className="font-semibold mb-1">14 Languages</h3>
            <p className="text-sm text-[var(--muted-foreground)]">
              Python, JS, TS, Go, Java, Rust, C#, Ruby, PHP, C/C++ and more
            </p>
          </div>
          <div className="rounded-lg border border-[var(--border)] p-4">
            <h3 className="font-semibold mb-1">Instant Indexing</h3>
            <p className="text-sm text-[var(--muted-foreground)]">
              Pure Python indexing — no API calls. 100 files in under a second
            </p>
          </div>
          <div className="rounded-lg border border-[var(--border)] p-4">
            <h3 className="font-semibold mb-1">Real Source Code</h3>
            <p className="text-sm text-[var(--muted-foreground)]">
              Answers from actual code, not summaries. BM25 + semantic retrieval
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
