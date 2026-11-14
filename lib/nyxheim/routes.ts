/**
 * Nyxheim deep routes: every body of the Exordia system opens by URL, with
 * browser history and shareable links — including the Sinistra technologies
 * (`/sinistra/typescript`). This replaces the old HUD panel routing
 * (`/profile`, `/missions/...`, `/skills`, ...); those paths are kept as
 * static pages only so old shared links can redirect to their new home.
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
  /** The route is a legacy HUD path: redirect instead of focusing. */
  legacyHref: string | null;
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

/** Old HUD paths → their new home. Kept so shared links keep working. */
const LEGACY_REDIRECTS: Record<string, string> = {
  profile: "/nyxheim/",
  skills: "/sinistra/",
  certifications: "/certificaciones/",
  contact: "/contacto/",
  terminal: "/",
  minigame: "/",
  missions: "/",
};

export function parseNyxheimPath(pathname: string): NyxheimDestination {
  const clean = pathname.replace(/\/+$/, "") || "/";
  if (clean === "/") {
    return { bodyId: null, skillId: null, legacyHref: null, valid: true };
  }
  const parts = clean.split("/").filter(Boolean);

  // /sinistra/<skill>
  if (parts[0] === "sinistra" && parts.length === 2) {
    const skill = buildSkills.find((s) => s.id === parts[1]);
    if (skill) {
      return { bodyId: "sinistra", skillId: skill.id, legacyHref: null, valid: true };
    }
    return { bodyId: null, skillId: null, legacyHref: null, valid: false };
  }

  if (parts.length === 1) {
    const [segment] = parts;
    // Legacy HUD panel → redirect.
    if (segment in LEGACY_REDIRECTS) {
      return { bodyId: null, skillId: null, legacyHref: LEGACY_REDIRECTS[segment], valid: true };
    }
    // Legacy missions index → overview (project links map below).
    if (segment === "missions") {
      return { bodyId: null, skillId: null, legacyHref: "/", valid: true };
    }
    if (segment === "nyxheim") {
      return { bodyId: "base", skillId: null, legacyHref: null, valid: true };
    }
    if (segment === "certificaciones") {
      return { bodyId: "certificaciones", skillId: null, legacyHref: null, valid: true };
    }
    if (segment === "cv") {
      return { bodyId: "cv", skillId: null, legacyHref: null, valid: true };
    }
    if (segment === "contacto") {
      return { bodyId: "contacto", skillId: null, legacyHref: null, valid: true };
    }
    if (segment === "sinistra") {
      return { bodyId: "sinistra", skillId: null, legacyHref: null, valid: true };
    }
    if (segment === "erebo") {
      return { bodyId: "erebo", skillId: null, legacyHref: null, valid: true };
    }
    const project = getProjectBodyBySlug(segment);
    if (project) {
      return { bodyId: project.id, skillId: null, legacyHref: null, valid: true };
    }
    return { bodyId: null, skillId: null, legacyHref: null, valid: false };
  }

  // Legacy /missions/<mission>[/<project>] → the project route, or overview.
  if (parts[0] === "missions") {
    const slug = parts[2];
    if (slug) {
      const project = getProjectBodyBySlug(slug);
      if (project) {
        return { bodyId: null, skillId: null, legacyHref: bodyToHref(project.id), valid: true };
      }
    }
    return { bodyId: null, skillId: null, legacyHref: "/", valid: true };
  }

  return { bodyId: null, skillId: null, legacyHref: null, valid: false };
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
