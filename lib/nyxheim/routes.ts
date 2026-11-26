/**
 * Nyxheim deep routes: every body of the Exordia system opens by URL, with
 * browser history and shareable links — including the Sinistra technologies
 * (`/sinistra/typescript`). The old HUD paths (`/profile`, `/missions/...`,
 * `/skills`, ...) do not exist and do not redirect.
 *
 * The world is the home view; the route only picks the focus. The shell
 * lives in (hud)/layout, so soft navigations never remount the canvas.
 */
import { buildSkills } from "@/lib/data/skills";
import { ACTIVE_ERA_ID } from "@/lib/eras";
import {
  getNyxheimBody,
  getProjectBodyBySlug,
  NYXHEIM_BODIES,
  type NyxheimBody,
} from "./bodies";

export interface NyxheimDestination {
  /** Body to focus, or null for the overview. */
  bodyId: string | null;
  /** Skill inside Sinistra, if any. */
  skillId: string | null;
  valid: boolean;
}

/** One-segment destinations, in dock order where it applies. */
export const NYXHEIM_SEGMENTS: string[] = [
  ...NYXHEIM_BODIES.filter((b) => b.kind !== "sun").map((b) =>
    b.projectSlug ? b.projectSlug : bodySegment(b)
  ),
  ...buildSkills.map((s) => s.id).map((id) => `sinistra/${id}`),
];

/**
 * Static params for the (hud)/[panel] route: one entry per segment.
 * Excludes "cv": since Ronda 7 option B, `/cv` is the CV document
 * (era-agnostic, `app/cv/page.tsx`), not a root destination. The CV
 * planet's deep link lives under the era: `/era/exordia/cv/`
 * (see `listEraNyxheimParams`).
 */
export function listNyxheimParams(): { panel: string }[] {
  return NYXHEIM_SEGMENTS.filter((s) => !s.includes("/") && s !== "cv").map((panel) => ({ panel }));
}

/** Static params for the era route `/era/exordia/[panel]`: all segments, CV included. */
export function listEraNyxheimParams(): { panel: string }[] {
  return NYXHEIM_SEGMENTS.filter((s) => !s.includes("/")).map((panel) => ({ panel }));
}

/** Era prefix of a pathname when the world renders under `/era/exordia`. */
export function nyxheimBasePath(pathname: string): string {
  return pathname === "/era/exordia" || pathname.startsWith("/era/exordia/")
    ? "/era/exordia"
    : "";
}

/**
 * Base for links the world builds (see `useNyxheimRouting`): "" while
 * Exordia is the active era — its root URLs are canonical, so a planet
 * clicked from `/era/exordia/cv/` goes to `/skool/`, not
 * `/era/exordia/skool/`. The explicit prefix only survives when
 * Exordia is NOT the active era. `nyxheimBasePath` is untouched: it
 * still strips the prefix when PARSING, so `/era/exordia/cv/` keeps
 * resolving to the CV planet. Same collapse as `hudBasePath()` in
 * `lib/hud/routes.ts`.
 */
export function nyxheimLinkBase(pathname: string): string {
  const base = nyxheimBasePath(pathname);
  if (!base) return "";
  const eraId = base.slice("/era/".length);
  return eraId === ACTIVE_ERA_ID ? "" : base;
}

/** Static params for the (hud)/sinistra/[skill] route. */
export function listSinistraSkillParams(): { skill: string }[] {
  return buildSkills.map((s) => ({ skill: s.id }));
}

/** URL segment for a body (project bodies use their project slug). */
export function bodySegment(body: NyxheimBody): string {
  if (body.projectSlug) return body.projectSlug;
  switch (body.id) {
    case "base":
      return "nyxheim";
    case "certificaciones":
      return "certificaciones";
    case "cv":
      return "cv";
    case "contacto":
      return "contacto";
    case "sinistra":
      return "sinistra";
    case "erebo":
      return "erebo";
    default:
      return body.id;
  }
}

/**
 * Browser URL for a body (trailing slash, like the rest of the site).
 * `base` is the era prefix for links (`nyxheimLinkBase`: "" while
 * Exordia is the active era, `/era/exordia` otherwise). The CV planet
 * has no root twin anymore (option B: `/cv` is the document), so it
 * always points at `/era/exordia/cv/` — but from there, every other
 * planet link is root-relative again.
 */
export function bodyToHref(bodyId: string, skillId?: string | null, base = ""): string {
  if (bodyId === "cv") return "/era/exordia/cv/";
  if (bodyId === "sinistra" && skillId) return `${base}/sinistra/${skillId}/`;
  const body = getNyxheimBody(bodyId);
  if (!body) return base ? `${base}/` : "/";
  return `${base}/${bodySegment(body)}/`;
}

export function parseNyxheimPath(pathname: string): NyxheimDestination {
  // The world also renders under `/era/exordia/...`: strip that prefix
  // first. `cv` is only a destination there — at the root `/cv` is the
  // CV document (option B), not the planet.
  const eraBase = nyxheimBasePath(pathname);
  const stripped = eraBase ? pathname.slice(eraBase.length) || "/" : pathname;
  const clean = stripped.replace(/\/+$/, "") || "/";
  if (clean === "/") {
    return { bodyId: null, skillId: null, valid: true };
  }
  const parts = clean.split("/").filter(Boolean);

  // /sinistra/<skill>
  if (parts[0] === "sinistra" && parts.length === 2) {
    const skill = buildSkills.find((s) => s.id === parts[1]);
    if (skill) {
      return { bodyId: "sinistra", skillId: skill.id, valid: true };
    }
    return { bodyId: null, skillId: null, valid: false };
  }

  if (parts.length === 1) {
    const [segment] = parts;
    if (segment === "nyxheim") {
      return { bodyId: "base", skillId: null, valid: true };
    }
    if (segment === "certificaciones") {
      return { bodyId: "certificaciones", skillId: null, valid: true };
    }
    if (segment === "cv") {
      // Only under /era/exordia: at the root /cv is the CV document.
      if (!eraBase) return { bodyId: null, skillId: null, valid: false };
      return { bodyId: "cv", skillId: null, valid: true };
    }
    if (segment === "contacto") {
      return { bodyId: "contacto", skillId: null, valid: true };
    }
    if (segment === "sinistra") {
      return { bodyId: "sinistra", skillId: null, valid: true };
    }
    if (segment === "erebo") {
      return { bodyId: "erebo", skillId: null, valid: true };
    }
    const project = getProjectBodyBySlug(segment);
    if (project) {
      return { bodyId: project.id, skillId: null, valid: true };
    }
    return { bodyId: null, skillId: null, valid: false };
  }

  return { bodyId: null, skillId: null, valid: false };
}

/** Page title for a destination (metadata of the static route pages). */
export function destinationTitle(segment: string): string | undefined {
  if (segment === "nyxheim") return "Nyxheim";
  if (segment === "sinistra") return "Sinistra";
  if (segment === "certificaciones") return "Certificaciones";
  if (segment === "cv") return "CV";
  if (segment === "contacto") return "Contacto";
  if (segment === "erebo") return "Erebo";
  const project = getProjectBodyBySlug(segment);
  return project?.projectSlug;
}
