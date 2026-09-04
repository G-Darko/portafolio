import type { Locale } from "@/lib/store/useLocaleStore";
import {
  CONTACT_EMAIL,
  GITHUB_LABEL,
  GITHUB_URL,
  PHONE,
  SITE_LABEL,
  SITE_URL,
} from "@/lib/data/profile";

/** Curated CV highlights — not a live mirror of missions/skills. */

export interface CvBullet {
  label: string;
  text: string;
}

export interface CvPrimaryRole {
  title: string;
  org: string;
  period: string;
  summary: string;
  bullets: CvBullet[];
  tech: string[];
}

export interface CvPriorRole {
  title: string;
  org: string;
  period: string;
  description: string;
  tech: string[];
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

export interface CvSkillGroup {
  label: string;
  items: string[];
}

export interface CvContent {
  legalName: string;
  role: string;
  blurb: string;
  backLabel: string;
  downloadLabel: string;
  downloadingLabel: string;
  brandStamp: string;
  experienceTitle: string;
  priorTitle: string;
  primaryRole: CvPrimaryRole;
  priorRoles: CvPriorRole[];
  skillsTitle: string;
  skillGroups: CvSkillGroup[];
  educationTitle: string;
  education: CvEducationItem[];
  certsTitle: string;
  certs: CvCertItem[];
  contactTitle: string;
  softSkillsTitle: string;
  softSkills: string[];
  languagesTitle: string;
  languages: string[];
  /** Screen-only availability chip; omitted from PDF. */
  availableLabel: string;
  contact: {
    email: string;
    phone: string;
    site: string;
    siteUrl: string;
    github: string;
    githubUrl: string;
  };
}

const sharedContact = {
  email: CONTACT_EMAIL,
  phone: PHONE,
  site: SITE_LABEL,
  siteUrl: SITE_URL,
  github: GITHUB_LABEL,
  githubUrl: GITHUB_URL,
};

const cvByLocale: Record<Locale, CvContent> = {
  es: {
    legalName: "Isaac Gael Uribe Ortiz",
    role: "Desarrollador de Software y Web",
    blurb:
      "Ingeniero en Tecnologías de la Información. Construyo productos web y móviles reales — SaaS, white-label y puentes a sistemas legacy — con foco en ownership, stack moderno y entrega clara.",
    backLabel: "← Portafolio",
    downloadLabel: "Descargar PDF",
    downloadingLabel: "Generando…",
    brandStamp: "G-DARKO / CV",
    experienceTitle: "Experiencia",
    priorTitle: "Experiencia previa",
    primaryRole: {
      title: "Desarrollador Full-Stack & Mobile",
      org: "Black Sheep Lab",
      period: "Oct 2025 – Presente",
      summary:
        "Ownership técnico end-to-end en productos del lab: LMS multi-empresa, apps white-label, integraciones WhatsApp/ERP y herramientas de almacén sobre stacks modernos y legacy.",
      bullets: [
        {
          label: "Skool (LMS multi-tenant)",
          text: "Arquitectura multi-inquilino para múltiples organizaciones, con autenticación, roles y PostgreSQL; ownership full-stack en Next.js y TypeScript.",
        },
        {
          label: "Duplica & CRESER",
          text: "Duplica es la app móvil/web más grande que he construido (Expo/React Native, publicada en Play Store). CRESER v1.0.0 es su white-label: mismo núcleo de producto, branding y despliegue por cliente.",
        },
        {
          label: "OmniSIP",
          text: "Integración Respond.io API + Microsip ERP para flujos de WhatsApp y sincronización con sistemas empresariales legacy.",
        },
        {
          label: "KRKN - WMS",
          text: "Layouts de almacén sobre Firebird e impresión de etiquetas ZPL/TSPL para operación en piso.",
        },
      ],
      tech: [
        "TypeScript",
        "Next.js",
        "Expo",
        "PostgreSQL",
        "Firebird",
        "Respond.io",
        "Vercel",
      ],
    },
    priorRoles: [
      {
        title: "Desarrollador web",
        org: "Freelance",
        period: "Jul 2025 – Ago 2025",
        description:
          "Landing y sitio de servicios con Astro, Tailwind CSS y JavaScript, desplegado en Vercel.",
        tech: ["Astro", "Tailwind CSS", "JavaScript"],
      },
      {
        title: "Educación dual — Aerial Depot",
        org: "Academia / Dual",
        period: "2023 – 2025",
        description:
          "Sistema de inventarios con visualización 3D del almacén para localizar productos (Laravel, Vue.js, Three.js, MySQL).",
        tech: ["Laravel", "Vue.js", "Three.js", "MySQL"],
      },
      {
        title: "Estancias UPVM",
        org: "Universidad Politécnica del Valle de México",
        period: "2022 – 2024",
        description:
          "Sitios y sistemas académicos (Posgrados UPVM, e-commerce dual) con PHP, MySQL, HTML/CSS/JS; también gestor de ventas en Java.",
        tech: ["PHP", "MySQL", "Java", "HTML5"],
      },
    ],
    skillsTitle: "Habilidades",
    skillGroups: [
      {
        label: "Frontend",
        items: ["TypeScript", "Next.js", "React", "Vue.js", "Tailwind CSS"],
      },
      {
        label: "Backend",
        items: ["Node.js", "Laravel", "PHP", "Python", "PostgreSQL", "Firebird"],
      },
      {
        label: "Mobile / 3D",
        items: ["Expo", "React Native", "Three.js"],
      },
      {
        label: "Herramientas",
        items: [
          "Git",
          "Linux",
          "Docker",
          "Vercel",
          "Cursor",
          "AI SDKs / LLM APIs",
        ],
      },
    ],
    educationTitle: "Formación",
    education: [
      {
        title: "Ingeniería en Tecnologías de la Información",
        org: "Universidad Politécnica del Valle de México (UPVM)",
        period: "2023 – 2026",
      },
      {
        title: "Técnico en Programación",
        org: "CECyTEM Tultitlán",
        period: "2019 – 2022",
      },
    ],
    certsTitle: "Certificaciones",
    certs: [
      {
        title: "Desarrollo de Código de Software (EC0160)",
        org: "CONOCER",
        date: "Sep 2022",
        folio: "(D-00)16955622",
        url: "https://conocer.gob.mx/RENAP/certificaciones",
      },
      {
        title: "JavaScript Essentials 1",
        org: "Cisco Netacad / Credly",
        date: "Jul 2025",
        url: "https://www.credly.com/users/g-darko",
      },
    ],
    contactTitle: "Contacto",
    softSkillsTitle: "Enfoque de producto",
    softSkills: [
      "Ownership end-to-end",
      "Integración de sistemas legacy y modernos",
      "Autonomía y resolución de problemas complejos",
    ],
    languagesTitle: "Idiomas",
    languages: ["Español — Nativo", "Inglés — Intermedio (B1)"],
    availableLabel: "Disponible para nuevas oportunidades",
    contact: sharedContact,
  },
  en: {
    legalName: "Isaac Gael Uribe Ortiz",
    role: "Software and Web Developer",
    blurb:
      "Information Technology Engineer. I ship real web and mobile products — SaaS, white-label, and bridges to legacy systems — with ownership, a modern stack, and clear delivery.",
    backLabel: "← Portfolio",
    downloadLabel: "Download PDF",
    downloadingLabel: "Generating…",
    brandStamp: "G-DARKO / CV",
    experienceTitle: "Experience",
    priorTitle: "Earlier experience",
    primaryRole: {
      title: "Full-Stack & Mobile Developer",
      org: "Black Sheep Lab",
      period: "Oct 2025 – Present",
      summary:
        "End-to-end technical ownership across lab products: multi-company LMS, white-label apps, WhatsApp/ERP integrations, and warehouse tooling on modern and legacy stacks.",
      bullets: [
        {
          label: "Skool (multi-tenant LMS)",
          text: "Multi-tenant architecture for multiple organizations with auth, roles, and PostgreSQL; full-stack ownership in Next.js and TypeScript.",
        },
        {
          label: "Duplica & CRESER",
          text: "Duplica is the largest product I’ve built (Expo/React Native mobile + web, published on the Play Store). CRESER v1.0.0 is its white-label: same product core, client branding and deployment.",
        },
        {
          label: "KRKN / OmniSIP",
          text: "Respond.io API + Microsip ERP integration for WhatsApp workflows and sync with legacy enterprise systems.",
        },
        {
          label: "WMS / labels (KRKN)",
          text: "Warehouse layouts on Firebird and ZPL/TSPL label printing for floor operations.",
        },
      ],
      tech: [
        "TypeScript",
        "Next.js",
        "Expo",
        "PostgreSQL",
        "Firebird",
        "Respond.io",
        "Vercel",
      ],
    },
    priorRoles: [
      {
        title: "Web developer",
        org: "Freelance",
        period: "Jul 2025 – Aug 2025",
        description:
          "Services landing and site with Astro, Tailwind CSS, and JavaScript, deployed on Vercel.",
        tech: ["Astro", "Tailwind CSS", "JavaScript"],
      },
      {
        title: "Dual education — Aerial Depot",
        org: "Academia / Dual",
        period: "2023 – 2025",
        description:
          "Inventory system with 3D warehouse visualization to locate products (Laravel, Vue.js, Three.js, MySQL).",
        tech: ["Laravel", "Vue.js", "Three.js", "MySQL"],
      },
      {
        title: "UPVM internships",
        org: "Universidad Politécnica del Valle de México",
        period: "2022 – 2024",
        description:
          "Academic sites and systems (UPVM graduate pages, dual e-commerce) with PHP, MySQL, HTML/CSS/JS; plus a Java sales manager.",
        tech: ["PHP", "MySQL", "Java", "HTML5"],
      },
    ],
    skillsTitle: "Skills",
    skillGroups: [
      {
        label: "Frontend",
        items: ["TypeScript", "Next.js", "React", "Vue.js", "Tailwind CSS"],
      },
      {
        label: "Backend",
        items: ["Node.js", "Laravel", "PHP", "Python", "PostgreSQL", "Firebird"],
      },
      {
        label: "Mobile / 3D",
        items: ["Expo", "React Native", "Three.js"],
      },
      {
        label: "Tools",
        items: [
          "Git",
          "Linux",
          "Docker",
          "Vercel",
          "Cursor",
          "AI SDKs / LLM APIs",
        ],
      },
    ],
    educationTitle: "Education",
    education: [
      {
        title: "B.S. Information Technology Engineering",
        org: "Universidad Politécnica del Valle de México (UPVM)",
        period: "2023 – Present",
      },
      {
        title: "Programming Technician",
        org: "CECyTEM Tultitlán",
        period: "2019 – 2022",
      },
    ],
    certsTitle: "Certifications",
    certs: [
      {
        title: "Software Code Development (EC0160)",
        org: "CONOCER",
        date: "Sep 2022",
        folio: "(D-00)16955622",
        url: "https://conocer.gob.mx/RENAP/certificaciones",
      },
      {
        title: "JavaScript Essentials 1",
        org: "Cisco Netacad / Credly",
        date: "Jul 2025",
        url: "https://www.credly.com/users/g-darko",
      },
    ],
    contactTitle: "Contact",
    softSkillsTitle: "Product focus",
    softSkills: [
      "End-to-end ownership",
      "Legacy and modern systems integration",
      "Autonomy and complex problem solving",
    ],
    languagesTitle: "Languages",
    languages: ["Spanish — Native", "English — Intermediate (B1)"],
    availableLabel: "Open to new opportunities",
    contact: sharedContact,
  },
};

export function getCvContent(locale: Locale): CvContent {
  return cvByLocale[locale] ?? cvByLocale.es;
}
