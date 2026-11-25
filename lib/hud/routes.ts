import type { PanelId } from "@/lib/store/useHUDStore";
import {
  getSubMission,
  getSubMissionBySlug,
  missionIds,
  type MissionId,
} from "@/lib/data/missions";
import { getBasePath } from "@/lib/asset";
import { ACTIVE_ERA_ID } from "@/lib/eras";

/**
 * HUD routing, era-aware (Ronda 7). The HUD era lives at `/era/hud`
 * while Exordia is the active era; if HUD ever becomes the active era,
 * `hudBasePath()` becomes "" and the same code serves the panels from
 * the root (`/missions`, `/profile`, ...). Era-agnostic paths (`/cv`,
 * the document) never get the era prefix — see `toBrowserHref`.
 */
export const HUD_ERA_PATH = "/era/hud";

/** URL prefix for HUD panels: "" when HUD is the active era. */
export function hudBasePath(): string {
  return ACTIVE_ERA_ID === "hud" ? "" : HUD_ERA_PATH;
}

/** Strip the `/era/hud` prefix (if present) → the era-relative path. */
export function stripHudEraPrefix(pathname: string): string {
  const clean = normalizePath(pathname);
  if (clean === HUD_ERA_PATH) return "/";
  if (clean.startsWith(`${HUD_ERA_PATH}/`)) {
    return normalizePath(clean.slice(HUD_ERA_PATH.length));
  }
  return clean;
}

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



/** Era-aware base path for HUD panel URLs (was just the asset basePath). */
export function getHudBasePath(): string {
  return `${getBasePath()}${hudBasePath()}`;
}

export function isMissionId(value: string): value is MissionId {
  return missionIds.includes(value);
}

export function isMissionProjectSlug(missionId: MissionId, slug: string): boolean {
  return Boolean(getSubMissionBySlug(missionId, slug));
}

/** Strip trailing slashes except root — matches Next trailingSlash URLs. */
export function normalizePath(pathname: string): string {
  if (!pathname || pathname === "/") return "/";
  return pathname.replace(/\/+$/, "") || "/";
}

/** Pathname without basePath / era prefix, normalized (e.g. `/missions`). */
export function pathFromLocation(pathname: string): string {
  return stripHudEraPrefix(pathname);
}

/**
 * Browser URL for window.open / location / history (includes the era
 * prefix + trailing slash). Do NOT pass this to next/link — Link already
 * prefixes basePath. Era-agnostic paths (`/cv`) pass through untouched:
 * the CV document lives outside the era system.
 */
export function toBrowserHref(href: string): string {
  const normalized = normalizePath(href);
  if (normalized === "/cv" || normalized.startsWith("/cv/")) {
    const base = getBasePath();
    return base ? `${base}${normalized}/` : `${normalized}/`;
  }
  const base = getHudBasePath();
  if (normalized === "/") return `${base}/` || "/";
  return `${base}${normalized}/`;
}

export function panelToHref(
  panel: PanelId | null,
  missionId?: MissionId | null,
  projectSlug?: string | null
): string {
  const base = getHudBasePath();
  if (!panel) return `${base}/` || "/";
  const segment = `${base}/${PANEL_PATHS[panel]}`;
  // trailingSlash: true in next.config — keep hrefs consistent to avoid redirect loops
  if (panel === "missions" && missionId && projectSlug) {
    return `${segment}/${missionId}/${projectSlug}/`;
  }
  if (panel === "missions" && missionId) return `${segment}/${missionId}/`;
  return `${segment}/`;
}

export function projectSlugFromStore(
  missionId: MissionId | null,
  subMissionId: string | null
): string | null {
  if (!missionId || !subMissionId) return null;
  const sm = getSubMission(missionId, subMissionId);
  return sm?.slug ?? null;
}

export function parseHudPath(pathname: string): {
  panel: PanelId | null;
  missionId: MissionId | null;
  projectSlug: string | null;
  valid: boolean;
} {
  const clean = stripHudEraPrefix(pathname);
  if (clean === "/") {
    return { panel: null, missionId: null, projectSlug: null, valid: true };
  }

  const parts = clean.split("/").filter(Boolean);
  if (parts[0] === "cv") {
    return { panel: null, missionId: null, projectSlug: null, valid: true };
  }

  const panel = PATH_TO_PANEL[parts[0]];
  if (!panel) {
    return { panel: null, missionId: null, projectSlug: null, valid: false };
  }

  if (parts.length === 1) {
    return { panel, missionId: null, projectSlug: null, valid: true };
  }

  if (panel === "missions" && parts.length === 2 && isMissionId(parts[1])) {
    return { panel, missionId: parts[1], projectSlug: null, valid: true };
  }

  if (
    panel === "missions" &&
    parts.length === 3 &&
    isMissionId(parts[1]) &&
    isMissionProjectSlug(parts[1], parts[2])
  ) {
    return {
      panel,
      missionId: parts[1],
      projectSlug: parts[2],
      valid: true,
    };
  }

  // Guard: known mission with unknown project → invalid
  if (panel === "missions" && parts.length >= 2 && !isMissionId(parts[1])) {
    return { panel: null, missionId: null, projectSlug: null, valid: false };
  }

  return { panel: null, missionId: null, projectSlug: null, valid: false };
}

export function resolveProjectId(
  missionId: MissionId,
  projectSlug: string
): string | null {
  return getSubMissionBySlug(missionId, projectSlug)?.id ?? null;
}
