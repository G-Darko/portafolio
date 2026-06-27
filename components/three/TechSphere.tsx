"use client";

import { useRef, useMemo, useState, useImperativeHandle, useEffect, forwardRef, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
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
] as const;

interface RotationState {
  y: number;
  x: number;
}

interface TechNodesProps {
  mode: "idle" | "active";
  highlightIds: string[];
  dimAll: boolean;
  externalFocusId: string | null;
  expanded: boolean;
  isDragging: boolean;
  hoveredTechId: string | null;
  rotationRef: MutableRefObject<RotationState>;
  onHoverTech: (id: string | null) => void;
  onOrbPointerDown: (e: React.PointerEvent) => void;
}

function getTechVisual(
  techId: string,
  highlightIds: string[],
  dimAll: boolean,
  externalFocusId: string | null,
  hoveredTechId: string | null
) {
  const missionMode = highlightIds.length > 0;
  const missionLit = missionMode && highlightIds.includes(techId);
  const skillLit = dimAll && externalFocusId === techId;
  const orbLit = hoveredTechId === techId;

  if (missionMode) {
    if (missionLit) {
      return { opacity: 0.95, scale: 1.35, glow: true, showLabel: orbLit };
    }
    return { opacity: 0.1, scale: 0.88, glow: false, showLabel: false };
  }

  if (dimAll) {
    if (skillLit || orbLit) {
      return { opacity: 1, scale: 1.42, glow: true, showLabel: true };
    }
    return { opacity: 0.07, scale: 0.82, glow: false, showLabel: false };
  }

  if (orbLit) {
    return { opacity: 1, scale: 1.28, glow: true, showLabel: true };
  }

  return { opacity: 0.52, scale: 1, glow: false, showLabel: false };
}

