export type MissionId = "black-sheep" | "freelance" | "academia";

export interface MissionPeriod {
  start: string;
  end: string;
}

export interface SubMission {
  id: string;
  i18nKey: string;
  techStack: string[];
  repoUrl?: string;
  liveUrl?: string;
  images?: string[];
  video?: string;
  contextTagKey?: string;
  period?: MissionPeriod;
  isMockup?: boolean;
}

export interface Mission {
  id: MissionId;
  i18nKey: string;
  icon: "Rocket" | "Briefcase" | "GraduationCap";
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
    icon: "Rocket",
    rank: "S",
    orgKey: "blackSheepOrg",
    period: { start: "2024", end: "Presente" },
    subMissions: [
      {
        id: "lms-skool",
        i18nKey: "lmsSkool",
        techStack: ["Next.js", "React", "Tailwind CSS", "PostgreSQL"],
        liveUrl: "https://skool.com.mx/",
        repoUrl: "https://github.com/Black-Sheep-Lab/Cursos",
        isMockup: true,
      },
      {
        id: "duplica-app",
        i18nKey: "duplicaApp",
        techStack: ["Expo", "React Native", "TypeScript", "Node.js", "AI"],
        liveUrl: "https://duplicamlm.app/landing",
        repoUrl: "https://github.com/Black-Sheep-Lab/UF",
        isMockup: true,
      },
      {
        id: "rnme-hub",
        i18nKey: "rnmeHub",
        techStack: ["Next.js", "React", "Tailwind", "PostgreSQL"],
        liveUrl: "https://www.redmexicoemprende.mx/",
        repoUrl: "https://github.com/Black-Sheep-Lab/RNME",
        isMockup: true,
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
        i18nKey: "leamsi",
        techStack: ["Astro", "Tailwind CSS", "JavaScript"],
        liveUrl: "https://leamsisolucionescontables.com.mx/",
        repoUrl: "https://github.com/G-Darko/leamsi-astro",
        period: { start: "Jul 2025", end: "Ago 2025" },
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
        i18nKey: "aerialDepot",
        techStack: ["Vue", "Laravel", "Three.js", "MySQL", "Tailwind"],
        contextTagKey: "dualEducation",
        images: [
          "img/aerial/2.webp",
          "img/aerial/1.webp",
          "img/aerial/3.webp",
          "img/aerial/4.webp",
          "img/aerial/5.webp",
          "img/aerial/6.webp",
        ],
        video: "https://www.youtube.com/embed/pmJ6ysc6ByY",
      },
      {
        id: "tienko",
        i18nKey: "tienko",
        techStack: ["Java", "MySQL"],
        repoUrl: "https://github.com/G-Darko/Tienko",
        images: [
          "img/tienko/3.webp",
          "img/tienko/1.webp",
          "img/tienko/2.webp",
          "img/tienko/4.webp",
          "img/tienko/5.webp",
        ],
      },
      {
        id: "postgrados-upvm",
        i18nKey: "postgradosUpvm",
        techStack: ["HTML", "CSS", "JS", "PHP", "MySQL"],
        contextTagKey: "internshipI",
        repoUrl: "https://github.com/G-Darko/Postgrados_UPVM",
        images: ["img/postg/1.webp", "img/postg/2.webp", "img/postg/3.webp"],
      },
      {
        id: "yiza",
        i18nKey: "yiza",
        techStack: ["HTML", "CSS", "JS", "PHP", "MySQL"],
        contextTagKey: "dualEducation",
        repoUrl: "https://github.com/G-Darko/YIZA",
        images: ["img/yiza/1.webp", "img/yiza/2.webp", "img/yiza/3.webp"],
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
