"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

interface StatCounterProps {
  value: number;
  label: string;
  suffix?: string;
  duration?: number;
}

export function StatCounter({ value, label, suffix = "", duration = 1.5 }: StatCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (value === 0) return;
    let start = 0;
    const increment = value / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [value, duration]);

  const display = value >= 1000 ? `${(count / 1000).toFixed(1)}K` : count.toLocaleString();

  return (
    <motion.div
      className="rounded-xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-3xl font-bold tabular-nums">
        {display}{suffix}
      </div>
      <div className="mt-1 text-sm text-[var(--muted-foreground)]">{label}</div>
    </motion.div>
  );
}
