/** Canonical display name for mission/CV tech labels (aliases → catalog name). */
export const TECH_ALIASES: Record<string, string> = {
  HTML: "HTML5",
  CSS: "CSS3",
  JS: "JavaScript",
  Vue: "Vue.js",
  Tailwind: "Tailwind CSS",
};

/**
 * Maps mission techStack labels to TechIconsSprite / TechSphere node ids.
 * Do not map non-language tools onto language icons (e.g. Capacitor → js).
 * Unknown / unmapped labels are omitted from orb highlights.
 */
export const TECH_NAME_TO_ID: Record<string, string> = {
  HTML: "html",
  HTML5: "html",
  CSS: "css",
  CSS3: "css",
  JavaScript: "js",
  JS: "js",
  TypeScript: "ts",
  PHP: "php",
  Python: "py",
  Java: "java",
  "Node.js": "node",
  React: "react",
  "Next.js": "nextjs",
  "Vue.js": "vue",
  Vue: "vue",
  Astro: "astro",
  Laravel: "laravel",
  "Tailwind CSS": "tail",
  Tailwind: "tail",
  jQuery: "jquery",
  "Three.js": "three",
  MySQL: "mysql",
  PostgreSQL: "postsql",
  MongoDB: "mongo",
  Git: "git",
  GitHub: "github",
  Linux: "linux",
  Docker: "docker",
  Vite: "vite",
  Vercel: "vercel",
  Heroku: "heroku",
  Sass: "sass",
  Postman: "postman",
  "VS Code": "vsc",
  Expo: "react",
  "React Native": "react",
  AI: "py",
  IA: "py",
  "Socket.IO": "node",
  Firebird: "mysql",
  FastAPI: "py",
  NextAuth: "nextjs",
  "respond.io": "node",
};

export function canonicalizeTechName(name: string): string {
  return TECH_ALIASES[name] ?? name;
}

export function techStackToIds(stack: string[]): string[] {
  const ids = new Set<string>();
  for (const name of stack) {
    const canonical = canonicalizeTechName(name);
    const id = TECH_NAME_TO_ID[canonical] ?? TECH_NAME_TO_ID[name];
    if (id) ids.add(id);
  }
  return [...ids];
}

export function aggregateMissionTechIds(
  subMissions: { techStack: string[] }[]
): string[] {
  const ids = new Set<string>();
  for (const sm of subMissions) {
    techStackToIds(sm.techStack).forEach((id) => ids.add(id));
  }
  return [...ids];
}
