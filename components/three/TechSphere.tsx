"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";

const TECHS = [
  { name: "Next.js", color: "#888" },
  { name: "React", color: "#61DAFB" },
  { name: "Vue.js", color: "#4FC08D" },
  { name: "Astro", color: "#BC52EE" },
  { name: "Laravel", color: "#FF2D20" },
  { name: "Tailwind", color: "#06B6D4" },
  { name: "TypeScript", color: "#3178C6" },
  { name: "JavaScript", color: "#F7DF1E" },
  { name: "PHP", color: "#777BB4" },
  { name: "Python", color: "#3776AB" },
  { name: "PostgreSQL", color: "#336791" },
  { name: "MySQL", color: "#4479A1" },
  { name: "Linux", color: "#FCC624" },
  { name: "Docker", color: "#2496ED" },
  { name: "Git", color: "#F05032" },
  { name: "Vite", color: "#646CFF" },
  { name: "HTML5", color: "#E34F26" },
  { name: "CSS", color: "#1572B6" },
  { name: "Sass", color: "#CC6699" },
];

function TechNodes() {
  const groupRef = useRef<THREE.Group>(null);

  const positions = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const count = TECHS.length;
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = phi * i;
      pts.push(new THREE.Vector3(Math.cos(theta) * radius * 2, y * 2, Math.sin(theta) * radius * 2));
    }
    return pts;
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
      groupRef.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshBasicMaterial color="#0df8f9" transparent opacity={0.3} />
      </mesh>
      <mesh>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="#66ccff" transparent opacity={0.03} wireframe />
      </mesh>

      {TECHS.map((tech, i) => {
        const pos = positions[i];
        return (
          <group key={tech.name} position={pos}>
            <mesh>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshBasicMaterial color={tech.color} transparent opacity={0.6} />
            </mesh>
            <Html center distanceFactor={8}>
              <div
                className="rounded border px-1.5 py-0.5 text-[8px] font-bold whitespace-nowrap backdrop-blur-sm pointer-events-none"
                style={{
                  borderColor: tech.color,
                  background: `${tech.color}20`,
                  color: tech.color,
                  textShadow: `0 0 8px ${tech.color}80`,
                }}
              >
                {tech.name}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

export default function TechSphere() {
  return (
    <div className="h-64 w-full md:h-80">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <TechNodes />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
