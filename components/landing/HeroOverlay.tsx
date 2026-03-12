"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useAuth } from "@/components/auth/AuthProvider";
import { UrlInputForm } from "./UrlInputForm";
import { Typewriter } from "./Typewriter";

const stats = [
  { label: "Languages", value: "14+", icon: "M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" },
  { label: "Frameworks", value: "30+", icon: "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" },
  { label: "AI Agents", value: "4", icon: "M12 2a4 4 0 014 4v1a4 4 0 01-8 0V6a4 4 0 014-4zM6 21v-1a6 6 0 0112 0v1" },
];

export function HeroOverlay() {
  const { user } = useAuth();

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
      <main className="flex max-w-2xl flex-col items-center gap-5 text-center">
        {/* Badge with glow */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glow-border rounded-full bg-[#818cf8]/10 px-5 py-1.5 text-sm font-medium text-[#a5b4fc]"
        >
          AI-Powered Codebase Intelligence
        </motion.div>

        {/* Gradient 3D heading */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gradient text-5xl font-extrabold tracking-tight sm:text-6xl"
          style={{ textShadow: "0 0 40px rgba(99,102,241,0.3)" }}
        >
          Understand Any Codebase
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="h-7 text-lg"
        >
          <Typewriter />
        </motion.div>

        {/* Glassmorphism input card with gradient border */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
          className="glass-card glow-border w-full rounded-2xl p-6 pulse-glow"
        >
          <UrlInputForm />
        </motion.div>

        {/* Stats strip with icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-5"
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              {i > 0 && <div className="h-5 w-px bg-[#818cf8]/20" />}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5">
                <path d={s.icon} />
              </svg>
              <span className="text-sm font-bold text-white">{s.value}</span>
              <span className="text-xs text-[#8888aa]">{s.label}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex gap-6 text-sm"
        >
          {user ? (
            <Link
              href="/dashboard"
              className="text-[#a5b4fc] underline underline-offset-4 transition-colors hover:text-white"
            >
              View Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-[#a5b4fc] underline underline-offset-4 transition-colors hover:text-white"
            >
              Sign in to view your projects
            </Link>
          )}
        </motion.div>
      </main>
    </div>
  );
}
