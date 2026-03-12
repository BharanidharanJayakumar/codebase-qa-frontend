"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { FloatingCode } from "./FloatingCode";
import { ParticleField } from "./ParticleField";
import * as THREE from "three";

/**
 * Mouse-reactive scene wrapper — entire scene tilts slightly with soft inertia
 * following the cursor. Implements physics-like damping (tip #2: micro-interactions).
 */
function MouseReactiveGroup({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });

  const { pointer } = useThree();

  useFrame(() => {
    if (!groupRef.current) return;
    // Target rotation based on mouse position (soft parallax)
    target.current.x = pointer.y * 0.15;
    target.current.y = pointer.x * 0.15;

    // Damped follow (inertia / physics feel)
    groupRef.current.rotation.x += (target.current.x - groupRef.current.rotation.x) * 0.03;
    groupRef.current.rotation.y += (target.current.y - groupRef.current.rotation.y) * 0.03;
  });

  return <group ref={groupRef}>{children}</group>;
}

/**
 * Scroll-reactive parallax — moves the scene based on scroll position.
 * Not a linear slide-by-slide, but a depth shift that makes sections feel alive.
 */
function ScrollParallax({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
    // Gentle upward drift as user scrolls
    groupRef.current.position.y = scrollY * 0.002;
    groupRef.current.position.z = scrollY * -0.001;
  });

  return <group ref={groupRef}>{children}</group>;
}

export function Scene3D() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={0.6} />
          <pointLight position={[-10, -5, -10]} intensity={0.3} color="#6366f1" />

          <ScrollParallax>
            <MouseReactiveGroup>
              <Stars
                radius={50}
                depth={80}
                count={2500}
                factor={4}
                saturation={0.5}
                fade
                speed={0.5}
              />

              {/* Floating code blocks — scattered in 3D space as interactive zones */}
              <FloatingCode position={[-3.5, 1.5, -2]} rotation={[0.2, 0.3, 0.1]} scale={0.8} />
              <FloatingCode position={[3.8, -1.2, -3]} rotation={[-0.1, -0.4, 0.2]} scale={0.6} />
              <FloatingCode position={[-2, -2, -1.5]} rotation={[0.3, 0.1, -0.2]} scale={0.5} />
              <FloatingCode position={[2.5, 2.5, -4]} rotation={[-0.2, 0.5, 0]} scale={0.7} />
              <FloatingCode position={[0.5, -3, -5]} rotation={[0.1, 0.2, -0.1]} scale={0.4} />
              <FloatingCode position={[-4, 0, -6]} rotation={[-0.3, 0.1, 0.2]} scale={0.5} />

              <ParticleField count={200} />
            </MouseReactiveGroup>
          </ScrollParallax>
        </Suspense>
      </Canvas>
    </div>
  );
}
