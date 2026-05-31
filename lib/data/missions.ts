export interface SubMission {
  id: string;
  title: string;
  tagline: string;
  techStack: string[];
  repoUrl?: string;
  liveUrl?: string;
  description: string;
}

export interface Mission {
  id: "black-sheep" | "freelance" | "academia";
  title: string;
  codename: string;
  icon: string;
  description: string;
  org: string;
  rank: "S" | "A" | "B" | "C";
  subMissions: SubMission[];
}

export const missions: Mission[] = [
  {
    id: "black-sheep",
    title: "Black Sheep Lab",
    codename: "OPERATION: SAAS",
    icon: "Rocket",
    org: "Black Sheep Lab — SaaS e Innovación",
    rank: "S",
    description:
      "Innovación en tecnología educativa, comunidad empresarial y aplicaciones móviles con IA y gamificación.",
    subMissions: [
      {
        id: "lms-skool",
        title: "LMS Skool",
        tagline: "Plataforma educativa SaaS",
        description:
          "Plataforma LMS desarrollada en Next.js con integraciones visuales e interactivas. Permite la gestión de cursos, estudiantes y contenido multimedia en tiempo real.",
        techStack: ["Next.js", "React", "Tailwind CSS", "PostgreSQL"],
        liveUrl: "https://skool.com.mx/",
        repoUrl: "https://github.com/Black-Sheep-Lab/Cursos",
      },
      {
        id: "duplica-app",
        title: "Duplica App",
        tagline: "App móvil con IA y gamificación",
        description:
          "Mobile App en Expo/React Native con IA para generación de promociones, gamificación de diamantes y experiencia, retos diarios y comunidad. Publicada en Play Store.",
        techStack: ["Expo", "React Native", "TypeScript", "Node.js", "AI"],
        liveUrl: "https://duplicamlm.app/landing",
        repoUrl: "https://github.com/Black-Sheep-Lab/UF",
      },
      {
        id: "rnme-hub",
        title: "RNME Hub",
        tagline: "Comunidad empresarial",
        description:
          "Landing page y comunidad tipo Facebook para empresarios con Rich Text Editor para blogs. Desarrollada en Next.js con sistema de publicaciones y perfiles.",
        techStack: ["Next.js", "React", "Tailwind", "Tiptap", "PostgreSQL"],
        liveUrl: "https://www.redmexicoemprende.mx/",
        repoUrl: "https://github.com/Black-Sheep-Lab/RNME",
      },
    ],
  },
  {
    id: "freelance",
    title: "Freelance",
    codename: "OPERATION: CONTRACT",
    icon: "Briefcase",
    org: "Indie — Soluciones a Medida",
    rank: "A",
    description:
      "Desarrollo de soluciones web corporativas con enfoque en rendimiento y diseño adaptado a cada cliente.",
    subMissions: [
      {
        id: "leamsi",
        title: "Página Corporativa LEAMSI",
        tagline: "Web corporativa para contaduría",
        description:
          "Desarrollo de una página web corporativa para una contaduría utilizando Astro y Tailwind CSS. Responsable de la arquitectura front-end y la optimización de rendimiento.",
        techStack: ["Astro", "Tailwind CSS", "JavaScript"],
        liveUrl: "https://leamsisolucionescontables.com.mx/",
        repoUrl: "https://github.com/G-Darko/leamsi-astro",
      },
    ],
  },
  {
    id: "academia",
    title: "Academia / Estadías",
    codename: "OPERATION: BOOTCAMP",
    icon: "GraduationCap",
    org: "UPVM / CECyTEM Tultitlán",
    rank: "B",
    description:
      "Proyectos de desarrollo durante la educación dual y estancias profesionales. De la universidad a producción real.",
    subMissions: [
      {
        id: "aerial-depot",
        title: "Sistema de Inventarios | AERIAL DEPOT",
        tagline: "Visualización 3D del almacén",
        description:
          "Aplicación web desarrollada con Laravel, Vue.js y MySQL, incluye visualización 3D del almacén mediante Three.js para facilitar la localización de productos.",
        techStack: ["Vue", "Laravel", "Three.js", "MySQL", "Tailwind"],
      },
      {
        id: "tienko",
        title: "Gestor de Ventas | Tienko",
        tagline: "Sistema de ventas con Java",
        description:
          "Sistema completo con registro de productos, ventas y reportes, desarrollado en Java con base de datos MySQL.",
        techStack: ["Java", "MySQL"],
        repoUrl: "https://github.com/G-Darko/Tienko",
      },
      {
        id: "postgrados-upvm",
        title: "Página de Postgrados | UPVM",
        tagline: "Sitio web institucional",
        description:
          "Sitio web informativo para los aspirantes y estudiantes de postgrados de la UPVM, desarrollada con HTML, CSS, JS, PHP y MySQL.",
        techStack: ["HTML", "CSS", "JS", "PHP", "MySQL"],
        repoUrl: "https://github.com/G-Darko/Postgrados_UPVM",
      },
      {
        id: "yiza",
        title: "YIZA | CECyTEM Tultitlán",
        tagline: "E-Commerce educativo",
        description:
          "E-Commerce simulado con propia base de datos, manual de usuario y panel de control. Desarrollado con HTML, PHP, JavaScript y CSS puro.",
        techStack: ["HTML", "CSS", "JS", "PHP", "MySQL"],
        repoUrl: "https://github.com/G-Darko/YIZA",
      },
    ],
  },
];

export const totalSubmissions = missions.reduce(
  (acc, m) => acc + m.subMissions.length,
  0
);

export const techStack = [
  { name: "Next.js", category: "frontend" as const },
  { name: "React", category: "frontend" as const },
  { name: "Vue.js", category: "frontend" as const },
  { name: "Astro", category: "frontend" as const },
  { name: "HTML5", category: "frontend" as const },
  { name: "CSS3", category: "frontend" as const },
  { name: "Tailwind CSS", category: "frontend" as const },
  { name: "JavaScript", category: "frontend" as const },
  { name: "TypeScript", category: "frontend" as const },
  { name: "Expo", category: "mobile" as const },
  { name: "React Native", category: "mobile" as const },
  { name: "Laravel", category: "backend" as const },
  { name: "PHP", category: "backend" as const },
  { name: "Java", category: "backend" as const },
  { name: "Node.js", category: "backend" as const },
  { name: "Python", category: "backend" as const },
  { name: "MySQL", category: "database" as const },
  { name: "PostgreSQL", category: "database" as const },
  { name: "MongoDB", category: "database" as const },
  { name: "Three.js", category: "graphics" as const },
  { name: "Web Audio", category: "graphics" as const },
  { name: "Git", category: "tools" as const },
  { name: "Linux", category: "tools" as const },
  { name: "Vercel", category: "tools" as const },
  { name: "Godot", category: "game" as const },
];
