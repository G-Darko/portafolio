/**
 * Era registry — the single source of truth for the portfolio's eras
 * (Ronda 7). Every era is a different renderer over the same data
 * (snapshot `lib/data/profile.generated.json`); only the style changes.
 *
 * To change the active era, edit ONE constant: `ACTIVE_ERA_ID`.
 * `/` renders that era; every era also lives at `/era/<id>/`.
 * The switcher, the sitemap and `generateStaticParams` all derive from
 * this registry — nothing else needs a hand edit when an era is added.
 *
 * LEGACY has no content yet (PR-2, Ronda 7): it is listed here so the
 * switcher and its route already exist, but its page is an explicit
 * "in restoration" placeholder, noindexed and out of the sitemap.
 */

export type EraId = "legacy" | "hud" | "exordia";

export interface EraDef {
  id: EraId;
  /** Display name (a proper name, never translated). */
  name: string;
  /** Years shown on the time-travel date card. */
  years: string;
  /** i18n key for the short tagline (see `t.eras.*`). */
  taglineKey: string;
  /** i18n key for the travel-card blurb (see `t.eras.*`). */
  blurbKey: string;
  /** Whether the era has real content (false = placeholder page). */
  hasContent: boolean;
}

export const ERAS: EraDef[] = [
  {
    id: "legacy",
    name: "LEGACY",
    years: "2022–2026",
    taglineKey: "legacyTagline",
    blurbKey: "legacyBlurb",
    hasContent: false,
  },
  {
    id: "hud",
    name: "HUD",
    years: "2026",
    taglineKey: "hudTagline",
    blurbKey: "hudBlurb",
    hasContent: true,
  },
  {
    id: "exordia",
    name: "EXORDIA",
    years: "2026–hoy",
    taglineKey: "exordiaTagline",
    blurbKey: "exordiaBlurb",
    hasContent: true,
  },
];

/** THE constant Gael edits: the era `/` renders. */
export const ACTIVE_ERA_ID: EraId = "exordia";

export function getEra(id: string): EraDef | undefined {
  return ERAS.find((e) => e.id === id);
}

export function isEraId(value: string): value is EraId {
  return ERAS.some((e) => e.id === value);
}

export function getActiveEra(): EraDef {
  return getEra(ACTIVE_ERA_ID) ?? ERAS[ERAS.length - 1];
}

/**
 * Where the switcher navigates for an era: `/` for the active era,
 * `/era/<id>/` for the others.
 */
export function eraHref(id: EraId): string {
  return id === ACTIVE_ERA_ID ? "/" : `/era/${id}/`;
}

/** Explicit era URL, even for the active era (`/era/exordia/`). */
export function eraExplicitHref(id: EraId): string {
  return `/era/${id}/`;
}
