import type { PanelId } from "@/lib/store/useHUDStore";
import type { MissionId } from "@/lib/data/missions";
import { getBasePath } from "@/lib/asset";

export const PANEL_PATHS: Record<PanelId, string> = {
  profile: "profile",
  missions: "missions",
  skills: "skills",
  certifications: "certifications",
  terminal: "terminal",
  minigame: "minigame",
  contact: "contact",
};

const PATH_TO_PANEL = Object.fromEntries(
  Object.entries(PANEL_PATHS).map(([panel, path]) => [path, panel])
) as Record<string, PanelId>;

const MISSION_IDS: MissionId[] = ["black-sheep", "freelance", "academia"];

/** Alias of getBasePath — keep HUD routing imports stable. */
export function getHudBasePath(): string {
  return getBasePath();
}

export function isMissionId(value: string): value is MissionId {
  return (MISSION_IDS as string[]).includes(value);
}

/** Strip trailing slashes except root — matches Next trailingSlash URLs. */
export function normalizePath(pathname: string): string {
  if (!pathname || pathname === "/") return "/";
  return pathname.replace(/\/+$/, "") || "/";
}

/** Pathname without basePath, normalized (e.g. `/missions`). */
export function pathFromLocation(pathname: string): string {
  const base = getHudBasePath();
  let path = pathname;
  if (base && path.startsWith(base)) {
    path = path.slice(base.length) || "/";
  }
  return normalizePath(path);
}

/** Browser URL for history API (includes basePath + trailing slash). */
export function toBrowserHref(href: string): string {
  const base = getHudBasePath();
  const normalized = normalizePath(href);
  if (normalized === "/") return `${base}/` || "/";
  return `${base}${normalized}/`;
}

export function panelToHref(
  panel: PanelId | null,
  missionId?: MissionId | null
): string {
  if (!panel) return "/";
  const segment = `/${PANEL_PATHS[panel]}`;
  // trailingSlash: true in next.config — keep hrefs consistent to avoid redirect loops
  if (panel === "missions" && missionId) return `${segment}/${missionId}/`;
  return `${segment}/`;
}

export function parseHudPath(pathname: string): {
  panel: PanelId | null;
  missionId: MissionId | null;
  valid: boolean;
} {
  const clean = normalizePath(pathname);
  if (clean === "/") {
    return { panel: null, missionId: null, valid: true };
  }

  const parts = clean.split("/").filter(Boolean);
  if (parts[0] === "cv") {
    return { panel: null, missionId: null, valid: true };
  }

  const panel = PATH_TO_PANEL[parts[0]];
  if (!panel) {
    return { panel: null, missionId: null, valid: false };
  }

  if (parts.length === 1) {
    return { panel, missionId: null, valid: true };
  }

  if (panel === "missions" && parts.length === 2 && isMissionId(parts[1])) {
    return { panel, missionId: parts[1], valid: true };
  }

  return { panel: null, missionId: null, valid: false };
}
