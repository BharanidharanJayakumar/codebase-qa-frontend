"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import type { Mesh } from "three";

interface FloatingCodeProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

export function FloatingCode({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: FloatingCodeProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Random line widths for code-line indicators
  const lineWidths = useMemo(() => [0.6, 0.8, 0.5, 0.7].map((w) => w + Math.random() * 0.2), []);

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += 0.002;
    meshRef.current.rotation.y += 0.003;
  });

  const currentScale = hovered ? scale * 1.12 : scale;

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.8}>
      <group
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        {/* Main block */}
        <mesh
          ref={meshRef}
          position={position}
          rotation={rotation}
          scale={currentScale}
        >
          <boxGeometry args={[1.6, 1, 0.08]} />
          <MeshDistortMaterial
            color={hovered ? "#818cf8" : "#6366f1"}
            transparent
            opacity={hovered ? 0.25 : 0.15}
            distort={hovered ? 0.3 : 0.2}
            speed={2}
            roughness={0.4}
            metalness={0.8}
          />
        </mesh>
        {/* Wireframe glow edge */}
        <mesh position={position} scale={currentScale * 1.02}>
          <boxGeometry args={[1.6, 1, 0.08]} />
          <meshBasicMaterial
            color="#818cf8"
            transparent
            opacity={hovered ? 0.12 : 0.05}
            wireframe
          />
        </mesh>
        {/* Code line indicators */}
        {[0.25, 0.1, -0.05, -0.2].map((y, i) => (
          <mesh
            key={i}
            position={[position[0] - 0.2, position[1] + y * currentScale, position[2] + 0.05]}
            scale={currentScale}
          >
            <planeGeometry args={[lineWidths[i], 0.03]} />
            <meshBasicMaterial
              color={hovered ? "#a5b4fc" : "#6366f1"}
              transparent
              opacity={hovered ? 0.4 : 0.15}
            />
          </mesh>
        ))}
      </group>
    </Float>
  );
}
