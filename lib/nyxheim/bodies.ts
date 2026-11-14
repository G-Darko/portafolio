/**
 * Nyxheim system map: every body in the 3D world, derived from the API
 * profile snapshot. No project, skill or certification is invented here:
 * project bodies come from `missions` (via lib/data/missions), the
 * constellation from `buildSkills` (31 skills, no Prisma — it is not in
 * the data), the cert ring from `getCertifications`.
 *
 * CRESER is a moon of Duplica on purpose: the data itself says Duplica
 * ships white-label builds, and CRESER is its tenant (creser.app, same
 * stack, own branding). Gael confirmed both are the same product.
 */
import * as THREE from "three";
import { getSubMissionBySlug, missions, type SubMission } from "@/lib/data/missions";
import { buildSkills } from "@/lib/data/skills";
import { profileSnapshot } from "@/lib/data/snapshot";

export type NyxheimBodyKind =
  | "sun"
  | "station"
  | "planet"
  | "moon"
  | "satellite"
  | "minor"
  | "certs"
  | "cv"
  | "contact"
  | "constellation"
  | "blackhole";

export type PlanetTextureKind =
  | "sun"
  | "duplica"
  | "creser"
  | "notebook"
  | "containers"
  | "aerial"
  | "yiza"
  | "rock"
  | "paper"
  | "metal"
  | "accretion";

export interface NyxheimBody {
  id: string;
  kind: NyxheimBodyKind;
  /** Project bodies: mission + slug in the snapshot. */
  missionId?: string;
  projectSlug?: string;
  /** Special bodies: translation key under `nyxheim` (sun, base...). */
  labelKey?: string;
  color: string;
  /** Mesh radius in world units. */
  size: number;
  /** Orbit radius around the sun (0 = the sun itself). Moons/satellites
      of Duplica use `parentId` and orbit around it instead. */
  orbitRadius: number;
  parentId?: string;
  orbitAngle: number;
  orbitSpeed: number;
  orbitY: number;
  spinSpeed: number;
  texture: PlanetTextureKind;
  ring?: boolean;
  /** In the dock and in the arrow-key cycle. */
  dock: boolean;
}

function projectBody(
  missionId: string,
  slug: string,
  kind: NyxheimBodyKind = "planet",
  partial: Omit<NyxheimBody, "id" | "kind" | "missionId" | "projectSlug">
): NyxheimBody {
  const sub = getSubMissionBySlug(missionId, slug);
  if (!sub) throw new Error(`Nyxheim: project ${missionId}/${slug} not in snapshot`);
  return { id: `project-${slug}`, kind, missionId, projectSlug: slug, ...partial };
}

