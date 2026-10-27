/** Single source of truth for SEO: metadata builder, JSON-LD and sitemap routes. */
import type { Metadata } from "next";
import { profileSnapshot } from "@/lib/data/snapshot";
import { CONTACT_EMAIL, SITE_URL as SITE_URL_SLASH } from "@/lib/data/profile";
import { missions } from "@/lib/data/missions";
import { PANEL_PATHS } from "@/lib/hud/routes";

export const SITE_URL = SITE_URL_SLASH.replace(/\/+$/, "");
export const FULL_NAME = "Isaac Gael Uribe Ortiz";
export const SITE_NAME = "G-Darko Â· Gael Uribe";
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
  alt: "Avatar chibi de Isaac Gael Uribe Ortiz con el texto Full-Stack Developer, tecnologÃ­as Next.js, React Native, TypeScript y Node.js, y g-darko.dev",
};

/** Only set if the API profile exposes an X/Twitter social. */
const xSocial = profileSnapshot.socials?.find((s) => s.id === "x" || s.id === "twitter");
const X_HANDLE = xSocial ? `@${xSocial.url.replace(/\/+$/, "").split("/").pop()}` : undefined;

/** Public profile URLs for schema.org sameAs (no mailto, no self link). */
export const SAME_AS = (profileSnapshot.socials ?? [])
  .map((s) => s.url)
  .filter((url) => /^https?:\/\//.test(url) && !url.startsWith(SITE_URL));

/** Normalize a route to the trailing-slash form emitted by the static export. */
export function canonicalPath(path = "/"): string {
  const clean = path.replace(/^\/+|\/+$/g, "");
  return clean ? `/${clean}/` : "/";
}

export function buildMetadata(opts: { title?: string; description?: string; path?: string } = {}): Metadata {
  const title = opts.title ? `${opts.title} | ${FULL_NAME}` : DEFAULT_TITLE;
  const description = opts.description ?? DEFAULT_DESCRIPTION;
  const url = canonicalPath(opts.path);
  return {
    title,
    description,
    alternates: { canonical: url },
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
      ...(X_HANDLE ? { site: X_HANDLE, creator: X_HANDLE } : {}),
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
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
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

export const PANEL_TITLES: Record<string, string> = {
  profile: "Perfil",
  missions: "Misiones y proyectos",
  skills: "Habilidades",
  certifications: "Certificaciones",
  terminal: "Terminal",
  minigame: "Minijuego",
  contact: "Contacto",
};

/** Every static route, for sitemap.xml. */
export function listSitePaths(): string[] {
  const panels = Object.values(PANEL_PATHS);
  const missionPaths = missions.flatMap((m) => [
    `missions/${m.id}`,
    ...m.subMissions.map((s) => `missions/${m.id}/${s.slug}`),
  ]);
  return ["/", ...panels, ...missionPaths, "cv"].map(canonicalPath);
}