"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useAuth } from "@/components/auth/AuthProvider";
import { UrlInputForm } from "./UrlInputForm";
import { Typewriter } from "./Typewriter";

const stats = [
  { label: "Languages", value: "14+" },
  { label: "Frameworks", value: "30+" },
  { label: "Agents", value: "4" },
];

export function HeroOverlay() {
  const { user } = useAuth();

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
      <main className="flex max-w-2xl flex-col items-center gap-5 text-center">
        {/* Compact badge — not a huge title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-full border border-[#818cf8]/30 bg-[#818cf8]/10 px-4 py-1 text-sm font-medium text-[#818cf8]"
        >
          AI-Powered Codebase Intelligence
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold tracking-tight sm:text-5xl"
        >
          Understand Any Codebase
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="h-7 text-lg text-[var(--muted-foreground)]"
        >
          <Typewriter />
        </motion.p>

        {/* Glassmorphism input card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full rounded-2xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl"
        >
          <UrlInputForm />
        </motion.div>

        {/* Inline stats strip — dense, not empty */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-6"
        >
          {stats.map((s, i) => (
            <div key={s.label} className="flex items-center gap-2">
              {i > 0 && <div className="h-4 w-px bg-white/10" />}
              <span className="text-sm font-bold">{s.value}</span>
              <span className="text-xs text-[var(--muted-foreground)]">{s.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex gap-6 text-sm text-[var(--muted-foreground)]"
        >
          {user ? (
            <Link
              href="/dashboard"
              className="underline underline-offset-4 hover:text-[var(--foreground)] transition-colors"
            >
              View Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="underline underline-offset-4 hover:text-[var(--foreground)] transition-colors"
            >
              Sign in to view your projects
            </Link>
          )}
        </motion.div>
      </main>
    </div>
  );
}
