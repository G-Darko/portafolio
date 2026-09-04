export type MissionId = "black-sheep" | "freelance" | "academia";

export interface MissionPeriod {
  start: string;
  end: string;
}

export interface SubMission {
  id: string;
  /** URL segment under `/missions/{org}/{slug}/` */
  slug: string;
  i18nKey: string;
  techStack: string[];
  repoUrl?: string;
  liveUrl?: string;
  playStoreUrl?: string;
  appStoreUrl?: string;
  /** Extra demo/tenant URL (e.g. Skool @ Fyttsa) */
  tenantUrl?: string;
  images?: string[];
  video?: string;
  contextTagKey?: string;
  period?: MissionPeriod;
  isMockup?: boolean;
}

export interface Mission {
  id: MissionId;
  i18nKey: string;
  icon: "Sheep" | "Briefcase" | "GraduationCap";
  rank: "S" | "A" | "B" | "C";
  orgKey: string;
  roleKey?: string;
  period?: MissionPeriod;
  subMissions: SubMission[];
}

export const missions: Mission[] = [
  {
    id: "black-sheep",
    i18nKey: "blackSheep",
    icon: "Sheep",
    rank: "S",
    orgKey: "blackSheepOrg",
    period: { start: "Oct 2025", end: "Presente" },
    subMissions: [
      {
        id: "lms-skool",
        slug: "skool",
        i18nKey: "lmsSkool",
        techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "PostgreSQL", "Capacitor"],
        liveUrl: "https://skool.com.mx/",
        tenantUrl: "https://universidadfyttsa.com/login",
        contextTagKey: "fullOwnership",
        period: { start: "Dic 2025", end: "Abr 2026" },
        video: "/video/skool/tour.webm",
        images: [
          "/img/skool/app-dashboard.webp",
          "/img/skool/app-cursos.webp",
          "/img/skool/app-curso-contenido.webp",
          "/img/skool/app-gestion.webp",
          "/img/skool/app-usuarios.webp",
          "/img/skool/app-reportes.webp",
          "/img/skool/app-certificados.webp",
          "/img/skool/app-perfil.webp",
          "/img/skool/1.webp",
          "/img/skool/2.webp",
        ],
      },
      {
        id: "duplica-app",
        slug: "duplica",
        i18nKey: "duplicaApp",
        techStack: ["Next.js", "Expo", "React Native", "TypeScript", "PostgreSQL", "AI"],
        liveUrl: "https://duplicamlm.app/",
        playStoreUrl: "https://play.google.com/store/apps/details?id=com.blacksheep.duplica",
        appStoreUrl: "https://apps.apple.com/mx/app/duplica/id6763321394",
        contextTagKey: "fullOwnership",
        period: { start: "Feb 2026", end: "Presente" },
        images: [
          "/img/duplica/1.webp",
          "/img/duplica/play.webp",
          "/img/duplica/appstore.webp",
          "/img/duplica/app-home.webp",
          "/img/duplica/app-classroom.webp",
          "/img/duplica/app-ai.webp",
          "/img/duplica/app-community.webp",
          "/img/duplica/app-admin.webp",
        ],
        video: "/video/duplica/tour.webm",
      },
      {
        id: "creser",
        slug: "creser",
        i18nKey: "creser",
        techStack: ["Next.js", "Expo", "React Native", "TypeScript", "PostgreSQL"],
        liveUrl: "https://creser.app/",
        playStoreUrl: "https://play.google.com/store/apps/details?id=com.blacksheep.creser",
        appStoreUrl: "https://apps.apple.com/mx/app/creser/id6798448568",
        contextTagKey: "whiteLabel",
        period: { start: "Ago 2026", end: "Presente" },
        images: [
          "/img/creser/1.webp",
          "/img/creser/play.webp",
          "/img/creser/appstore.webp",
          "/img/creser/app-home.webp",
          "/img/creser/app-classroom.webp",
          "/img/creser/app-ai.webp",
          "/img/creser/app-community.webp",
          "/img/creser/app-admin.webp",
        ],
        video: "/video/creser/tour.webm",
      },
      {
        id: "rnme-hub",
        slug: "rnme",
        i18nKey: "rnmeHub",
        techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "PostgreSQL", "Socket.IO"],
        liveUrl: "https://www.redmexicoemprende.mx/",
        contextTagKey: "keyModules",
        period: { start: "Oct 2025", end: "Abr 2026" },
        images: [
          "/img/rnme/app-comunidad.webp",
          "/img/rnme/app-comunidad-miembros.webp",
          "/img/rnme/app-comunidad-chat.webp",
          "/img/rnme/app-admin.webp",
          "/img/rnme/app-eventos.webp",
          "/img/rnme/1.webp",
          "/img/rnme/2.webp",
          "/img/rnme/3.webp",
          "/img/rnme/4.webp",
        ],
        video: "/video/rnme/tour.webm",
      },
      {
        id: "krkn",
        slug: "krkn",
        i18nKey: "krkn",
        techStack: ["Next.js", "TypeScript", "PHP", "Firebird", "Python", "FastAPI"],
        liveUrl: "https://krkn.mx/",
        tenantUrl: "https://fyttsa.krkn.mx/",
        contextTagKey: "keyModules",
        period: { start: "Feb 2026", end: "Jul 2026" },
        images: [
          "/img/krkn/1.webp",
          "/img/krkn/2.webp",
          "/img/krkn/3.webp",
          "/img/krkn/fyttsa.webp",
          "/img/krkn/app-etiquetado.webp",
          "/img/krkn/app-layout.webp",
          "/img/krkn/app-embarques-mapa.webp",
          "/img/krkn/app-quiebres.webp",
          "/img/krkn/app-sesiones-microsip.webp",
          "/img/krkn/app-auditoria-dml.webp",
        ],
        video: "/video/krkn/tour.webm",
      },
      {
        id: "cpmx",
        slug: "cpmx",
        i18nKey: "cpmx",
        techStack: ["Next.js", "TypeScript", "PostgreSQL", "GeoJSON", "NextAuth"],
        contextTagKey: "microservice",
        period: { start: "Jun 2026", end: "Jun 2026" },
        liveUrl: "https://cpmx.blck-sheep.com/",
        images: [
          "/img/cpmx/1.webp",
          "/img/cpmx/app-dashboard.webp",
          "/img/cpmx/app-catalogo.webp",
          "/img/cpmx/app-mapa.webp",
          "/img/cpmx/app-tokens.webp",
          "/img/cpmx/app-usuarios.webp",
        ],
        video: "/video/cpmx/tour.webm",
      },
      {
        id: "omnisip",
        slug: "omnisip",
        i18nKey: "omnisip",
        techStack: ["Next.js", "TypeScript", "PostgreSQL", "Firebird", "respond.io"],
        liveUrl: "https://omnisip.blck-sheep.com/",
        contextTagKey: "microservice",
        period: { start: "Ago 2026", end: "Presente" },
        images: [
          "/img/omnisip/1.webp",
          "/img/omnisip/app-admin.webp",
          "/img/omnisip/app-integracion.webp",
          "/img/omnisip/app-conversaciones.webp",
        ],
        video: "/video/omnisip/tour.webm",
      },
    ],
  },
  {
    id: "freelance",
    i18nKey: "freelance",
    icon: "Briefcase",
    rank: "A",
    orgKey: "freelanceOrg",
    roleKey: "freelanceRole",
    period: { start: "Jul 2025", end: "Ago 2025" },
    subMissions: [
      {
        id: "leamsi",
        slug: "leamsi",
        i18nKey: "leamsi",
        techStack: ["Astro", "Tailwind CSS", "JavaScript"],
        liveUrl: "https://leamsi.vercel.app/",
        contextTagKey: "landingPage",
        period: { start: "Jul 2025", end: "Ago 2025" },
        images: [
          "/img/leamsi/app-home.webp",
          "/img/leamsi/app-acerca.webp",
          "/img/leamsi/app-servicios.webp",
          "/img/leamsi/app-contacto.webp",
        ],
        video: "/video/leamsi/tour.webm",
      },
    ],
  },
  {
    id: "academia",
    i18nKey: "academia",
    icon: "GraduationCap",
    rank: "B",
    orgKey: "academiaOrg",
    period: { start: "2021", end: "2025" },
    subMissions: [
      {
        id: "aerial-depot",
        slug: "aerial-depot",
        i18nKey: "aerialDepot",
        techStack: ["Vue.js", "Laravel", "Three.js", "MySQL", "Tailwind CSS"],
        contextTagKey: "dualEducation",
        images: [
          "/img/aerial/2.webp",
          "/img/aerial/1.webp",
          "/img/aerial/3.webp",
          "/img/aerial/4.webp",
          "/img/aerial/5.webp",
          "/img/aerial/6.webp",
        ],
        video: "https://www.youtube.com/embed/pmJ6ysc6ByY",
      },
      {
        id: "tienko",
        slug: "tienko",
        i18nKey: "tienko",
        techStack: ["Java", "MySQL"],
        repoUrl: "https://github.com/G-Darko/Tienko",
        images: [
          "/img/tienko/3.webp",
          "/img/tienko/1.webp",
          "/img/tienko/2.webp",
          "/img/tienko/4.webp",
          "/img/tienko/5.webp",
        ],
      },
      {
        id: "postgrados-upvm",
        slug: "postgrados",
        i18nKey: "postgradosUpvm",
        techStack: ["HTML5", "CSS3", "JavaScript", "PHP", "MySQL"],
        contextTagKey: "internshipI",
        repoUrl: "https://github.com/G-Darko/Postgrados_UPVM",
        images: ["/img/postg/1.webp", "/img/postg/2.webp", "/img/postg/3.webp"],
      },
      {
        id: "yiza",
        slug: "yiza",
        i18nKey: "yiza",
        techStack: ["HTML5", "CSS3", "JavaScript", "PHP", "MySQL"],
        contextTagKey: "dualEducation",
        repoUrl: "https://github.com/G-Darko/YIZA",
        images: ["/img/yiza/1.webp", "/img/yiza/2.webp", "/img/yiza/3.webp"],
      },
    ],
  },
];

