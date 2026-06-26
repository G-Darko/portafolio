/** Maps mission techStack labels to TechIconsSprite / TechSphere node ids */
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
  "Rich Text": "js",
  Comunidad: "js",
  Tiptap: "js",
};

export function techStackToIds(stack: string[]): string[] {
  const ids = new Set<string>();
  for (const name of stack) {
    const id = TECH_NAME_TO_ID[name];
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
