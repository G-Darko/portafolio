/**
 * CV content (ES/EN). Experience bullets, skills and contact come from the API profile snapshot
 * (missions → projects with `highlights`, skills by category, public contact); only CV-specific
 * copy (summary, education, certifications, languages) lives here.
 */
import type { Locale } from "@/lib/store/useLocaleStore";
import { formatPeriod, type Localized } from "@/lib/data/api";
import { missions, type SubMission } from "@/lib/data/missions";
import { profileSnapshot } from "@/lib/data/snapshot";
import {
  CONTACT_EMAIL,
  GITHUB_LABEL,
  GITHUB_URL,
  LINKEDIN_LABEL,
  LINKEDIN_URL,
  PHONE,
  SITE_LABEL,
  SITE_URL,
  telHref,
} from "@/lib/data/profile";

export interface CvBullet {
  /** Project name, shown bold before the achievement. */
  label: string;
  text: string;
}

export interface CvRole {
  title: string;
  org: string;
  period: string;
  bullets: CvBullet[];
  tech: string[];
}

export interface CvSkillGroup {
  label: string;
  items: string[];
}

export interface CvEducationItem {
  title: string;
  org: string;
  period: string;
}

export interface CvCertItem {
  title: string;
  org: string;
  date: string;
  url?: string;
  folio?: string;
}

export interface CvContactItem {
  kind: "email" | "phone" | "site" | "github" | "linkedin";
  label: string;
  href: string;
}

export interface CvContent {
  legalName: string;
  headline: string;
  summary: string;
  location: string;
  contact: CvContactItem[];
  titles: { summary: string; experience: string; skills: string; education: string; certs: string; languages: string };
  roles: CvRole[];
  skillGroups: CvSkillGroup[];
  education: CvEducationItem[];
  certs: CvCertItem[];
  languages: string[];
  ui: { back: string; download: string; downloading: string; brandStamp: string; available: string; techLabel: string };
}

