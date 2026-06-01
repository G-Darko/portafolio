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

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.008;
      groupRef.current.rotation.x += 0.003;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Núcleo */}
      <mesh>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshBasicMaterial color="#0df8f9" transparent opacity={0.4} />
      </mesh>
      {/* Orbe wireframe */}
      <mesh>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="#66ccff" transparent opacity={0.04} wireframe />
      </mesh>

      {TECHS.map((tech, i) => {
        const pos = positions[i];
        return (
          <group key={tech.id} position={pos}>
            {/* Glow punto */}
            <mesh>
              <sphereGeometry args={[0.12, 12, 12]} />
              <meshBasicMaterial color={tech.color} transparent opacity={0.5} />
            </mesh>
            {/* Icono SVG inline */}
            <Html center distanceFactor={8}>
              <div
                className="flex items-center justify-center rounded-full border backdrop-blur-sm"
                style={{
                  width: "28px",
                  height: "28px",
                  borderColor: tech.color,
                  backgroundColor: `${tech.color}22`,
                  color: tech.color,
                  boxShadow: `0 0 10px ${tech.color}55`,
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

export default function TechSphere() {
  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} />
        <TechNodes />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.8} />
      </Canvas>
    </div>
  );
}
