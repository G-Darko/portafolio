/** Single source of truth for SEO: metadata builder, JSON-LD and sitemap routes. */
import type { Metadata } from "next";
import { profileSnapshot } from "@/lib/data/snapshot";
import { CONTACT_EMAIL, SITE_URL as SITE_URL_SLASH } from "@/lib/data/profile";
import { listNyxheimParams, listSinistraSkillParams } from "@/lib/nyxheim/routes";
import { ACTIVE_ERA_ID, ERAS } from "@/lib/eras";

export const SITE_URL = SITE_URL_SLASH.replace(/\/+$/, "");
export const FULL_NAME = "Isaac Gael Uribe Ortiz";
export const SITE_NAME = "G-Darko · Gael Uribe";
export const JOB_TITLE = "Full-Stack Developer";
export const DEFAULT_TITLE = `${FULL_NAME} | ${JOB_TITLE}`;
export const DEFAULT_DESCRIPTION =
  "Portafolio de Isaac Gael Uribe Ortiz (G-Darko), desarrollador Full-Stack: Next.js, React, React Native/Expo, TypeScript, Node.js y PostgreSQL.";
export const THEME_COLOR = "#0f0f0f";

/** Swap the art by replacing public/og-image.png (keep 1200x630). */
export const OG_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  type: "image/png",
  alt: "Sistema solar Exordia de Gael Uribe: sol brillante, órbitas y planetas sobre fondo espacial con su avatar chibi, Full-Stack Developer, Next.js, React Native, TypeScript, Node.js, g-darko.dev y @DARKO_z63",
};

/**
 * Gael's X handle, given by him (2026-11-14). The API profile exposes no
 * X/Twitter social, so the twitter:site/creator meta falls back to this
 * instead of being omitted.
 */
const X_HANDLE_FALLBACK = "@DARKO_z63";
const xSocial = profileSnapshot.socials?.find((s) => s.id === "x" || s.id === "twitter");
const X_HANDLE = xSocial
  ? `@${xSocial.url.replace(/\/+$/, "").split("/").pop()}`
  : X_HANDLE_FALLBACK;

/** Public profile URLs for schema.org sameAs (no mailto, no self link). */
export const SAME_AS = (profileSnapshot.socials ?? [])
  .map((s) => s.url)
  .filter((url) => /^https?:\/\//.test(url) && !url.startsWith(SITE_URL));

/** Truncate a description to ~155 chars on a word boundary (meta description). */
export function metaDescription(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

/** One meta description per destination body without project copy. */
const DESTINATION_DESCRIPTIONS: Record<string, string> = {
  nyxheim:
    "Nyxheim es el perfil de Gael Uribe dentro de Exordia: desarrollador Full-Stack y Mobile, experiencia, proyectos y contacto.",
  sinistra:
    "Sinistra es la constelación de las 31 tecnologías de Gael Uribe: TypeScript, React, Next.js, React Native, Node.js y más.",
  certificaciones:
    "Certificaciones de Gael Uribe: Cisco CCNA, Python, JavaScript, Linux y CONOCER EC0160.",
  cv: "CV de Isaac Gael Uribe Ortiz, desarrollador Full-Stack: experiencia en Black Sheep Labs, proyectos, habilidades y certificaciones.",
  contacto:
    "Contacto de Gael Uribe: escríbele por el formulario o directo a contacto@g-darko.dev.",
  erebo: "Erebo, el agujero negro al borde de Exordia, el sistema solar de Gael Uribe.",
};

export function destinationDescription(segment: string): string | undefined {
  return DESTINATION_DESCRIPTIONS[segment];
}

/** One meta description per Sinistra technology (name + category). */
const SKILL_CATEGORY_LABELS: Record<string, string> = {
  frontend: "frontend",
  backend: "backend",
  mobile: "móvil",
  database: "bases de datos",
  graphics: "3D y audio",
  tools: "herramientas",
};

export function skillDescription(skill: { name: string; category: string }): string {
  const category = SKILL_CATEGORY_LABELS[skill.category] ?? skill.category;
  return `${skill.name} en Sinistra, la constelación de tecnologías de Gael Uribe (${category}). Explora su estrella en el sistema solar Exordia.`;
}
export function canonicalPath(path = "/"): string {
  const clean = path.replace(/^\/+|\/+$/g, "");
  return clean ? `/${clean}/` : "/";
}

export function buildMetadata(opts: {
  title?: string;
  description?: string;
  path?: string;
  /** Noindex (e.g. the explicit URL of the active era, a redirect page). */
  noindex?: boolean;
} = {}): Metadata {
  const title = opts.title ? `${opts.title} | ${FULL_NAME}` : DEFAULT_TITLE;
  const description = opts.description ?? DEFAULT_DESCRIPTION;
  const url = canonicalPath(opts.path);
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: opts.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      title,
      description,
      locale: "es_MX",
      alternateLocale: ["en_US"],
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: OG_IMAGE.url, alt: OG_IMAGE.alt }],
      site: X_HANDLE,
      creator: X_HANDLE,
    },
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...buildMetadata(),
  applicationName: SITE_NAME,
  authors: [{ name: FULL_NAME, url: SITE_URL }],
  creator: FULL_NAME,
  keywords: [
    FULL_NAME, "Gael Uribe", "G-Darko", "Full-Stack Developer", "desarrollador full-stack",
    "Next.js", "React", "React Native", "Expo", "TypeScript", "Node.js", "PostgreSQL", "portafolio",
  ],
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/img/DARKO.png", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: "/img/DARKO.png",
  },
};

