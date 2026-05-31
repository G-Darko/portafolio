"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Float } from "@react-three/drei";
import * as THREE from "three";

function SpherePoints() {
  const ref = useRef<THREE.Points>(null!);

  const particles = useMemo(() => {
    const positions = new Float32Array(600 * 3);
    for (let i = 0; i < 600; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 1;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }
    return positions;
  }, []);

  const colors = useMemo(() => {
    const c = new Float32Array(600 * 3);
    const color1 = new THREE.Color("#0df8f9");
    const color2 = new THREE.Color("#0D82F9");
    for (let i = 0; i < 600; i++) {
      const col = Math.random() > 0.5 ? color1 : color2;
      c[i * 3] = col.r;
      c[i * 3 + 1] = col.g;
      c[i * 3 + 2] = col.b;
    }
    return c;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.1;
      ref.current.rotation.x += delta * 0.03;
    }
  });

  return (
    <Points ref={ref} positions={particles} colors={colors}>
      <PointMaterial
        transparent
        vertexColors
        size={5}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.8}
      />
    </Points>
  );
}

function Ring() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.z += delta * 0.15;
    }
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[1.6, 0.01, 16, 100]} />
      <meshBasicMaterial color="#0df8f9" transparent opacity={0.15} />
    </mesh>
  );
}

function TechLabels() {
  const techs = [
    "Next.js", "React Native", "Astro", "Vue", "Laravel",
    "Three.js", "Tailwind", "PostgreSQL", "MySQL", "Expo",
  ];

  return (
    <group>
      {techs.map((name, i) => {
        const theta = (i / techs.length) * Math.PI * 2;
        const phi = Math.acos((i / techs.length) * 2 - 1);
        const r = 2;
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);
        return (
          <Float key={name} speed={2} rotationIntensity={0} floatIntensity={0.5}>
            <mesh position={[x, y, z]}>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshBasicMaterial color="#66ccff" />
            </mesh>
          </Float>
        );
      })}
    </group>
  );
}

export default function TechSphere() {
  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <SpherePoints />
        <Ring />
        <TechLabels />
      </Canvas>
    </div>
  );
}
