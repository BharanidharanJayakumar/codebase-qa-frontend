"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";

const features = [
  {
    title: "14 Languages",
    desc: "Python, JS, TS, Go, Java, Rust, C#, Ruby, PHP, C/C++ and more",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
        <path d="M7 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Smart AI Answers",
    desc: "Intent detection routes queries to the right agent. Aggregate, overview, or code-specific.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2a4 4 0 014 4v2a4 4 0 01-8 0V6a4 4 0 014-4z" />
        <path d="M6 20v-1a6 6 0 0112 0v1" />
        <circle cx="12" cy="7" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Instant Indexing",
    desc: "Pure Python indexing with project-level intelligence. Frameworks, imports, architecture — all detected.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
];

function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateX(((y - centerY) / centerY) * -10);
    setRotateY(((x - centerX) / centerX) * 10);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: "transform 0.15s ease-out",
      }}
    >
      {children}
    </div>
  );
}

export function FeatureCards() {
  return (
    <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-6 px-4 sm:grid-cols-3">
      {features.map((card, i) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15, duration: 0.5 }}
        >
          <TiltCard>
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <div className="mb-3 text-[#818cf8]">{card.icon}</div>
              <h3 className="mb-2 text-lg font-semibold">{card.title}</h3>
              <p className="text-sm text-[var(--muted-foreground)]">{card.desc}</p>
            </div>
          </TiltCard>
        </motion.div>
      ))}
    </div>
  );
}
