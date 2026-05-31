"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { X, GitBranch } from "lucide-react";
import Image from "next/image";

interface ProjectData {
  id: string;
  images: string[];
  video?: string;
  repo?: string;
  tags: string[];
  isMockup?: boolean;
}

const projectsData: ProjectData[] = [
  {
    id: "aerial",
    images: ["img/aerial/2.webp", "img/aerial/1.webp", "img/aerial/3.webp", "img/aerial/4.webp", "img/aerial/5.webp", "img/aerial/6.webp"],
    video: "https://www.youtube.com/embed/pmJ6ysc6ByY",
    tags: ["Laravel", "Vue.js", "Three.js", "MySQL"],
  },
  {
    id: "tienko",
    images: ["img/tienko/3.webp", "img/tienko/1.webp", "img/tienko/2.webp", "img/tienko/4.webp", "img/tienko/5.webp"],
    repo: "https://github.com/G-Darko/Tienko",
    tags: ["Java", "MySQL"],
  },
  {
    id: "postgrados",
    images: ["img/postg/1.webp", "img/postg/2.webp", "img/postg/3.webp"],
    repo: "https://github.com/G-Darko/Postgrados_UPVM",
    tags: ["HTML", "CSS", "JS", "PHP", "MySQL"],
  },
  {
    id: "yiza",
    images: ["img/yiza/1.webp", "img/yiza/2.webp", "img/yiza/3.webp"],
    repo: "https://github.com/G-Darko/YIZA",
    tags: ["HTML", "CSS", "JS", "PHP", "MySQL"],
  },
  {
    id: "skool",
    images: [],
    repo: "https://github.com/Black-Sheep-Lab/UF",
    tags: ["Next.js", "Laravel", "PostgreSQL"],
    isMockup: true,
  },
  {
    id: "duplica",
    images: [],
    repo: "https://github.com/Black-Sheep-Lab/Cursos",
    tags: ["React Native", "Expo", "IA"],
    isMockup: true,
  },
  {
    id: "rnme",
    images: [],
    repo: "https://github.com/Black-Sheep-Lab/RNME",
    tags: ["Next.js", "Rich Text", "Comunidad"],
    isMockup: true,
  },
];

function getProjectNames(t: any) {
  return {
    aerial: { title: t.projects.aerial.title, desc: t.projects.aerial.desc },
    tienko: { title: t.projects.tienko.title, desc: t.projects.tienko.desc },
    postgrados: { title: t.projects.postgrados.title, desc: t.projects.postgrados.desc },
    yiza: { title: t.projects.yiza.title, desc: t.projects.yiza.desc },
    skool: { title: "LMS Skool", desc: "Plataforma SaaS LMS desarrollada en Next.js con integraciones visuales e interactivas para educación en línea." },
    duplica: { title: "Duplica App", desc: "Mobile App en Expo/React Native con IA para generación de promociones, gamificación de diamantes/experiencia, retos y comunidad." },
    rnme: { title: "RNME Hub", desc: "Landing page y comunidad tipo Facebook para empresarios con Rich Text Editor para blogs, desarrollada en Next.js." },
  };
}

function MockupPlaceholder({ title, tags }: { title: string; tags: string[] }) {
  return (
    <div className="flex h-24 w-full flex-col items-center justify-center gap-2 rounded border border-dashed border-hud-border bg-hud-cyan/5"
    >
      <div className="text-[10px] font-mono font-bold tracking-widest text-hud-cyan">
        {title}
      </div>
      <div className="flex flex-wrap justify-center gap-1">
        {tags.map((tag) => (
          <span key={tag} className="rounded border border-hud-border px-1 py-0 text-[8px] text-muted-foreground">
            {tag}
          </span>
        ))}
      </div>
      <span className="text-[8px] text-muted-foreground opacity-40">[MOCKUP]</span>
    </div>
  );
}

export default function ProjectsWindow() {
  const { t } = useTranslation();
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [imgIndex, setImgIndex] = useState(0);

  const names = getProjectNames(t);
  const project = activeProject ? projectsData.find((p) => p.id === activeProject) : null;

  return (
    <div className="space-y-3">
      {projectsData.map((p, i) => {
        const info = names[p.id as keyof typeof names];
        return (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group cursor-pointer rounded border border-hud-border p-2 transition-colors hover:bg-hud-cyan/5"
            onClick={() => { setActiveProject(p.id); setImgIndex(0); }}
          >
            {p.isMockup ? (
              <MockupPlaceholder title={info.title} tags={p.tags} />
            ) : (
              <>
                <div className="relative mb-2 h-24 w-full overflow-hidden rounded bg-card"
                >
                  <Image src={p.images[0]} alt={info.title} fill className="object-cover transition-transform group-hover:scale-105" />
                </div>
                <h4 className="text-xs font-bold text-hud-cyan">{info.title}</h4>
                <p className="mt-0.5 text-[10px] text-muted-foreground line-clamp-2">{info.desc}</p>
              </>
            )}
            <div className="mt-1 flex flex-wrap gap-1">
              {p.tags.map((tag) => (
                <span key={tag} className="rounded border border-hud-border px-1 py-0 text-[8px] text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        );
      })}

      <AnimatePresence>
        {project && activeProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setActiveProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-h-[80vh] w-full max-w-lg overflow-auto rounded-xl border border-hud-border bg-hud-bg p-4 shadow-[var(--hud-glow)]"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setActiveProject(null)} className="absolute right-3 top-3 z-10 text-hud-red">
                <X size={16} />
              </button>

              {project.isMockup ? (
                <MockupPlaceholder title={names[activeProject as keyof typeof names]?.title || ""} tags={project.tags} />
              ) : (
                <>
                  <div className="relative mb-3 h-48 w-full overflow-hidden rounded bg-card"
                  >
                    <Image src={project.images[imgIndex]} alt="project" fill className="object-cover" />
                    {project.images.length > 1 && (
                      <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
                        {project.images.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setImgIndex(idx)}
                            className={`h-1.5 w-1.5 rounded-full ${idx === imgIndex ? "bg-hud-cyan" : "bg-white/30"}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              <h3 className="text-sm font-bold text-hud-cyan">{names[activeProject as keyof typeof names]?.title || ""}</h3>
              <p className="mt-1 text-xs leading-relaxed text-foreground">{names[activeProject as keyof typeof names]?.desc || ""}</p>

              {project.video && (
                <div className="mt-3 aspect-video w-full overflow-hidden rounded bg-card"
                >
                  <iframe src={project.video} title="Demo" className="h-full w-full" allowFullScreen />
                </div>
              )}

              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 rounded border border-hud-border px-3 py-1.5 text-[10px] text-muted-foreground transition-colors hover:bg-hud-cyan/10"
                >
                  <GitBranch size={12} />
                  {t.projects.repo}
                </a>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
