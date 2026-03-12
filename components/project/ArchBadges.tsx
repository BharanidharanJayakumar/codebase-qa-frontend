"use client";

import { motion } from "motion/react";

const CATEGORY_META: Record<string, { label: string; color: string }> = {
  route: { label: "Routes", color: "#3b82f6" },
  dto: { label: "Models/DTOs", color: "#8b5cf6" },
  test: { label: "Tests", color: "#22c55e" },
  service: { label: "Services", color: "#f59e0b" },
  config: { label: "Config", color: "#6b7280" },
  middleware: { label: "Middleware", color: "#ec4899" },
};

interface ArchBadgesProps {
  categories: Record<string, { file: string; symbol: string; detail: string }[]>;
}

export function ArchBadges({ categories }: ArchBadgesProps) {
  const entries = Object.entries(categories).filter(([, items]) => items.length > 0);
  if (entries.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {entries.map(([cat, items], i) => {
        const meta = CATEGORY_META[cat] || { label: cat, color: "#6366f1" };
        return (
          <motion.div
            key={cat}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm"
          >
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: meta.color }}
            />
            <span className="text-sm font-medium">{meta.label}</span>
            <span className="text-sm text-[var(--muted-foreground)]">{items.length}</span>
          </motion.div>
        );
      })}
    </div>
  );
}