export function buildJsonLd() {
  const person = {
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: FULL_NAME,
    alternateName: ["Gael Uribe", "G-Darko"],
    url: `${SITE_URL}/`,
    image: `${SITE_URL}${OG_IMAGE.url}`,
    jobTitle: JOB_TITLE,
    email: `mailto:${CONTACT_EMAIL}`,
    sameAs: SAME_AS,
    knowsAbout: ["Next.js", "React", "React Native", "Expo", "TypeScript", "Node.js", "PostgreSQL"],
  };
  const website = {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    inLanguage: ["es-MX", "en-US"],
    author: { "@id": person["@id"] },
  };
  return { "@context": "https://schema.org", "@graph": [person, website] };
}

/**
 * Every static route, for sitemap.xml. Derived from the era registry
 * (Ronda 7): the root destinations of the active era, the Sinistra
 * technologies, the CV document (`/cv`, era-agnostic), and the indexable
 * era URLs — the home and deep links of non-active eras with real
 * content (`/era/hud/`, `/era/hud/missions/`, ...). Excluded on purpose:
 * `/era/<active>/` (canonical → `/`, noindex), its deep links (canonical
 * → their root twin) and the `/cv/documento/` alias (canonical → `/cv/`).
 */
export function listSitePaths(): string[] {
  // Nyxheim destinations (planets, station, constellation, black hole...),
  // every technology as its own Sinistra route, and the CV document.
  const destinations = listNyxheimParams().map((p) => p.panel);
  const skillPaths = listSinistraSkillParams().map((p) => `sinistra/${p.skill}`);
  const eraPaths = ERAS.filter((e) => e.id !== ACTIVE_ERA_ID && e.hasContent).flatMap((e) =>
    e.id === "hud" ? ["era/hud", ...hudSitePaths()] : [`era/${e.id}`]
  );
  return ["/", ...destinations, ...skillPaths, "cv", ...eraPaths].map(canonicalPath);
}

/** Sitemap paths of the HUD era (its home + main panels). */
function hudSitePaths(): string[] {
  return ["missions", "profile", "skills", "certifications", "contact"].map(
    (panel) => `era/hud/${panel}`
  );
}