/** Contact lines shared by the web CV and the PDF (plain text + link, no icons replacing words). */
export function getContactItems(): CvContactItem[] {
  const items: CvContactItem[] = [
    { kind: "email", label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
    { kind: "phone", label: PHONE, href: telHref(PHONE) },
    { kind: "site", label: SITE_LABEL, href: SITE_URL },
    { kind: "github", label: GITHUB_LABEL, href: GITHUB_URL },
  ];
  if (LINKEDIN_URL && LINKEDIN_LABEL) items.push({ kind: "linkedin", label: LINKEDIN_LABEL, href: LINKEDIN_URL });
  return items;
}

const SKILL_GROUPS: { category: string; label: Localized; extra?: string[] }[] = [
  { category: "frontend", label: { es: "Frontend", en: "Frontend" } },
  { category: "movil", label: { es: "Mobile", en: "Mobile" }, extra: ["Publicación en App Store y Google Play"] },
  { category: "backend", label: { es: "Backend", en: "Backend" } },
  { category: "lenguajes", label: { es: "Lenguajes", en: "Languages" } },
  { category: "datos", label: { es: "Bases de datos", en: "Databases" }, extra: ["Firebird"] },
  { category: "devops", label: { es: "DevOps y herramientas", en: "DevOps & tools" } },
  { category: "herramientas", label: { es: "DevOps y herramientas", en: "DevOps & tools" } },
];

const EXTRA_EN: Record<string, string> = { "Publicación en App Store y Google Play": "App Store & Google Play publishing" };

/** API skills grouped with standard ATS headings; groups sharing a label are merged. */
function skillGroups(locale: Locale): CvSkillGroup[] {
  const groups = new Map<string, string[]>();
  for (const g of SKILL_GROUPS) {
    const items = profileSnapshot.skills.filter((s) => s.category === g.category).map((s) => s.title);
    const extra = (g.extra ?? []).map((e) => (locale === "en" ? (EXTRA_EN[e] ?? e) : e));
    const label = g.label[locale];
    groups.set(label, [...(groups.get(label) ?? []), ...items, ...extra]);
  }
  return [...groups].map(([label, items]) => ({ label, items: [...new Set(items)] }));
}

const inCv = (p: SubMission) => p.featured !== false && (p.highlights?.es.length ?? 0) > 0;

/** Known tech only (with an API icon), in order of appearance; unknown names stay out of the CV. */
const techOf = (projects: SubMission[]) =>
  [...new Set(projects.flatMap((p) => p.stack.filter((s) => s.id).map((s) => s.title)))];

function bulletsOf(projects: SubMission[], locale: Locale): CvBullet[] {
  // Project name only on its first bullet, so the scan reads "Duplica: … / …".
  return projects.flatMap((p) => (p.highlights?.[locale] ?? []).map((text, i) => ({ label: i === 0 ? p.title[locale] : "", text })));
}

/** Experience missions become one role; other missions list each CV project with its own `role` as a role. */
function roles(locale: Locale): CvRole[] {
  const out: { start: string; role: CvRole }[] = [];
  for (const mission of missions) {
    const projects = mission.subMissions.filter(inCv);
    if (projects.length === 0) continue;
    if (mission.experience || !projects.some((p) => p.role)) {
      out.push({
        start: mission.period?.start ?? "",
        role: {
          title: mission.role?.[locale] ?? mission.title[locale],
          org: mission.orgName ?? mission.title[locale],
          period: formatPeriod(mission.period, locale) ?? "",
          bullets: bulletsOf(projects, locale),
          tech: techOf(projects),
        },
      });
      continue;
    }
    for (const p of projects) {
      out.push({
        start: p.period?.start ?? mission.period?.start ?? "",
        role: {
          title: p.role?.[locale] ?? p.title[locale],
          org: p.orgName ?? mission.orgName ?? mission.title[locale],
          period: formatPeriod(p.period ?? mission.period, locale) ?? "",
          bullets: (p.highlights?.[locale] ?? []).map((text) => ({ label: "", text })),
          tech: techOf([p]),
        },
      });
    }
  }
  return out.sort((a, b) => b.start.localeCompare(a.start)).map((r) => r.role);
}

const COPY: Record<Locale, Omit<CvContent, "contact" | "roles" | "skillGroups">> = {
  es: {
    legalName: "Isaac Gael Uribe Ortiz",
    headline: "Desarrollador Full-Stack y Mobile | Next.js, React, React Native, Expo, TypeScript, Node.js",
    summary:
      "Desarrollador full-stack y mobile en Black Sheep Lab. Llevo productos de la idea a producción con Next.js, React Native/Expo, TypeScript y PostgreSQL: publiqué Duplica en App Store y Google Play (más de 1,200 usuarios registrados) y construí plataformas multi-tenant e integraciones con ERP.",
    location: "México",
    titles: {
      summary: "Perfil",
      experience: "Experiencia",
      skills: "Habilidades",
      education: "Educación",
      certs: "Certificaciones",
      languages: "Idiomas",
    },
    education: [
      { title: "Ingeniería en Tecnologías de la Información", org: "Universidad Politécnica del Valle de México (UPVM)", period: "ene 2023 – abr 2026" },
      { title: "Técnico en Programación", org: "CECyTEM Tultitlán", period: "2019 – 2022" },
    ],
    certs: [
      { title: "Desarrollo de Código de Software (EC0160)", org: "CONOCER", date: "sep 2022", folio: "(D-00)16955622", url: "https://conocer.gob.mx/RENAP/certificaciones" },
      { title: "JavaScript Essentials 1", org: "Cisco Networking Academy", date: "jul 2025", url: "https://www.credly.com/users/g-darko" },
    ],
    languages: ["Español: nativo", "Inglés: intermedio (B1)"],
    ui: { back: "← Portafolio", download: "Descargar PDF", downloading: "Generando…", brandStamp: "G-DARKO / CV", available: "Disponible para nuevas oportunidades", techLabel: "Tecnologías" },
  },
  en: {
    legalName: "Isaac Gael Uribe Ortiz",
    headline: "Full-Stack & Mobile Developer | Next.js, React, React Native, Expo, TypeScript, Node.js",
    summary:
      "Full-stack and mobile developer at Black Sheep Lab. I take products from idea to production with Next.js, React Native/Expo, TypeScript, and PostgreSQL: shipped Duplica to the App Store and Google Play (1,200+ registered users) and built multi-tenant platforms and ERP integrations.",
    location: "Mexico",
    titles: {
      summary: "Summary",
      experience: "Experience",
      skills: "Skills",
      education: "Education",
      certs: "Certifications",
      languages: "Languages",
    },
    education: [
      { title: "B.S. in Information Technology Engineering", org: "Universidad Politécnica del Valle de México (UPVM)", period: "Jan 2023 – Apr 2026" },
      { title: "Programming Technician", org: "CECyTEM Tultitlán", period: "2019 – 2022" },
    ],
    certs: [
      { title: "Software Code Development (EC0160)", org: "CONOCER", date: "Sep 2022", folio: "(D-00)16955622", url: "https://conocer.gob.mx/RENAP/certificaciones" },
      { title: "JavaScript Essentials 1", org: "Cisco Networking Academy", date: "Jul 2025", url: "https://www.credly.com/users/g-darko" },
    ],
    languages: ["Spanish: native", "English: intermediate (B1)"],
    ui: { back: "← Portfolio", download: "Download PDF", downloading: "Generating…", brandStamp: "G-DARKO / CV", available: "Open to new opportunities", techLabel: "Tech" },
  },
};

export function getCvContent(locale: Locale): CvContent {
  const copy = COPY[locale] ?? COPY.es;
  return { ...copy, contact: getContactItems(), roles: roles(locale), skillGroups: skillGroups(locale) };
}