export const totalSubmissions = missions.reduce(
  (acc, m) => acc + m.subMissions.length,
  0
);

export type TechCategory =
  | "frontend"
  | "backend"
  | "mobile"
  | "database"
  | "graphics"
  | "tools"
  | "game";

export const techStackCatalog: { name: string; category: TechCategory; iconId: string }[] = [
  { name: "Next.js", category: "frontend", iconId: "nextjs" },
  { name: "React", category: "frontend", iconId: "react" },
  { name: "Vue.js", category: "frontend", iconId: "vue" },
  { name: "Astro", category: "frontend", iconId: "astro" },
  { name: "HTML5", category: "frontend", iconId: "html" },
  { name: "CSS3", category: "frontend", iconId: "css" },
  { name: "Tailwind CSS", category: "frontend", iconId: "tail" },
  { name: "JavaScript", category: "frontend", iconId: "js" },
  { name: "TypeScript", category: "frontend", iconId: "ts" },
  { name: "Expo", category: "mobile", iconId: "react" },
  { name: "React Native", category: "mobile", iconId: "react" },
  { name: "Laravel", category: "backend", iconId: "laravel" },
  { name: "PHP", category: "backend", iconId: "php" },
  { name: "Java", category: "backend", iconId: "java" },
  { name: "Node.js", category: "backend", iconId: "node" },
  { name: "Python", category: "backend", iconId: "py" },
  { name: "MySQL", category: "database", iconId: "mysql" },
  { name: "PostgreSQL", category: "database", iconId: "postsql" },
  { name: "MongoDB", category: "database", iconId: "mongo" },
  { name: "Three.js", category: "graphics", iconId: "three" },
  { name: "Git", category: "tools", iconId: "git" },
  { name: "Linux", category: "tools", iconId: "linux" },
  { name: "Vercel", category: "tools", iconId: "vercel" },
  { name: "Docker", category: "tools", iconId: "docker" },
];

export function getMissionById(id: string): Mission | undefined {
  return missions.find((m) => m.id === id);
}

export function getSubMission(missionId: string, subId: string): SubMission | undefined {
  const mission = getMissionById(missionId);
  return mission?.subMissions.find((s) => s.id === subId);
}

export function getSubMissionBySlug(
  missionId: string,
  slug: string
): SubMission | undefined {
  const mission = getMissionById(missionId);
  return mission?.subMissions.find((s) => s.slug === slug || s.id === slug);
}

export function getProjectSlug(sm: SubMission): string {
  return sm.slug;
}

export function listMissionProjectParams(): { missionId: string; projectId: string }[] {
  return missions.flatMap((m) =>
    m.subMissions.map((sm) => ({ missionId: m.id, projectId: sm.slug }))
  );
}
