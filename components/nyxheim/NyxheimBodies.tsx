"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { getSubMissionCopy } from "@/lib/i18n/missionContent";
import {
  CONSTELLATION_STARS,
  NYXHEIM_BODIES,
  getBodyProject,
  getNyxheimBody,
  liveBodyObjects,
  liveBodyPositions,
  liveStarPositions,
  type NyxheimBody,
} from "@/lib/nyxheim/bodies";
import { getPlanetTexture } from "@/lib/nyxheim/textures";
import { useNyxheimStore } from "@/lib/nyxheim/useNyxheimStore";

/** Display name of a body in the current locale. */
export function useBodyName(body: NyxheimBody): string {
  const { t, locale } = useTranslation();
  if (body.projectSlug && body.missionId) {
    const project = getBodyProject(body);
    if (project) return getSubMissionCopy(locale, project).title;
  }
  if (body.kind === "certs") return t.header.certifications;
  if (body.kind === "cv") return "CV";
  if (body.kind === "contact") return t.header.contact;
  if (body.kind === "constellation") return t.nyxheim.sinistra;
  if (body.labelKey === "sun") return t.nyxheim.sun;
  if (body.labelKey === "base") return t.nyxheim.base;
  return body.id;
}

function BodyLabel({ body }: { body: NyxheimBody }) {
  const name = useBodyName(body);
  const focus = useNyxheimStore((s) => s.focus);
  const setHovered = useNyxheimStore((s) => s.setHovered);
  const focusedId = useNyxheimStore((s) => s.focusedId);
  const focused = focusedId === body.id;
  return (
    <Html center distanceFactor={14} zIndexRange={[60, 0]}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          focus(body.id);
        }}
        onPointerEnter={() => setHovered(body.id)}
        onPointerLeave={() => setHovered(null)}
        aria-label={name}
        className={`pointer-events-auto flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-xs font-bold whitespace-nowrap backdrop-blur-md transition-colors hud-focus-ring ${
          focused
            ? "border-hud-cyan bg-hud-cyan/25 text-foreground"
            : "border-hud-border/70 bg-hud-bg/85 text-foreground hover:border-hud-cyan/60"
        }`}
        style={{ boxShadow: focused ? "0 0 16px oklch(0.65 0.18 255 / 0.35)" : undefined }}
      >
        <span
          aria-hidden
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: body.color, boxShadow: `0 0 8px ${body.color}` }}
        />
        {name}
      </button>
    </Html>
  );
}

/** CRESER, child of Duplica: its own orbit around the planet. */
function MoonBody({ body, reduced }: { body: NyxheimBody; reduced: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const angleRef = useRef(body.orbitAngle);
  const texture = useMemo(() => getPlanetTexture(body.texture), [body.texture]);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    if (!reduced) angleRef.current += body.orbitSpeed * delta;
    const a = angleRef.current;
    if (groupRef.current) {
      groupRef.current.position.set(
        Math.cos(a) * body.orbitRadius,
        body.orbitY,
        Math.sin(a) * body.orbitRadius
      );
    }
    if (meshRef.current && !reduced) meshRef.current.rotation.y += body.spinSpeed * delta;
    if (groupRef.current) {
      groupRef.current.getWorldPosition(tmp);
      const pos = liveBodyPositions.get(body.id) ?? new THREE.Vector3();
      pos.copy(tmp);
      liveBodyPositions.set(body.id, pos);
    }
  });

  useEffect(() => {
    if (groupRef.current) liveBodyObjects.set(body.id, groupRef.current);
    return () => {
      liveBodyObjects.delete(body.id);
    };
  }, [body.id]);

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[body.size, 32, 32]} />
        <meshStandardMaterial map={texture} roughness={0.9} metalness={0.05} />
      </mesh>
      <BodyLabel body={body} />
    </group>
  );
}

/** The 7 certifications as small dots orbiting the cert hub. */
function CertDots({ reduced }: { reduced: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const angleRef = useRef(0);
  const dots = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        angle: (i / 7) * Math.PI * 2,
        y: (i % 2 === 0 ? 0.5 : -0.5) * (0.3 + (i % 3) * 0.2),
      })),
    []
  );
  useFrame((_, delta) => {
    if (!reduced && groupRef.current) {
      angleRef.current += delta * 0.4;
      groupRef.current.rotation.y = angleRef.current;
    }
  });
  return (
    <group ref={groupRef}>
      {dots.map((d, i) => (
        <mesh
          key={i}
          position={[Math.cos(d.angle) * 2.1, d.y, Math.sin(d.angle) * 2.1]}
        >
          <sphereGeometry args={[0.14, 12, 12]} />
          <meshBasicMaterial color="#fbbf24" />
        </mesh>
      ))}
    </group>
  );
}

