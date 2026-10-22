/**
 * One-page CV content (ES/EN). Contact, role dates and certifications come from the API profile
 * snapshot; the role bullets, skill groups and summary are curated here to fit one A4 page.
 */
import type { Locale } from "@/lib/store/useLocaleStore";
import { formatPeriod, type Localized } from "@/lib/data/api";
import { getMissionById } from "@/lib/data/missions";
import { getCertifications } from "@/lib/data/certifications";
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
  /** Nested detail points under this bullet. */
  sub?: string[];
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
  /** Visible text for `url`, e.g. "Ver en Credly". */
  linkLabel?: string;
  /** Render targets where `url` is shown; omitted = everywhere. */
  linkTargets?: CvRenderTarget[];
  folio?: string;
}

export type CvRenderTarget = "web" | "pdf";

/** Whether a cert's link should render on the given target. */
export function showCertLink(c: CvCertItem, target: CvRenderTarget): boolean {
  return !!c.url && (!c.linkTargets || c.linkTargets.includes(target));
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

/** Compact, defendable skill groups for the one-page CV (standard names, no levels). */
const SKILL_GROUPS: { label: Localized; items: string[] }[] = [
  { label: { es: "Lenguajes", en: "Languages" }, items: ["TypeScript", "JavaScript", "PHP", "Python", "SQL"] },
  { label: { es: "Frontend y mobile", en: "Frontend & mobile" }, items: ["Next.js", "React", "React Native", "Expo", "Vue.js", "Tailwind CSS", "Three.js", "Capacitor"] },
  { label: { es: "Backend", en: "Backend" }, items: ["Node.js", "WebSockets (ws, Socket.IO)", "Hono", "Laravel", "REST APIs", "Stripe"] },
  { label: { es: "Datos e integraciones", en: "Data & integrations" }, items: ["PostgreSQL", "MySQL", "Firebird (Microsip ERP)", "node-postgres (pg)", "PDO", "ZPL/TSPL"] },
  { label: { es: "Herramientas", en: "Tools" }, items: ["Git", "GitHub", "Docker", "Linux", "Vercel", "Cloudflare"] },
];

function skillGroups(locale: Locale): CvSkillGroup[] {
  return SKILL_GROUPS.map((g) => ({ label: g.label[locale], items: g.items }));
}

type Period = { mission: string; project?: string };
/** CV role copy is curated for one A4 page; dates always come from the API missions. */
interface CvRoleSpec {
  title: Localized;
  org: Localized;
  period: Period;
  bullets: { label?: Localized; text: Localized; sub?: Localized[] }[];
}

const L = (es: string, en: string): Localized => ({ es, en });

const ROLE_SPECS: CvRoleSpec[] = [
  {
    title: L("Desarrollador Full-Stack y Mobile", "Full-Stack & Mobile Developer"),
    org: L("Black Sheep Lab", "Black Sheep Lab"),
    period: { mission: "black-sheep" },
    bullets: [
      {
        label: L("Duplica", "Duplica"),
        text: L(
          "Desarrollé y publiqué en App Store y Google Play la app de capacitación para emprendedoras de venta directa, con una sola base de código para web, Android e iOS (Expo, React Native, API en Next.js y PostgreSQL); suma más de 1,200 usuarios registrados y 246 suscripciones activas.",
          "Built and shipped to the App Store and Google Play a training app for direct-sales entrepreneurs, with one codebase for web, Android, and iOS (Expo, React Native, Next.js API, PostgreSQL); it has 1,200+ registered users and 246 active subscriptions.",
        ),
        sub: [
          L(
            "Construí el aula, la comunidad con chat en tiempo real (servidor WebSocket propio con PostgreSQL LISTEN/NOTIFY) y el asistente con IA; integré Stripe (suscripciones, webhooks y conciliación) y la compresión multimedia.",
            "Built the classroom, the community with real-time chat (custom WebSocket server with PostgreSQL LISTEN/NOTIFY), and the AI assistant; integrated Stripe (subscriptions, webhooks, and reconciliation) and media compression.",
          ),
        ],
      },
      {
        label: L("Skool", "Skool"),
        text: L(
          "Implementé módulos de un LMS multiempresa en Next.js, TypeScript y PostgreSQL: autenticación y roles por empresa, cursos, certificados, SCORM y video; empaqueté la app móvil con Capacitor.",
          "Implemented modules of a multi-tenant LMS in Next.js, TypeScript, and PostgreSQL: per-company auth and roles, courses, certificates, SCORM, and video; packaged the mobile app with Capacitor.",
        ),
      },
      {
        label: L("KRKN WMS", "KRKN WMS"),
        text: L(
          "Construí el módulo de impresión de etiquetas en ZPL/TSPL para impresoras Zebra y Rongta, con una vista previa fiel a lo impreso, y trabajé en el layout del almacén sobre el ERP Microsip (Firebird), con sincronización en tiempo real por WebSockets.",
          "Built the ZPL/TSPL label printing module for Zebra and Rongta printers, with a preview that matches the printed output, and worked on the warehouse layout on the Microsip ERP (Firebird), with real-time sync over WebSockets.",
        ),
      },
      {
        label: L("Black Sync", "Black Sync"),
        text: L(
          "Desarrollé la integración multiempresa entre WhatsApp y el ERP Microsip (Firebird): catálogo, stock, clientes, carrito y pedidos por empresa.",
          "Developed the multi-tenant integration between WhatsApp and the Microsip ERP (Firebird): catalog, stock, customers, cart, and orders per company.",
        ),
      },
      {
        label: L("Otros proyectos", "Other projects"),
        text: L(
          "módulos de comunidad, eventos con boletos y membresías con tiempo real por Socket.IO (Red México Emprende) y una API de códigos postales con datos de SEPOMEX, tokens y documentación (CPMX).",
          "community, ticketed events, and membership modules with real-time Socket.IO (Red México Emprende) and a postal-code API built on SEPOMEX data with tokens and docs (CPMX).",
        ),
      },
    ],
  },
  {
    title: L("Desarrollador (educación dual)", "Developer (dual education program)"),
    org: L("Aerial Depot", "Aerial Depot"),
    period: { mission: "academia", project: "aerial-depot" },
    bullets: [
      {
        text: L(
          "Desarrollé en equipo el sistema de almacén de la empresa con Laravel, Vue.js y MySQL (productos, ubicaciones por rack, préstamo de herramienta, códigos QR y reportes PDF) y la vista 3D en Three.js para ubicar cada producto; se usó en la operación real.",
          "Built with a small team the company's warehouse system with Laravel, Vue.js, and MySQL (products, rack locations, tool loans, QR codes, PDF reports) and the Three.js 3D view to locate each product; it was used in daily operations.",
        ),
      },
    ],
  },
  {
    title: L("Desarrollador web", "Web Developer"),
    org: L("Freelance", "Freelance"),
    period: { mission: "freelance" },
    bullets: [
      {
        text: L(
          "Desarrollé el sitio corporativo de un despacho contable con Astro y Tailwind CSS, desplegado en Vercel.",
          "Built the corporate website for an accounting firm with Astro and Tailwind CSS, deployed on Vercel.",
        ),
      },
    ],
  },
];

function periodOf({ mission, project }: Period, locale: Locale): string {
  const m = getMissionById(mission);
  const p = project ? m?.subMissions.find((s) => s.id === project) : undefined;
  return formatPeriod(p?.period ?? m?.period, locale) ?? "";
}

function roles(locale: Locale): CvRole[] {
  return ROLE_SPECS.map((r) => ({
    title: r.title[locale],
    org: r.org[locale],
    period: periodOf(r.period, locale),
    bullets: r.bullets.map((b) => ({ label: b.label?.[locale] ?? "", text: b.text[locale], sub: b.sub?.map((x) => x[locale]) })),
    tech: [],
  }));
}

const ISSUER_LABEL: Record<string, string> = { Cisco: "Cisco Networking Academy" };

/**
 * A cert group links only to a verification platform with a public profile in the API socials
 * (today Credly): when every cert in the group is a badge on that host, link the profile itself.
 * Other issuer sites (e.g. RENAP for CONOCER) get no link.
 */
function verifiedLink(urls: (string | undefined)[], locale: Locale): Pick<CvCertItem, "url" | "linkLabel" | "linkTargets"> {
  for (const social of profileSnapshot.socials) {
    let host: string;
    try {
      host = new URL(social.url).host;
    } catch {
      continue;
    }
    if (urls.length > 0 && urls.every((u) => !!u && URL.canParse(u) && new URL(u).host === host)) {
      return { url: social.url, linkLabel: locale === "es" ? `Ver en ${social.title}` : `View on ${social.title}`, linkTargets: ["web"] };
    }
  }
  return {};
}

function certs(locale: Locale): CvCertItem[] {
  // One compact line per issuer: "Cisco Networking Academy: A, B, C (2023 – 2025)".
  const byIssuer = new Map<string, ReturnType<typeof getCertifications>>();
  for (const c of getCertifications(locale)) byIssuer.set(c.issuer, [...(byIssuer.get(c.issuer) ?? []), c]);
  return [...byIssuer].map(([issuer, list]) => {
    const years = [...new Set(list.map((c) => c.date.slice(-4)))].sort();
    return {
      title: ISSUER_LABEL[issuer] ?? issuer,
      org: list.map((c) => c.name).join(", "),
      date: years.length > 1 ? `${years[0]} – ${years[years.length - 1]}` : years[0]!,
      ...verifiedLink(list.map((c) => c.url), locale),
    };
  });
}

const COPY: Record<Locale, Omit<CvContent, "contact" | "roles" | "skillGroups" | "certs">> = {
  es: {
    legalName: "Gael Uribe",
    headline: "Desarrollador Full-Stack | Web, mobile e integraciones con ERP",
    summary:
      "Desarrollador full-stack en Black Sheep Lab: construyo y mantengo productos en producción, de la app móvil y la web al backend, con TypeScript, Next.js, React Native y PostgreSQL. Publiqué Duplica en App Store y Google Play y desarrollo integraciones con el ERP Microsip (Firebird).",
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
      { title: "Ingeniería en Tecnologías de la Información", org: "UPVM", period: "2023 – 2026" },
      { title: "Técnico en Programación", org: "CECyTEM Tultitlán", period: "2019 – 2022" },
    ],
    languages: ["Español: nativo", "Inglés: B1 (intermedio)"],
    ui: { back: "← Portafolio", download: "Descargar PDF", downloading: "Generando…", brandStamp: "G-DARKO / CV", available: "Disponible para nuevas oportunidades", techLabel: "Tecnologías" },
  },
  en: {
    legalName: "Gael Uribe",
    headline: "Full-Stack Developer | Web, mobile & ERP integrations",
    summary:
      "Full-stack developer at Black Sheep Lab: I build and maintain products in production, from mobile app and web to backend, with TypeScript, Next.js, React Native, and PostgreSQL. Shipped Duplica to the App Store and Google Play and build integrations with the Microsip ERP (Firebird).",
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
      { title: "Information Technology Engineering", org: "UPVM", period: "2023 – 2026" },
      { title: "Programming Technician", org: "CECyTEM Tultitlán", period: "2019 – 2022" },
    ],
    languages: ["Spanish: native", "English: B1 (intermediate)"],
    ui: { back: "← Portfolio", download: "Download PDF", downloading: "Generating…", brandStamp: "G-DARKO / CV", available: "Open to new opportunities", techLabel: "Tech" },
  },
};

export function getCvContent(locale: Locale): CvContent {
  const copy = COPY[locale] ?? COPY.es;
  return { ...copy, contact: getContactItems(), roles: roles(locale), skillGroups: skillGroups(locale), certs: certs(locale) };
}
