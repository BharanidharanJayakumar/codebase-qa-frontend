"use client";

import { motion } from "motion/react";

const suggestions = [
  "What does this project do?",
  "List all API endpoints",
  "Show me the tests",
  "How is authentication handled?",
  "What frameworks are used?",
];

interface QuickChipsProps {
  onSelect: (question: string) => void;
}

export function QuickChips({ onSelect }: QuickChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((q, i) => (
        <motion.button
          key={q}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + i * 0.08, duration: 0.3 }}
          onClick={() => onSelect(q)}
          className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-[var(--muted-foreground)] backdrop-blur-sm transition-all hover:border-[#818cf8]/30 hover:bg-[#818cf8]/10 hover:text-[var(--foreground)]"
        >
          {q}
        </motion.button>
      ))}
    </div>
  );
}
