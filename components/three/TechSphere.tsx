"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const TECHS = [
  { id: "html", name: "HTML5", color: "#E34F26" },
  { id: "css", name: "CSS3", color: "#1572B6" },
  { id: "js", name: "JavaScript", color: "#F7DF1E" },
  { id: "ts", name: "TypeScript", color: "#3178C6" },
  { id: "php", name: "PHP", color: "#777BB4" },
  { id: "py", name: "Python", color: "#3776AB" },
  { id: "java", name: "Java", color: "#007396" },
  { id: "node", name: "Node.js", color: "#339933" },
  { id: "react", name: "React", color: "#61DAFB" },
  { id: "nextjs", name: "Next.js", color: "#cccccc" },
  { id: "vue", name: "Vue.js", color: "#4FC08D" },
  { id: "astro", name: "Astro", color: "#BC52EE" },
  { id: "laravel", name: "Laravel", color: "#FF2D20" },
  { id: "tail", name: "Tailwind", color: "#06B6D4" },
  { id: "jquery", name: "jQuery", color: "#0769AD" },
  { id: "three", name: "Three.js", color: "#88ccff" },
  { id: "mysql", name: "MySQL", color: "#4479A1" },
  { id: "postsql", name: "PostgreSQL", color: "#336791" },
  { id: "mongo", name: "MongoDB", color: "#47A248" },
  { id: "git", name: "Git", color: "#F05032" },
  { id: "github", name: "GitHub", color: "#cccccc" },
  { id: "linux", name: "Linux", color: "#FCC624" },
  { id: "docker", name: "Docker", color: "#2496ED" },
  { id: "vite", name: "Vite", color: "#646CFF" },
  { id: "vercel", name: "Vercel", color: "#dddddd" },
  { id: "heroku", name: "Heroku", color: "#430098" },
  { id: "sass", name: "Sass", color: "#CC6699" },
  { id: "postman", name: "Postman", color: "#FF6C37" },
  { id: "vsc", name: "VS Code", color: "#007ACC" },
];

interface TechNodesProps {
  mode: "idle" | "active";
  highlightIds: string[];
}

function TechNodes({ mode, highlightIds }: TechNodesProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const hasHighlight = highlightIds.length > 0;

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

  const rotSpeed = mode === "idle" && !hasHighlight ? 0.008 : 0.014;
  const rotSpeedX = mode === "idle" && !hasHighlight ? 0.003 : 0.006;

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += rotSpeed;
      groupRef.current.rotation.x += rotSpeedX;
    }
    if (coreRef.current) {
      const base = hasHighlight ? 0.55 : mode === "idle" ? 0.4 : 0.55;
      const pulse = base + (mode === "idle" || hasHighlight ? Math.sin(state.clock.elapsedTime * 2) * 0.12 : 0);
      (coreRef.current.material as THREE.MeshBasicMaterial).opacity = pulse;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshBasicMaterial color="#0df8f9" transparent opacity={0.4} />
      </mesh>
      <mesh>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="#66ccff" transparent opacity={hasHighlight ? 0.06 : 0.04} wireframe />
      </mesh>

      {TECHS.map((tech, i) => {
        const pos = positions[i];
        const highlighted = !hasHighlight || highlightIds.includes(tech.id);
        const scale = highlighted && hasHighlight ? 1.35 : 1;
        const opacity = highlighted ? (hasHighlight ? 0.85 : 0.5) : 0.12;
        return (
          <group key={tech.id} position={pos} scale={scale}>
            <mesh>
              <sphereGeometry args={[0.12, 12, 12]} />
              <meshBasicMaterial color={tech.color} transparent opacity={opacity} />
            </mesh>
            <Html center distanceFactor={8}>
              <div
                className="flex items-center justify-center rounded-full border backdrop-blur-sm transition-opacity"
                style={{
                  width: "28px",
                  height: "28px",
                  borderColor: tech.color,
                  backgroundColor: `${tech.color}${highlighted ? "44" : "11"}`,
                  color: tech.color,
                  boxShadow: highlighted ? `0 0 ${hasHighlight ? 16 : 10}px ${tech.color}88` : "none",
                  opacity: highlighted ? 1 : 0.25,
                }}
              >
                <svg width="16" height="16" style={{ color: "inherit", fill: "currentColor" }}>
                  <use href={`#${tech.id}`} />
                </svg>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

interface TechSphereProps {
  mode?: "idle" | "active";
  highlightIds?: string[];
}

export default function TechSphere({ mode = "idle", highlightIds = [] }: TechSphereProps) {
  const hasHighlight = highlightIds.length > 0;
  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={mode === "idle" && !hasHighlight ? 0.5 : 0.4} />
        <pointLight position={[10, 10, 10]} intensity={hasHighlight ? 1.4 : mode === "idle" ? 1.2 : 0.9} />
        <pointLight position={[-5, -5, 5]} color="#0df8f9" intensity={hasHighlight ? 0.9 : 0.5} />
        <TechNodes mode={mode} highlightIds={highlightIds} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={hasHighlight ? 1.4 : mode === "idle" ? 0.8 : 1.2}
        />
      </Canvas>
    </div>
  );
}
