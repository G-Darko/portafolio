/**
 * LEGACY era data adapter (Ronda 7 PR-2).
 *
 * The LEGACY look is the 2022–2026 static site, but the content is never
 * the 2025 HTML: everything below is derived from the current snapshot
 * (`profileSnapshot`, `missions`, `buildSkills`, `getCertifications`) at
 * build time. Same information as every other era — only the renderer
 * changes (Gael's rule).
 *
 * Notes:
 * - `experience` comes from the API now (`ApiProfile.experience`, parsed
 *   in `lib/data/api.ts`); it mirrors the mission projects with org +
 *   live URL. Items without a description fall back to their tagline.
 * - Skills are grouped by `hudCategory` and shown under the legacy group
 *   labels (Frontend, Backend, Móvil, Databases, Gráficos, Entorno).
 *   The old "Aprendiendo" group is gone: every current skill is a real
 *   skill. Legacy-only ids (jQuery, Flowbite, SweetAlert2, XAMPP,
 *   Postman, Heroku, Godot…) have no snapshot entry and are not shown.
 * - The "Sobre mí" copy is the curated CV summary (`getCvContent`),
 *   which is the current text — the 2025 paragraph is not reused.
 */
import { formatPeriod, type ApiStackItem, type Locale } from "@/lib/data/api";
import { getCertifications } from "@/lib/data/certifications";
import { getCvContent } from "@/lib/data/cv";
import { missions } from "@/lib/data/missions";
import { getSubMissionCopy } from "@/lib/i18n/missionContent";
import { profileSnapshot } from "@/lib/data/snapshot";
import { buildSkills, type Skill } from "@/lib/data/skills";
import type { HudCategory } from "@/lib/data/api";

export interface LegacyExperienceItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  org: string;
  orgUrl?: string;
  period?: string;
  url?: string;
  tags: string[];
}

/** Work timeline, in API order (most recent first). */
export function legacyExperience(locale: Locale): LegacyExperienceItem[] {
  return profileSnapshot.experience.map((e) => ({
    id: e.id,
    title: e.title,
    tagline: e.tagline,
    description: e.description ?? e.tagline,
    org: e.org,
    orgUrl: e.orgUrl,
    period: formatPeriod(e.period, locale),
    url: e.url,
    tags: e.stack.map((s) => s.title),
  }));
}

export interface LegacyProject {
  id: string;
  missionId: string;
  missionTitle: string;
  title: string;
  tagline: string;
  description: string;
  contextTag?: string;
  period?: string;
  stack: ApiStackItem[];
  images: string[];
  /** Local tour (`/video/...`) or a YouTube embed URL — straight from the snapshot. */
  video?: string;
  liveUrl?: string;
  repoUrl?: string;
  playStoreUrl?: string;
  appStoreUrl?: string;
  tenantUrl?: string;
}

/** Every project of every mission, in mission order (Black Sheep Labs, Freelance, Academia). */
export function legacyProjects(locale: Locale): LegacyProject[] {
  return missions.flatMap((mission) =>
    mission.subMissions.map((sub) => {
      const copy = getSubMissionCopy(locale, sub);
      return {
        id: sub.id,
        missionId: mission.id,
        missionTitle: mission.title[locale],
        title: copy.title,
        tagline: copy.tagline,
        description: copy.description,
        contextTag: copy.contextTag,
        period: copy.period,
        stack: sub.stack,
        images: sub.images ?? [],
        video: sub.video,
        liveUrl: sub.liveUrl,
        repoUrl: sub.repoUrl,
        playStoreUrl: sub.playStoreUrl,
        appStoreUrl: sub.appStoreUrl,
        tenantUrl: sub.tenantUrl,
      };
    })
  );
}

/** Legacy skill groups, in the original order (Móvil and Gráficos are new). */
const LEGACY_SKILL_GROUPS: { category: HudCategory; label: string }[] = [
  { category: "frontend", label: "Frontend" },
  { category: "backend", label: "Backend" },
  { category: "mobile", label: "Móvil" },
  { category: "database", label: "Databases" },
  { category: "graphics", label: "Gráficos" },
  { category: "tools", label: "Entorno" },
];

export function legacySkillGroups(): { label: string; skills: Skill[] }[] {
  return LEGACY_SKILL_GROUPS.map((g) => ({
    label: g.label,
    skills: buildSkills.filter((s) => s.category === g.category),
  })).filter((g) => g.skills.length > 0);
}

/** "Sobre mí": the current CV summary, not the 2025 paragraph. */
export function legacyAbout(locale: Locale): string {
  return getCvContent(locale).summary;
}

export function legacyCertifications(locale: Locale) {
  return getCertifications(locale);
}

/** Socials for the hero (GitHub, Credly) — remote icons from the API. */
export function legacySocials() {
  return profileSnapshot.socials;
}

export function legacySocialById(id: string) {
  return profileSnapshot.socials.find((s) => s.id === id);
}

/**
 * Certification link label, by where the badge actually lives:
 * Credly badges → "Ver insignia en Credly", RENAP → "Validar en RENAP",
 * anything else → "Ver certificado".
 */
export function legacyCertLinkLabel(
  url: string | undefined,
  labels: { badge: string; validate: string; view: string }
): string | undefined {
  if (!url) return undefined;
  let host = "";
  try {
    host = new URL(url).host;
  } catch {
    return labels.view;
  }
  if (host.includes("credly.com")) return labels.badge;
  if (host.includes("renap.edu.mx")) return labels.validate;
  return labels.view;
}
