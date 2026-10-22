/**
 * Types and validation for the profile served by api.g-darko.dev (`/api/profile`, `/api/skills`).
 * The API (readme-stats `src/data/profile.ts` + `src/data/missions.ts`) is the single source of truth
 * for skills, contact, socials and projects; this module is the only place that parses its payload.
 */

export const API_BASE = "https://api.g-darko.dev";
export const PROFILE_API_URL = `${API_BASE}/api/profile`;
export const SKILLS_API_URL = `${API_BASE}/api/skills`;

export type Locale = "es" | "en";
export type Localized = Record<Locale, string>;
export type LocalizedList = Record<Locale, string[]>;

export const HUD_CATEGORIES = ["frontend", "backend", "mobile", "database", "graphics", "tools"] as const;
export type HudCategory = (typeof HUD_CATEGORIES)[number];

export interface ApiSkill {
  id: string;
  title: string;
  category: string;
  url?: string;
  color?: string;
  /** Remote SVG logo. */
  icon?: string;
  /** lucide icon name (kebab-case). */
  uiIcon?: string;
  /** TechIconsSprite / TechSphere symbol id. */
  sprite?: string;
  hudCategory?: HudCategory;
}

export interface ApiSocial {
  id: string;
  title: string;
  url: string;
  icon?: string;
  label?: string;
}

export interface ApiContact {
  email: string;
  github?: string;
  site?: string;
  linkedin?: string;
}

export interface ApiStackItem {
  id?: string;
  title: string;
  icon?: string;
  sprite?: string;
}

export interface ApiPeriod {
  /** `YYYY-MM` or `YYYY`. */
  start: string;
  /** `YYYY-MM`, `YYYY` or "Presente". */
  end: string;
}

export interface ApiProject {
  id: string;
  slug: string;
  title: Localized;
  tagline: Localized;
  description: Localized;
  summary?: Localized;
  highlights?: LocalizedList;
  /** CV role when the project was a separate position. */
  role?: Localized;
  orgName?: string;
  contextTag?: Localized;
  stack: ApiStackItem[];
  period?: ApiPeriod;
  repoUrl?: string;
  liveUrl?: string;
  playStoreUrl?: string;
  appStoreUrl?: string;
  tenantUrl?: string;
  images?: string[];
  video?: string;
  isMockup?: boolean;
  /** false = portfolio only (not in the CV). */
  featured?: boolean;
}

export interface ApiMission {
  id: string;
  icon: string;
  rank: string;
  title: Localized;
  codename: Localized;
  description: Localized;
  org: Localized;
  orgName?: string;
  orgUrl?: string;
  role?: Localized;
  period?: ApiPeriod;
  experience?: boolean;
  projects: ApiProject[];
}

export interface ApiCertification {
  id: string;
  name: string;
  issuer: string;
  issuedAt: string;
  url?: string;
  emblem?: string;
  color?: string;
}

export interface ApiProfile {
  name: string;
  subtitle: string;
  contact?: ApiContact;
  skills: ApiSkill[];
  socials: ApiSocial[];
  missions: ApiMission[];
  certifications: ApiCertification[];
}

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const isStr = (v: unknown): v is string => typeof v === "string";
const optStr = (v: unknown) => v === undefined || isStr(v);
const isLocalized = (v: unknown): v is Localized => isObj(v) && isStr(v.es) && isStr(v.en);
const optLocalized = (v: unknown) => v === undefined || isLocalized(v);
const isStrList = (v: unknown): v is string[] => Array.isArray(v) && v.every(isStr);
const isPeriod = (v: unknown): v is ApiPeriod => isObj(v) && isStr(v.start) && isStr(v.end);
const list = <T>(v: unknown, valid: (item: Obj) => boolean): T[] =>
  Array.isArray(v) ? (v.filter((item) => isObj(item) && valid(item)) as T[]) : [];

export const isApiSkill = (s: Obj) =>
  isStr(s.id) && isStr(s.title) && isStr(s.category) && optStr(s.icon) && optStr(s.uiIcon) && optStr(s.sprite) &&
  (s.hudCategory === undefined || HUD_CATEGORIES.includes(s.hudCategory as HudCategory));

const isProject = (p: Obj) =>
  isStr(p.id) && isStr(p.slug) && isLocalized(p.title) && isLocalized(p.tagline) && isLocalized(p.description) &&
  optLocalized(p.summary) && optLocalized(p.contextTag) &&
  (p.highlights === undefined || (isObj(p.highlights) && isStrList(p.highlights.es) && isStrList(p.highlights.en))) &&
  Array.isArray(p.stack) && (p.period === undefined || isPeriod(p.period)) &&
  (p.images === undefined || isStrList(p.images));

function parseMission(m: Obj): ApiMission[] {
  const ok = isStr(m.id) && isStr(m.icon) && isStr(m.rank) && isLocalized(m.title) && isLocalized(m.codename) &&
    isLocalized(m.description) && isLocalized(m.org) && optLocalized(m.role) && Array.isArray(m.projects);
  if (!ok) return [];
  const projects = list<ApiProject>(m.projects, isProject).map((p) => ({
    ...p,
    stack: list<ApiStackItem>(p.stack, (s) => isStr(s.title)),
  }));
  return [{ ...(m as unknown as ApiMission), projects }];
}

/** Skills from an `/api/skills` or `/api/profile` payload; invalid entries are dropped. */
export function parseSkills(data: unknown): ApiSkill[] {
  return isObj(data) ? list<ApiSkill>(data.skills, isApiSkill) : [];
}

/** Full `/api/profile` payload, or null when it is not one. */
export function parseProfile(data: unknown): ApiProfile | null {
  if (!isObj(data) || !isStr(data.name)) return null;
  const contact = isObj(data.contact) && isStr(data.contact.email) ? (data.contact as unknown as ApiContact) : undefined;
  return {
    name: data.name,
    subtitle: isStr(data.subtitle) ? data.subtitle : "",
    contact,
    skills: parseSkills(data),
    socials: list<ApiSocial>(data.socials, (s) => isStr(s.id) && isStr(s.title) && isStr(s.url)),
    missions: Array.isArray(data.missions) ? data.missions.flatMap((m) => (isObj(m) ? parseMission(m) : [])) : [],
    certifications: list<ApiCertification>(data.certifications, (c) => isStr(c.id) && isStr(c.name) && isStr(c.issuer) && isStr(c.issuedAt)),
  };
}

const MONTHS: Record<Locale, string[]> = {
  es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};
const PRESENT: Localized = { es: "actual", en: "Present" };

/** "2026-02" → "feb 2026" / "Feb 2026"; "2021" stays; "Presente" → "actual" / "Present". */
export function formatPeriodPart(value: string, locale: Locale): string {
  const match = /^(\d{4})(?:-(\d{2}))?/.exec(value);
  if (!match) return PRESENT[locale];
  const month = match[2] ? MONTHS[locale][Number(match[2]) - 1] : undefined;
  return month ? `${month} ${match[1]}` : match[1];
}

export function formatPeriod(period: ApiPeriod | undefined, locale: Locale): string | undefined {
  if (!period) return undefined;
  const start = formatPeriodPart(period.start, locale);
  const end = formatPeriodPart(period.end, locale);
  return start === end ? start : `${start} – ${end}`;
}
