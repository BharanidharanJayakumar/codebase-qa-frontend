"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";

const features = [
  {
    title: "14 Languages",
    desc: "Python, JS, TS, Go, Java, Rust, C#, Ruby, PHP, C/C++ and more",
    gradient: "from-[#6366f1] to-[#818cf8]",
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
    gradient: "from-[#a855f7] to-[#c084fc]",
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
    desc: "Project-level intelligence. Frameworks, imports, architecture — all detected automatically.",
    gradient: "from-[#3b82f6] to-[#60a5fa]",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
];

function TiltCard({ children, glowColor }: { children: React.ReactNode; glowColor: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRotateX(((y - rect.height / 2) / (rect.height / 2)) * -10);
    setRotateY(((x - rect.width / 2) / (rect.width / 2)) * 10);
    setGlowPos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { setRotateX(0); setRotateY(0); }}
      className="relative"
      style={{
        transform: `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: "transform 0.15s ease-out",
      }}
    >
      {/* Mouse-following glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, ${glowColor} 0%, transparent 50%)`,
          opacity: rotateX !== 0 || rotateY !== 0 ? 1 : 0,
        }}
      />
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
          <TiltCard glowColor={i === 0 ? "rgba(99,102,241,0.15)" : i === 1 ? "rgba(168,85,247,0.15)" : "rgba(59,130,246,0.15)"}>
            <div className="glass-card glow-border relative overflow-hidden rounded-2xl p-6">
              {/* Top accent gradient line */}
              <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${card.gradient}`} />
              <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg`}>
                <span className="text-white">{card.icon}</span>
              </div>
              <h3 className="mb-2 text-lg font-bold text-white">{card.title}</h3>
              <p className="text-sm text-[#8888aa] leading-relaxed">{card.desc}</p>
            </div>
          </TiltCard>
        </motion.div>
      ))}
    </div>
  );
}