export const NYXHEIM_BODIES: NyxheimBody[] = [
  {
    id: "sol",
    kind: "sun",
    labelKey: "sun",
    color: "#ffb347",
    size: 3,
    orbitRadius: 0,
    orbitAngle: 0,
    orbitSpeed: 0,
    orbitY: 0,
    spinSpeed: 0.05,
    texture: "sun",
    // The sun is scenery and light: it does nothing on click, it is not a
    // destination, and the profile only opens from Nyxheim (the station).
    dock: false,
  },
  {
    id: "base",
    kind: "station",
    labelKey: "base",
    color: "#67e8f9",
    size: 0.9,
    orbitRadius: 6.5,
    orbitAngle: 0.6,
    orbitSpeed: 0.02,
    orbitY: 0.8,
    spinSpeed: 0.3,
    texture: "metal",
    dock: true,
  },
  projectBody("black-sheep", "black-sync", "satellite", {
    color: "#cbd5e1",
    size: 0.7,
    orbitRadius: 8.5,
    orbitAngle: 2.4,
    orbitSpeed: 0.03,
    orbitY: -0.6,
    spinSpeed: 0.4,
    texture: "metal",
    dock: true,
  }),
  projectBody("black-sheep", "duplica", "planet", {
    color: "#2dd4bf",
    size: 2.3,
    orbitRadius: 11,
    orbitAngle: 4.0,
    orbitSpeed: 0.012,
    orbitY: 0,
    spinSpeed: 0.25,
    texture: "duplica",
    ring: true,
    dock: true,
  }),
  projectBody("black-sheep", "creser", "moon", {
    parentId: "project-duplica",
    color: "#4ade80",
    size: 0.55,
    orbitRadius: 3.6,
    orbitAngle: 1.1,
    orbitSpeed: 0.25,
    orbitY: 0.4,
    spinSpeed: 0.3,
    texture: "creser",
    dock: true,
  }),
  {
    id: "certificaciones",
    kind: "certs",
    color: "#fbbf24",
    size: 0.9,
    orbitRadius: 13.5,
    orbitAngle: 1.2,
    orbitSpeed: 0.016,
    orbitY: 1.2,
    spinSpeed: 0.35,
    texture: "metal",
    dock: true,
  },
  projectBody("black-sheep", "skool", "planet", {
    color: "#f8fafc",
    size: 1.5,
    orbitRadius: 15,
    orbitAngle: 5.2,
    orbitSpeed: 0.014,
    orbitY: -0.8,
    spinSpeed: 0.2,
    texture: "notebook",
    dock: true,
  }),
  projectBody("black-sheep", "krkn", "planet", {
    color: "#f97316",
    size: 1.4,
    orbitRadius: 18.5,
    orbitAngle: 2.9,
    orbitSpeed: 0.011,
    orbitY: 0.6,
    spinSpeed: 0.22,
    texture: "containers",
    dock: true,
  }),
  {
    id: "cv",
    kind: "cv",
    color: "#e2e8f0",
    size: 1.0,
    orbitRadius: 20,
    orbitAngle: 0.2,
    orbitSpeed: 0.013,
    orbitY: -1.0,
    spinSpeed: 0.25,
    texture: "paper",
    dock: true,
  },
  projectBody("academia", "aerial-depot", "minor", {
    color: "#f59e0b",
    size: 1.1,
    orbitRadius: 21.5,
    orbitAngle: 3.6,
    orbitSpeed: 0.01,
    orbitY: 0.4,
    spinSpeed: 0.2,
    texture: "aerial",
    dock: false,
  }),
  projectBody("academia", "yiza", "minor", {
    color: "#84cc16",
    size: 1.0,
    orbitRadius: 23.5,
    orbitAngle: 5.6,
    orbitSpeed: 0.009,
    orbitY: -0.4,
    spinSpeed: 0.2,
    texture: "yiza",
    dock: false,
  }),
  {
    id: "contacto",
    kind: "contact",
    color: "#22d3ee",
    size: 0.8,
    orbitRadius: 24.5,
    orbitAngle: 1.8,
    orbitSpeed: 0.015,
    orbitY: 1.4,
    spinSpeed: 0.3,
    texture: "metal",
    dock: true,
  },
  projectBody("black-sheep", "rnme", "minor", {
    color: "#a78bfa",
    size: 0.8,
    orbitRadius: 26,
    orbitAngle: 4.4,
    orbitSpeed: 0.008,
    orbitY: 0.8,
    spinSpeed: 0.2,
    texture: "rock",
    dock: false,
  }),
  projectBody("black-sheep", "cpmx", "minor", {
    color: "#38bdf8",
    size: 0.7,
    orbitRadius: 27.5,
    orbitAngle: 0.9,
    orbitSpeed: 0.008,
    orbitY: -1.2,
    spinSpeed: 0.2,
    texture: "rock",
    dock: false,
  }),
  projectBody("freelance", "leamsi", "minor", {
    color: "#f472b6",
    size: 0.7,
    orbitRadius: 29,
    orbitAngle: 3.1,
    orbitSpeed: 0.007,
    orbitY: 1.0,
    spinSpeed: 0.2,
    texture: "rock",
    dock: false,
  }),
  projectBody("academia", "tienko", "minor", {
    color: "#fb923c",
    size: 0.65,
    orbitRadius: 30.5,
    orbitAngle: 5.9,
    orbitSpeed: 0.007,
    orbitY: -0.8,
    spinSpeed: 0.2,
    texture: "rock",
    dock: false,
  }),
  projectBody("academia", "postgrados", "minor", {
    color: "#94a3b8",
    size: 0.65,
    orbitRadius: 32,
    orbitAngle: 2.2,
    orbitSpeed: 0.006,
    orbitY: 0.6,
    spinSpeed: 0.2,
    texture: "rock",
    dock: false,
  }),
  {
    id: "sinistra",
    kind: "constellation",
    color: "#e0f2fe",
    size: 0.5,
    orbitRadius: 0,
    orbitAngle: 0,
    orbitSpeed: 0,
    orbitY: 0,
    spinSpeed: 0,
    texture: "rock",
    dock: true,
  },
  {
    id: "erebo",
    kind: "blackhole",
    labelKey: "erebo",
    color: "#fb923c",
    size: 2.2,
    orbitRadius: 36,
    orbitAngle: 0.9,
    orbitSpeed: 0.004,
    orbitY: 1.0,
    spinSpeed: 0.05,
    texture: "accretion",
    dock: true,
  },
];