function BodyMesh({ body, reduced }: { body: NyxheimBody; reduced: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const spinRef = useRef<THREE.Group>(null);
  const angleRef = useRef(body.orbitAngle);
  const texture = useMemo(() => getPlanetTexture(body.texture), [body.texture]);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const moonBody = body.id === "project-duplica" ? getNyxheimBody("project-creser") : undefined;

  useFrame((_, delta) => {
    if (body.kind === "sun") {
      // The sun sits at the origin; still publish it for the camera rig.
      const pos = liveBodyPositions.get(body.id) ?? new THREE.Vector3();
      pos.set(0, 0, 0);
      liveBodyPositions.set(body.id, pos);
      return;
    }
    if (!reduced) angleRef.current += body.orbitSpeed * delta;
    const a = angleRef.current;
    if (groupRef.current) {
      groupRef.current.position.set(
        Math.cos(a) * body.orbitRadius,
        body.orbitY,
        Math.sin(a) * body.orbitRadius
      );
    }
    if (spinRef.current && !reduced) spinRef.current.rotation.y += body.spinSpeed * delta;
    if (groupRef.current) {
      groupRef.current.getWorldPosition(tmp);
      const pos = liveBodyPositions.get(body.id) ?? new THREE.Vector3();
      pos.copy(tmp);
      liveBodyPositions.set(body.id, pos);
    }
  });

  useEffect(() => {
    if (groupRef.current) liveBodyObjects.set(body.id, groupRef.current);
    return () => {
      liveBodyObjects.delete(body.id);
    };
  }, [body.id]);

  const isSun = body.kind === "sun";

  return (
    <group ref={groupRef} position={isSun ? [0, 0, 0] : undefined}>
      <group ref={spinRef}>
        {isSun ? (
          <>
            <mesh>
              <sphereGeometry args={[body.size, 48, 48]} />
              <meshBasicMaterial map={texture} />
            </mesh>
            {/* Corona: two additive shells around the sun. */}
            <mesh>
              <sphereGeometry args={[body.size * 1.25, 32, 32]} />
              <meshBasicMaterial
                color="#ffb347"
                transparent
                opacity={0.18}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
            <mesh>
              <sphereGeometry args={[body.size * 1.6, 32, 32]} />
              <meshBasicMaterial
                color="#ff8c00"
                transparent
                opacity={0.08}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
            <pointLight intensity={2.2} decay={0} color="#ffd9a0" />
          </>
        ) : body.kind === "station" ? (
          <>
            <mesh rotation-x={Math.PI / 2}>
              <torusGeometry args={[body.size, 0.14, 12, 48]} />
              <meshStandardMaterial color={body.color} roughness={0.4} metalness={0.7} />
            </mesh>
            <mesh>
              <cylinderGeometry args={[body.size * 0.45, body.size * 0.45, 0.5, 24]} />
              <meshStandardMaterial color="#94a3b8" roughness={0.35} metalness={0.8} />
            </mesh>
            <mesh>
              <sphereGeometry args={[body.size * 0.22, 16, 16]} />
              <meshBasicMaterial color={body.color} />
            </mesh>
          </>
        ) : body.kind === "satellite" ? (
          <>
            <mesh>
              <octahedronGeometry args={[body.size * 0.7]} />
              <meshStandardMaterial color="#cbd5e1" roughness={0.3} metalness={0.85} />
            </mesh>
            <mesh position={[body.size * 1.3, 0, 0]}>
              <boxGeometry args={[body.size * 1.1, 0.06, body.size * 0.7]} />
              <meshStandardMaterial color="#1d4ed8" roughness={0.4} metalness={0.4} />
            </mesh>
            <mesh position={[-body.size * 1.3, 0, 0]}>
              <boxGeometry args={[body.size * 1.1, 0.06, body.size * 0.7]} />
              <meshStandardMaterial color="#1d4ed8" roughness={0.4} metalness={0.4} />
            </mesh>
            <mesh position={[0, body.size * 0.9, 0]}>
              <cylinderGeometry args={[0.03, 0.03, body.size * 0.9, 8]} />
              <meshStandardMaterial color="#e2e8f0" roughness={0.4} metalness={0.7} />
            </mesh>
            <mesh position={[0, body.size * 1.4, 0]}>
              <sphereGeometry args={[0.09, 12, 12]} />
              <meshBasicMaterial color="#f87171" />
            </mesh>
          </>
        ) : body.kind === "cv" ? (
          <>
            <mesh>
              <cylinderGeometry args={[body.size, body.size, 0.18, 40]} />
              <meshStandardMaterial map={texture} roughness={0.9} metalness={0} />
            </mesh>
            <mesh position={[0, 0.14, 0]} rotation-y={0.4}>
              <boxGeometry args={[body.size * 1.1, 0.06, body.size * 0.8]} />
              <meshStandardMaterial color="#ffffff" roughness={0.95} metalness={0} />
            </mesh>
          </>
        ) : body.kind === "contact" ? (
          <>
            <mesh>
              <sphereGeometry args={[body.size, 32, 32]} />
              <meshStandardMaterial
                color={body.color}
                emissive={body.color}
                emissiveIntensity={0.55}
                roughness={0.4}
                metalness={0.1}
              />
            </mesh>
            <mesh rotation-x={Math.PI / 2.5}>
              <torusGeometry args={[body.size * 1.9, 0.04, 8, 64]} />
              <meshBasicMaterial color={body.color} transparent opacity={0.5} />
            </mesh>
          </>
        ) : (
          <>
            <mesh>
              <sphereGeometry args={[body.size, 48, 48]} />
              <meshStandardMaterial map={texture} roughness={0.9} metalness={0.05} />
            </mesh>
            {body.ring && (
              <mesh rotation-x={Math.PI / 2.3}>
                <ringGeometry args={[body.size * 1.35, body.size * 2.1, 64]} />
                <meshBasicMaterial
                  color="#5eead4"
                  transparent
                  opacity={0.45}
                  side={THREE.DoubleSide}
                />
              </mesh>
            )}
            {body.kind === "certs" && <CertDots reduced={reduced} />}
          </>
        )}
      </group>
      {moonBody && <MoonBody body={moonBody} reduced={reduced} />}
      <BodyLabel body={body} />
    </group>
  );
}

/**
 * Sinistra: one star per skill, but integrated into the system — every star
 * orbits the sun on the same inclined band the planets share, and stars of
 * the same category are joined by lines. The band weaves through the
 * planetary orbits instead of floating off in its own layer.
 */
const SINISTRA_TILT = 0.42;

/** Position on the tilted Sinistra band for a given orbit angle. */
function sinistraPosition(
  angle: number,
  radius: number,
  yBase: number,
  out: THREE.Vector3
): THREE.Vector3 {
  out.set(
    Math.cos(angle) * radius,
    Math.sin(angle) * radius * Math.sin(SINISTRA_TILT) + yBase,
    Math.sin(angle) * radius * Math.cos(SINISTRA_TILT)
  );
  return out;
}

function Constellation({ reduced }: { reduced: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const focus = useNyxheimStore((s) => s.focus);
  const setHoveredSkill = useNyxheimStore((s) => s.setHoveredSkill);
  const hoveredSkillId = useNyxheimStore((s) => s.hoveredSkillId);
  const focusedId = useNyxheimStore((s) => s.focusedId);
  const isFocused = focusedId === "sinistra";
  const tmp = useMemo(() => new THREE.Vector3(), []);

  // Deterministic orbit per star (stable layout, no random jumps).
  const orbits = useMemo(
    () =>
      CONSTELLATION_STARS.map((_, i) => ({
        radius: 13 + ((i * 7) % 17),
        angle: (i / Math.max(1, CONSTELLATION_STARS.length - 1)) * Math.PI * 2 + (i % 5) * 0.35,
        speed: 0.004 + ((i * 3) % 7) * 0.0012,
        yBase: Math.sin(i * 1.7) * 1.6,
      })),
    []
  );
  const anglesRef = useRef(orbits.map((o) => o.angle));

  useFrame(({ clock }, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const t = clock.getElapsedTime();
    group.children.forEach((child, i) => {
      const orbit = orbits[i];
      if (!orbit) return;
      if (!reduced) anglesRef.current[i] += orbit.speed * delta;
      sinistraPosition(anglesRef.current[i], orbit.radius, orbit.yBase, tmp);
      child.position.copy(tmp);
      liveStarPositions[i]?.copy(tmp);
      if (!reduced) {
        const mesh = child.children[0] as THREE.Mesh | undefined;
        if (mesh) {
          const mat = mesh.material as THREE.MeshBasicMaterial;
          mat.opacity = 0.65 + Math.sin(t * 1.6 + i * 0.9) * 0.3;
        }
      }
    });
  });

  return (
    <group ref={groupRef}>
      {CONSTELLATION_STARS.map((star, i) => {
        const showLabel = isFocused || hoveredSkillId === star.id;
        const initial = sinistraPosition(
          orbits[i].angle,
          orbits[i].radius,
          orbits[i].yBase,
          new THREE.Vector3()
        );
        return (
          <group key={star.id} position={[initial.x, initial.y, initial.z]}>
            <mesh
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredSkill(star.id);
              }}
              onPointerOut={() => setHoveredSkill(null)}
              onClick={(e) => {
                e.stopPropagation();
                setHoveredSkill(star.id);
                focus("sinistra");
              }}
            >
              <sphereGeometry args={[hoveredSkillId === star.id ? 0.22 : 0.13, 12, 12]} />
              <meshBasicMaterial color={star.color} transparent opacity={0.9} />
            </mesh>
            {showLabel && (
              <Html center distanceFactor={12} zIndexRange={[55, 0]}>
                <span className="pointer-events-none rounded-full border border-hud-border/70 bg-hud-bg/90 px-2 py-0.5 font-mono text-xs font-bold whitespace-nowrap text-foreground backdrop-blur-md">
                  {star.name}
                </span>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}

/** Lines joining same-category stars of Sinistra, redrawn every frame from
    their live positions so the web moves with the orbits. */
function SinistraLines() {
  const geomRef = useRef<THREE.BufferGeometry>(null);
  const segments = useMemo(() => {
    const pairs: [number, number][] = [];
    const byCategory = new Map<string, number[]>();
    CONSTELLATION_STARS.forEach((s, i) => {
      const list = byCategory.get(s.category) ?? [];
      list.push(i);
      byCategory.set(s.category, list);
    });
    for (const list of byCategory.values()) {
      for (let k = 0; k < list.length - 1; k++) pairs.push([list[k], list[k + 1]]);
    }
    return pairs;
  }, []);
  const positions = useMemo(() => new Float32Array(segments.length * 2 * 3), [segments]);

  useFrame(() => {
    segments.forEach(([a, b], s) => {
      const pa = liveStarPositions[a];
      const pb = liveStarPositions[b];
      if (!pa || !pb) return;
      positions[s * 6] = pa.x;
      positions[s * 6 + 1] = pa.y;
      positions[s * 6 + 2] = pa.z;
      positions[s * 6 + 3] = pb.x;
      positions[s * 6 + 4] = pb.y;
      positions[s * 6 + 5] = pb.z;
    });
    const attr = geomRef.current?.attributes.position as THREE.BufferAttribute | undefined;
    if (attr) attr.needsUpdate = true;
  });

  return (
    <lineSegments frustumCulled={false}>
      <bufferGeometry ref={geomRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color="#67e8f9" transparent opacity={0.3} />
    </lineSegments>
  );
}

/** The Sinistra label rides the band so the constellation can be found and
    clicked in the scene, like any other body. */
function SinistraLabel({ reduced }: { reduced: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const angleRef = useRef(-0.7);
  const focus = useNyxheimStore((s) => s.focus);
  const setHovered = useNyxheimStore((s) => s.setHovered);
  const { t } = useTranslation();
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    if (!reduced) angleRef.current += delta * 0.008;
    sinistraPosition(angleRef.current, 22, 1.4, tmp);
    groupRef.current?.position.copy(tmp);
  });

  return (
    <group ref={groupRef}>
      <Html center distanceFactor={14} zIndexRange={[60, 0]}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            focus("sinistra");
          }}
          onPointerEnter={() => setHovered("sinistra")}
          onPointerLeave={() => setHovered(null)}
          aria-label={t.nyxheim.sinistra}
          className="pointer-events-auto flex shrink-0 items-center gap-1.5 rounded-full border border-hud-border/70 bg-hud-bg/85 px-2.5 py-1 font-mono text-xs font-bold whitespace-nowrap text-foreground backdrop-blur-md transition-colors hud-focus-ring hover:border-hud-cyan/60"
        >
          <span
            aria-hidden
            className="h-2 w-2 shrink-0 rounded-full bg-[#e0f2fe]"
            style={{ boxShadow: "0 0 8px #e0f2fe" }}
          />
          {t.nyxheim.sinistra}
        </button>
      </Html>
    </group>
  );
}

export function NyxheimBodies({ reduced }: { reduced: boolean }) {
  const bodies = NYXHEIM_BODIES.filter(
    (b) => b.kind !== "constellation" && b.id !== "project-creser"
  );
  return (
    <>
      {bodies.map((body) => (
        <BodyMesh key={body.id} body={body} reduced={reduced} />
      ))}
      <Constellation reduced={reduced} />
      <SinistraLines />
      <SinistraLabel reduced={reduced} />
    </>
  );
}
