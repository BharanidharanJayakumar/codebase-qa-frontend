"use client";

import { motion } from "motion/react";

const steps = [
  {
    num: "1",
    title: "Paste",
    desc: "Drop a GitHub URL or local path",
    gradient: "from-[#6366f1] to-[#818cf8]",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
  {
    num: "2",
    title: "Index",
    desc: "AI analyzes code, imports, architecture",
    gradient: "from-[#a855f7] to-[#c084fc]",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
      </svg>
    ),
  },
  {
    num: "3",
    title: "Ask",
    desc: "Chat with your codebase naturally",
    gradient: "from-[#3b82f6] to-[#60a5fa]",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        <path d="M8 9h8M8 13h4" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  return (
    <div className="relative mx-auto mt-24 max-w-3xl px-4 pb-24">
      <motion.h2
        className="text-gradient mb-12 text-center text-3xl font-extrabold"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ textShadow: "0 0 30px rgba(99,102,241,0.2)" }}
      >
        How It Works
      </motion.h2>

      <div className="relative flex flex-col items-center gap-12 sm:flex-row sm:justify-between sm:gap-0">
        {/* Connecting beam line with glow */}
        <div className="absolute top-1/2 left-[15%] right-[15%] hidden -translate-y-1/2 sm:block">
          <div
            className="h-[2px] w-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #6366f1, #a855f7, #3b82f6)",
              animation: "beam-flow 3s linear infinite",
              backgroundSize: "200% 100%",
              boxShadow: "0 0 15px rgba(99,102,241,0.4), 0 0 30px rgba(99,102,241,0.2)",
            }}
          />
        </div>

        {steps.map((step, i) => (
          <motion.div
            key={step.num}
            className="relative z-10 flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2, duration: 0.5 }}
          >
            <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.gradient} text-white shadow-lg`}
              style={{ boxShadow: `0 8px 25px ${i === 0 ? "rgba(99,102,241,0.4)" : i === 1 ? "rgba(168,85,247,0.4)" : "rgba(59,130,246,0.4)"}` }}
            >
              {step.icon}
            </div>
            <div className="mb-1 text-xs font-bold uppercase tracking-wider text-[#a5b4fc]">
              Step {step.num}
            </div>
            <h3 className="mb-1 text-lg font-bold text-white">{step.title}</h3>
            <p className="max-w-[160px] text-sm text-[#8888aa]">
              {step.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
