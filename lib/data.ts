export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  images: string[];
  video?: { type: "youtube"; src: string } | { type: "local"; src: string };
  repo?: string;
  tech: string[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  companyUrl?: string;
  date: string;
  description: string;
  tags: string[];
}

export interface Skill {
  name: string;
  icon: string;
}

export interface SkillCategory {
  title: string;
  skills: Skill[];
}

export interface Certification {
  title: string;
  org: string;
  date: string;
  link?: string;
  linkText?: string;
  folio?: string;
}

export const projects: Project[] = [
  {
    id: "aerial",
    title: "Sistema de Inventarios | AERIAL DEPOT",
    subtitle: "Educación Dual",
    description:
      "Aplicación web desarrollada con Laravel, Vue.js y MySQL, incluye visualización 3D del almacén mediante Three.js para facilitar la localización de productos.",
    images: ["/img/aerial/1.webp", "/img/aerial/2.webp", "/img/aerial/3.webp", "/img/aerial/4.webp", "/img/aerial/5.webp", "/img/aerial/6.webp"],
    video: { type: "youtube", src: "https://www.youtube.com/embed/pmJ6ysc6ByY" },
    tech: ["vue", "laravel", "tailwind", "flowbite", "mysql", "three", "sweetalert2"],
  },
  {
    id: "tienko",
    title: "Gestor de Ventas",
    subtitle: "Tienko",
    description:
      "Tienko, un sistema completo con registro de productos, ventas y reportes, desarrollado en Java con base de datos MySQL.",
    images: ["/img/tienko/1.webp", "/img/tienko/2.webp", "/img/tienko/3.webp", "/img/tienko/4.webp", "/img/tienko/5.webp"],
    repo: "https://github.com/G-Darko/Tienko",
    tech: ["java", "mysql"],
  },
  {
    id: "postUpvm",
    title: "Página de Postgrados | UPVM",
    subtitle: "Estancias I",
    description:
      "Esta página web fue desarrollada durante mis estancias en la UPVM. Utiliza HTML, CSS, JavaScript, PHP y MySQL para ofrecer una experiencia interactiva y funcional.",
    images: ["/img/postg/1.webp", "/img/postg/2.webp", "/img/postg/3.webp"],
    repo: "https://github.com/G-Darko/Postgrados_UPVM",
    tech: ["html", "css", "js", "php", "mysql", "sweetalert2"],
  },
  {
    id: "yiza",
    title: "YIZA | CECyTEM Tultitlán",
    subtitle: "Educación Dual",
    description:
      "YIZA es un E-Commerce simulado que incluye su propia base de datos, manual de usuario y panel de control. Desarrollado con HTML, PHP, JavaScript y CSS puro, este proyecto destaca por su funcionalidad y diseño.",
    images: ["/img/yiza/1.webp", "/img/yiza/2.webp", "/img/yiza/3.webp"],
    repo: "https://github.com/G-Darko/YIZA",
    tech: ["html", "css", "js", "php", "mysql", "sweetalert2"],
  },
];

export const experiences: ExperienceItem[] = [
  {
    id: "leamsi",
    role: "Desarrollador Freelance",
    company: "LEAMSI",
    companyUrl: "https://leamsisolucionescontables.com.mx/",
    date: "Julio 2025 - Agosto 2025",
    description:
      "Desarrollo de una página web corporativa para una contaduría utilizando Astro y Tailwind CSS. Responsable de la arquitectura front-end y la optimización de rendimiento.",
    tags: ["Astro", "Tailwind CSS", "JavaScript"],
  },
];

export const skillCategories: SkillCategory[] = [
  {
    title: "Frontend",
    skills: [
      { name: "HTML", icon: "html" },
      { name: "CSS", icon: "css" },
      { name: "JavaScript", icon: "js" },
      { name: "Vue.js", icon: "vue" },
      { name: "JQuery", icon: "jquery" },
      { name: "Tailwind CSS", icon: "tailwind" },
      { name: "Flowbite", icon: "flowbite" },
      { name: "Sweetalert2", icon: "sweetalert2" },
      { name: "Three.js", icon: "three" },
      { name: "Astro", icon: "astro" },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "PHP", icon: "php" },
      { name: "Laravel", icon: "laravel" },
      { name: "Java", icon: "java" },
    ],
  },
  {
    title: "Databases",
    skills: [
      { name: "MySQL", icon: "mysql" },
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "MongoDB", icon: "mongodb" },
    ],
  },
  {
    title: "Entorno",
    skills: [
      { name: "Git", icon: "git" },
      { name: "Github", icon: "github" },
      { name: "Windows", icon: "windows" },
      { name: "Terminal", icon: "terminal" },
      { name: "Linux", icon: "linux" },
      { name: "XAMPP", icon: "xampp" },
      { name: "Postman", icon: "postman" },
      { name: "VSC", icon: "vscode" },
      { name: "Sublime Text", icon: "sublime" },
    ],
  },
  {
    title: "Aprendiendo",
    skills: [
      { name: "Python", icon: "python" },
      { name: "TypeScript", icon: "typescript" },
      { name: "Node.js", icon: "nodejs" },
      { name: "Heroku", icon: "heroku" },
      { name: "Vercel", icon: "vercel" },
      { name: "Godot", icon: "godot" },
    ],
  },
];

export const certifications: Certification[] = [
  {
    title: "JavaScript Essentials 1",
    org: "Cisco - Netacad",
    date: "Julio 2025",
    link: "https://www.credly.com/badges/71c8ee70-2d13-423b-8873-961182d252c9",
    linkText: "Ver insignia en Credly",
  },
  {
    title: "Desarrollo de Codigo de Software",
    org: "CONOCER - EC0160",
    date: "Septiembre 2022",
    link: "https://conocer.gob.mx/RENAP/certificaciones",
    linkText: "Validar en RENAP",
    folio: "16955622",
  },
];
