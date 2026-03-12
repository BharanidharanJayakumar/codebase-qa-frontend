"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

function ActionCard({ title, description, icon, onClick }: ActionCardProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateX(((y - centerY) / centerY) * -8);
    setRotateY(((x - centerX) / centerX) * 8);
    setGlowPos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-5 text-left backdrop-blur-md transition-shadow hover:shadow-lg hover:shadow-indigo-500/10"
      style={{
        transform: `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: "transform 0.15s ease-out",
      }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Mouse-following glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
        style={{
          background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(99,102,241,0.15) 0%, transparent 60%)`,
          opacity: rotateX !== 0 || rotateY !== 0 ? 1 : 0,
        }}
      />
      <div className="relative z-10">
        <div className="mb-3 text-[#818cf8]">{icon}</div>
        <h3 className="mb-1 text-base font-semibold">{title}</h3>
        <p className="text-sm text-[var(--muted-foreground)]">{description}</p>
      </div>
    </motion.button>
  );
}

interface ActionCardsProps {
  onChat: () => void;
  onExplore: () => void;
  onSearch: () => void;
  onArchitecture: () => void;
}

export function ActionCards({ onChat, onExplore, onSearch, onArchitecture }: ActionCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <ActionCard
        title="Chat about this codebase"
        description="Ask any question and get answers from actual source code"
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        }
        onClick={onChat}
      />
      <ActionCard
        title="Explore files & code"
        description="Browse the file tree with syntax highlighting"
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
          </svg>
        }
        onClick={onExplore}
      />
      <ActionCard
        title="Search code"
        description="Grep-like search across all indexed files"
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        }
        onClick={onSearch}
      />
      <ActionCard
        title="Architecture deep dive"
        description="View routes, DTOs, services, imports graph"
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
            <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
          </svg>
        }
        onClick={onArchitecture}
      />
    </div>
  );
}