function TechNodes({
  mode,
  highlightIds,
  dimAll,
  externalFocusId,
  expanded,
  isDragging,
  hoveredTechId,
  rotationRef,
  onHoverTech,
  onOrbPointerDown,
}: TechNodesProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const timerRef = useRef(new THREE.Timer());
  const missionMode = highlightIds.length > 0;
  const anyLit = missionMode || dimAll || hoveredTechId !== null || externalFocusId !== null;

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

  const isPaused = expanded || hoveredTechId !== null || externalFocusId !== null || isDragging;
  const rotSpeed = isPaused ? 0 : mode === "idle" && !anyLit ? 0.01 : 0.016;

  useFrame(() => {
    timerRef.current.update();
    const elapsed = timerRef.current.getElapsed();

    if (groupRef.current) {
      if (!isPaused) {
        rotationRef.current.y += rotSpeed;
        rotationRef.current.x = Math.sin(elapsed * 0.45) * 0.22;
      }

      groupRef.current.rotation.y = rotationRef.current.y;
      groupRef.current.rotation.x = rotationRef.current.x;
    }

    if (coreRef.current) {
      const base = anyLit ? 0.58 : mode === "idle" ? 0.38 : 0.52;
      const pulse = base + (mode === "idle" || anyLit ? Math.sin(elapsed * 2) * 0.12 : 0);
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
        <meshBasicMaterial
          color="#66ccff"
          transparent
          opacity={dimAll ? 0.025 : anyLit ? 0.06 : 0.04}
          wireframe
        />
      </mesh>

      {TECHS.map((tech, i) => {
        const pos = positions[i];
        const visual = getTechVisual(
          tech.id,
          highlightIds,
          dimAll,
          externalFocusId,
          hoveredTechId
        );

        return (
          <group key={tech.id} position={pos} scale={visual.scale}>
            <mesh>
              <sphereGeometry args={[0.12, 12, 12]} />
              <meshBasicMaterial color={tech.color} transparent opacity={visual.opacity * 0.65} />
            </mesh>
            <Html center distanceFactor={8} zIndexRange={[80, 0]}>
              <div
                className="pointer-events-auto relative z-80 flex select-none flex-col items-center"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  onOrbPointerDown(e);
                }}
                onPointerEnter={(e) => {
                  e.stopPropagation();
                  onHoverTech(tech.id);
                }}
                onPointerLeave={(e) => {
                  e.stopPropagation();
                  onHoverTech(null);
                }}
              >
                {visual.showLabel && (
                  <span
                    className="mb-1 whitespace-nowrap rounded border border-hud-border/70 bg-hud-bg/95 px-2 py-0.5 font-mono text-[10px] font-bold tracking-wide text-hud-cyan shadow-[0_0_12px_color-mix(in_oklch,var(--hud-cyan)_35%,transparent)] select-none md:text-xs"
                    style={{ color: tech.color }}
                  >
                    {tech.name}
                  </span>
                )}
                <div
                  className="flex items-center justify-center rounded-full border backdrop-blur-sm"
                  style={{
                    width: visual.glow ? "32px" : "28px",
                    height: visual.glow ? "32px" : "28px",
                    borderColor: tech.color,
                    backgroundColor: `${tech.color}${visual.glow ? "55" : "22"}`,
                    color: tech.color,
                    boxShadow: visual.glow ? `0 0 ${dimAll ? 22 : 16}px ${tech.color}` : "none",
                    opacity: visual.opacity,
                  }}
                >
                  <svg width="16" height="16" style={{ color: "inherit", fill: "currentColor" }}>
                    <use href={`#${tech.id}`} />
                  </svg>
                </div>
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
  dimAll?: boolean;
  externalFocusId?: string | null;
  expanded?: boolean;
  isDragging?: boolean;
  onTechHoverActive?: (active: boolean) => void;
  onOrbPointerDown?: (e: React.PointerEvent) => void;
  onRotateReady?: (api: TechSphereHandle) => void;
}

export type TechSphereHandle = {
  rotateBy: (dx: number, dy: number) => void;
};

const TechSphere = forwardRef<TechSphereHandle, TechSphereProps>(function TechSphere(
  {
    mode = "idle",
    highlightIds = [],
    dimAll = false,
    externalFocusId = null,
    expanded = false,
    isDragging = false,
    onTechHoverActive,
    onOrbPointerDown,
    onRotateReady,
  },
  ref
) {
  const [hoveredTechId, setHoveredTechId] = useState<string | null>(null);
  const rotationRef = useRef<RotationState>({ y: 0, x: 0 });
  const missionMode = highlightIds.length > 0;
  const anyLit = missionMode || dimAll || hoveredTechId !== null || externalFocusId !== null;

  const rotateBy = (dx: number, dy: number) => {
    rotationRef.current.y += dx * 0.012;
    rotationRef.current.x = THREE.MathUtils.clamp(
      rotationRef.current.x + dy * 0.012,
      -Math.PI / 2,
      Math.PI / 2
    );
  };

  useImperativeHandle(ref, () => ({ rotateBy }));

  useEffect(() => {
    onRotateReady?.({ rotateBy });
  }, [onRotateReady]);

  const handleHoverTech = (id: string | null) => {
    setHoveredTechId(id);
    onTechHoverActive?.(id !== null);
  };

  const handleOrbPointerDown = (e: React.PointerEvent) => {
    onOrbPointerDown?.(e);
  };

  return (
    <div className="relative h-full w-full">
      <Canvas className="pointer-events-none" camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={mode === "idle" && !anyLit ? 0.5 : 0.35} />
        <pointLight position={[10, 10, 10]} intensity={anyLit ? 1.5 : mode === "idle" ? 1.2 : 0.9} />
        <pointLight position={[-5, -5, 5]} color="#0df8f9" intensity={anyLit ? 1 : 0.5} />
        <TechNodes
          mode={mode}
          highlightIds={highlightIds}
          dimAll={dimAll}
          externalFocusId={externalFocusId}
          expanded={expanded}
          isDragging={isDragging}
          hoveredTechId={hoveredTechId}
          rotationRef={rotationRef}
          onHoverTech={handleHoverTech}
          onOrbPointerDown={handleOrbPointerDown}
        />
      </Canvas>
    </div>
  );
});

export default TechSphere;
