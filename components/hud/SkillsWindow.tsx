"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";

const SKILLS = [
  { id: "html", name: "HTML5", color: "#E34F26" },
  { id: "css", name: "CSS3", color: "#1572B6" },
  { id: "js", name: "JavaScript", color: "#F7DF1E" },
  { id: "ts", name: "TypeScript", color: "#3178C6" },
  { id: "php", name: "PHP", color: "#777BB4" },
  { id: "py", name: "Python", color: "#3776AB" },
  { id: "java", name: "Java", color: "#007396" },
  { id: "node", name: "Node.js", color: "#339933" },
  { id: "react", name: "React", color: "#61DAFB" },
  { id: "nextjs", name: "Next.js", color: "#cccccc" },
  { id: "vue", name: "Vue.js", color: "#4FC08D" },
  { id: "astro", name: "Astro", color: "#BC52EE" },
  { id: "laravel", name: "Laravel", color: "#FF2D20" },
  { id: "tail", name: "Tailwind", color: "#06B6D4" },
  { id: "sass", name: "Sass", color: "#CC6699" },
  { id: "git", name: "Git", color: "#F05032" },
  { id: "mysql", name: "MySQL", color: "#4479A1" },
  { id: "postsql", name: "PostgreSQL", color: "#336791" },
  { id: "mongo", name: "MongoDB", color: "#47A248" },
  { id: "docker", name: "Docker", color: "#2496ED" },
  { id: "vite", name: "Vite", color: "#646CFF" },
  { id: "linux", name: "Linux", color: "#FCC624" },
  { id: "postman", name: "Postman", color: "#FF6C37" },
  { id: "vercel", name: "Vercel", color: "#dddddd" },
  { id: "heroku", name: "Heroku", color: "#430098" },
  { id: "three", name: "Three.js", color: "#88ccff" },
  { id: "github", name: "GitHub", color: "#cccccc" },
];

export default function SkillsWindow() {
  return (
    <div className="grid grid-cols-1 gap-1.5">
      {SKILLS.map((s) => (
        <div
          key={s.id}
          className="flex items-center gap-2 rounded border px-2.5 py-1.5 text-xs font-medium backdrop-blur-sm"
          style={{
            borderColor: `${s.color}44`,
            backgroundColor: `${s.color}15`,
            color: s.color,
          }}
        >
          <svg width="16" height="16" style={{ color: s.color, fill: "currentColor", flexShrink: 0 }}>
            <use href={`#${s.id}`} />
          </svg>
          <span className="truncate">{s.name}</span>
        </div>
      ))}
    </div>
  );
}
