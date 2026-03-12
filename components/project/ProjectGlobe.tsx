"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// Language → color mapping
const LANG_COLORS: Record<string, string> = {
  py: "#3572A5",
  js: "#f1e05a",
  ts: "#3178c6",
  tsx: "#3178c6",
  jsx: "#f1e05a",
  go: "#00ADD8",
  java: "#b07219",
  rs: "#dea584",
  rb: "#701516",
  php: "#4F5D95",
  cs: "#178600",
  css: "#563d7c",
  html: "#e34c26",
  json: "#999999",
  md: "#555555",
};

function getColor(ext: string): string {
  return LANG_COLORS[ext.replace(".", "")] || "#6366f1";
}

interface FileNode {
  path: string;
  ext: string;
  size: number;
}

function GlobePoints({ files }: { files: FileNode[] }) {
  const groupRef = useRef<THREE.Group>(null);

  const points = useMemo(() => {
    const positions = new Float32Array(files.length * 3);
    const colors = new Float32Array(files.length * 3);
    const radius = 2.5;

    files.forEach((file, i) => {
      // Distribute points on sphere using fibonacci spiral
      const phi = Math.acos(1 - (2 * (i + 0.5)) / files.length);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const color = new THREE.Color(getColor(file.ext));
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    });

    return { positions, colors };
  }, [files]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Globe wireframe */}
      <mesh>
        <sphereGeometry args={[2.5, 24, 24]} />
        <meshBasicMaterial
          color="#6366f1"
          wireframe
          transparent
          opacity={0.06}
        />
      </mesh>

      {/* File points */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[points.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[points.colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

interface ProjectGlobeProps {
  files: FileNode[];
}

export function ProjectGlobe({ files }: ProjectGlobeProps) {
  return (
    <div className="h-[300px] w-full">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={0.5} color="#818cf8" />
        <GlobePoints files={files} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