/** Dock order + arrow-key cycle (only dock bodies). */
export const DOCK_BODIES: NyxheimBody[] = NYXHEIM_BODIES.filter((b) => b.dock);

/** All project bodies, orbital order (prev/next inside project panels). */
export const PROJECT_BODIES: NyxheimBody[] = NYXHEIM_BODIES.filter(
  (b) => b.projectSlug
).sort((a, b) => a.orbitRadius - b.orbitRadius);

/** Constellation: one star per skill in the snapshot (31, no Prisma).
    Sinistra: the stars share the system with the planets (inclined orbits
    around the sun, connected by lines), they are not a separate layer. */
export const CONSTELLATION_STARS = buildSkills.map((skill) => ({
  id: skill.id,
  name: skill.name,
  color: skill.color ?? "#e0f2fe",
  icon: skill.icon,
  sprite: skill.sprite,
  uiIcon: skill.uiIcon,
  category: skill.category,
}));

/** Fallback camera target for Sinistra when no star position is live yet. */
export const SINISTRA_CENTER: [number, number, number] = [0, 7, -18];

/** Live world positions of the Sinistra stars (one per skill, same order
    as CONSTELLATION_STARS), written every frame by the constellation and
    read by the camera rig (focus centroid) and the connection lines. */
export const liveStarPositions: THREE.Vector3[] = CONSTELLATION_STARS.map(
  () => new THREE.Vector3(0, 7, -18)
);

/** Total missions / projects, for the overview panel. */
export const NYXHEIM_STATS = {
  missions: missions.length,
  projects: missions.reduce((acc, m) => acc + m.subMissions.length, 0),
  skills: buildSkills.length,
  certifications: profileSnapshot.certifications.length,
};

export function getNyxheimBody(id: string): NyxheimBody | undefined {
  return NYXHEIM_BODIES.find((b) => b.id === id);
}

export function getProjectBodyBySlug(slug: string): NyxheimBody | undefined {
  return NYXHEIM_BODIES.find((b) => b.projectSlug === slug);
}

export function getBodyProject(body: NyxheimBody): SubMission | undefined {
  if (!body.missionId || !body.projectSlug) return undefined;
  return getSubMissionBySlug(body.missionId, body.projectSlug);
}

/** Other projects of the same mission, for "also in this orbit". */
export function getSiblingProjects(body: NyxheimBody): SubMission[] {
  if (!body.missionId) return [];
  const mission = missions.find((m) => m.id === body.missionId);
  if (!mission) return [];
  return mission.subMissions.filter((s) => s.id !== getBodyProject(body)?.id);
}

/**
 * Live world positions, written every frame by the meshes and read by the
 * camera rig. Module-level mutable refs on purpose: the rig needs the
 * current position of a moving body without re-rendering React.
 */
export const liveBodyPositions = new Map<string, THREE.Vector3>();
/** Mesh root per body, for click raycasting. */
export const liveBodyObjects = new Map<string, THREE.Object3D>();

export function readBodyPosition(id: string, out: THREE.Vector3): boolean {
  const pos = liveBodyPositions.get(id);
  if (!pos) return false;
  out.copy(pos);
  return true;
}
