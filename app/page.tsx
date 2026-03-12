"use client";

import dynamic from "next/dynamic";
import { HeroOverlay } from "@/components/landing/HeroOverlay";
import { FeatureCards } from "@/components/landing/FeatureCards";
import { HowItWorks } from "@/components/landing/HowItWorks";

const Scene3D = dynamic(
  () => import("@/components/landing/Scene3D").then((m) => m.Scene3D),
  { ssr: false }
);

export default function Home() {
  return (
    /* Force dark immersive theme on landing — 3D needs dark to shine */
    <div className="landing-dark relative min-h-screen overflow-x-hidden">
      {/* Gradient mesh background — visible even without 3D */}
      <div className="pointer-events-none fixed inset-0 -z-20">
        <div className="absolute inset-0 bg-[#050510]" />
        {/* Gradient orbs */}
        <div className="absolute top-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-[#6366f1]/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-[#a855f7]/15 blur-[100px]" />
        <div className="absolute top-[40%] right-[20%] h-[300px] w-[300px] rounded-full bg-[#3b82f6]/10 blur-[80px]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* 3D canvas */}
      <Scene3D />

      {/* Hero */}
      <HeroOverlay />

      {/* Features */}
      <FeatureCards />

      {/* How it works */}
      <HowItWorks />

      {/* Bottom gradient fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050510] to-transparent" />
    </div>
  );
}
