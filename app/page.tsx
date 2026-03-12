"use client";

import dynamic from "next/dynamic";
import { HeroOverlay } from "@/components/landing/HeroOverlay";
import { FeatureCards } from "@/components/landing/FeatureCards";
import { HowItWorks } from "@/components/landing/HowItWorks";

// Dynamic import for R3F (SSR breaks Three.js)
const Scene3D = dynamic(
  () => import("@/components/landing/Scene3D").then((m) => m.Scene3D),
  { ssr: false }
);

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* 3D background — full viewport */}
      <Scene3D />

      {/* Hero section with glassmorphism overlay */}
      <HeroOverlay />

      {/* Feature cards with 3D tilt */}
      <FeatureCards />

      {/* How it works section */}
      <HowItWorks />
    </div>
  );
}
