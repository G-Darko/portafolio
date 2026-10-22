/** Portfolio missions/projects, read from the API profile snapshot (readme-stats `src/data/missions.ts`). */
import { profileSnapshot } from "./snapshot";
import type { ApiMission, ApiProject } from "./api";

export type MissionId = string;
export type MissionIcon = "Sheep" | "Briefcase" | "GraduationCap";

const MISSION_ICONS: readonly MissionIcon[] = ["Sheep", "Briefcase", "GraduationCap"];

export interface SubMission extends ApiProject {
  /** Display names of the stack ("Next.js"…). */
  techStack: string[];
  /** TechSphere / TechIconsSprite ids of the stack (unknown techs are skipped). */
  spriteIds: string[];
}

export interface Mission extends Omit<ApiMission, "icon" | "projects"> {
  icon: MissionIcon;
  subMissions: SubMission[];
}

function toSubMission(project: ApiProject): SubMission {
  return {
    ...project,
    techStack: project.stack.map((s) => s.title),
    spriteIds: [...new Set(project.stack.flatMap((s) => (s.sprite ? [s.sprite] : [])))],
  };
}

export const missions: Mission[] = profileSnapshot.missions.map(({ projects, icon, ...mission }) => ({
  ...mission,
  icon: MISSION_ICONS.includes(icon as MissionIcon) ? (icon as MissionIcon) : "Briefcase",
  subMissions: projects.map(toSubMission),
}));

export const missionIds: MissionId[] = missions.map((m) => m.id);

export const totalSubmissions = missions.reduce((acc, m) => acc + m.subMissions.length, 0);

export function getMissionById(id: string): Mission | undefined {
  return missions.find((m) => m.id === id);
}

export function getSubMission(missionId: string, subId: string): SubMission | undefined {
  return getMissionById(missionId)?.subMissions.find((s) => s.id === subId);
}

export function getSubMissionBySlug(missionId: string, slug: string): SubMission | undefined {
  return getMissionById(missionId)?.subMissions.find((s) => s.slug === slug);
}

export function getProjectSlug(sm: SubMission): string {
  return sm.slug;
}

/** Sprite ids of every project in a mission (orb highlight). */
export function missionSpriteIds(mission: Mission): string[] {
  return [...new Set(mission.subMissions.flatMap((s) => s.spriteIds))];
}

export function listMissionParams(): { missionId: string }[] {
  return missions.map((m) => ({ missionId: m.id }));
}

export function listMissionProjectParams(): { missionId: string; projectId: string }[] {
  return missions.flatMap((m) => m.subMissions.map((sm) => ({ missionId: m.id, projectId: sm.slug })));
}
