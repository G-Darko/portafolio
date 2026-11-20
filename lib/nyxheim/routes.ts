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

/** Static params for the (hud)/[panel] route: one entry per segment. */
export function listNyxheimParams(): { panel: string }[] {
  return NYXHEIM_SEGMENTS.filter((s) => !s.includes("/")).map((panel) => ({ panel }));
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

/** Browser URL for a body (trailing slash, like the rest of the site). */
export function bodyToHref(bodyId: string, skillId?: string | null): string {
  if (bodyId === "sinistra" && skillId) return `/sinistra/${skillId}/`;
  const body = getNyxheimBody(bodyId);
  if (!body) return "/";
  return `/${bodySegment(body)}/`;
}

export function parseNyxheimPath(pathname: string): NyxheimDestination {
  const clean = pathname.replace(/\/+$/, "") || "/";
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
