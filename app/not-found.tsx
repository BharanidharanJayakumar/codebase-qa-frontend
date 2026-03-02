import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-2">404</h1>
        <p className="text-[var(--muted-foreground)] mb-6">
          This page could not be found.
        </p>
        <Link
          href="/"
          className="rounded-lg bg-[var(--primary)] px-6 py-3 font-medium text-[var(--primary-foreground)] transition-opacity hover:opacity-90"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
