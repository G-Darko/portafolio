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
  /* Black Sheep projects - mockups */
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
    aerial: { title: t.projects.aerial.title, desc: t.projects.aerial.desc, tag: t.projects.aerial.tag },
    tienko: { title: t.projects.tienko.title, desc: t.projects.tienko.desc, tag: t.projects.tienko.tag },
    postgrados: { title: t.projects.postgrados.title, desc: t.projects.postgrados.desc, tag: t.projects.postgrados.tag },
    yiza: { title: t.projects.yiza.title, desc: t.projects.yiza.desc, tag: t.projects.yiza.tag },
    skool: { title: "LMS Skool", desc: "Plataforma SaaS LMS desarrollada en Next.js con integraciones visuales e interactivas para educación en línea.", tag: "Black Sheep" },
    duplica: { title: "Duplica App", desc: "Mobile App en Expo/React Native con IA para generación de promociones, gamificación de diamantes/experiencia, retos y comunidad.", tag: "Black Sheep" },
    rnme: { title: "RNME Hub", desc: "Landing page y comunidad tipo Facebook para empresarios con Rich Text Editor para blogs, desarrollada en Next.js.", tag: "Black Sheep" },
  };
}

function MockupPlaceholder({ title, tags }: { title: string; tags: string[] }) {
  return (
    <div className="flex h-24 w-full flex-col items-center justify-center gap-2 rounded border border-dashed"
      style={{ borderColor: "rgba(13,248,249,0.2)", background: "rgba(13,248,249,0.03)" }}
    >
      <div className="text-[10px] font-mono font-bold tracking-widest" style={{ color: "var(--c1)" }}>
        {title}
      </div>
      <div className="flex flex-wrap justify-center gap-1">
        {tags.map((tag) => (
          <span key={tag} className="rounded px-1 py-0 text-[8px]" style={{ border: "1px solid rgba(13,248,249,0.15)", color: "var(--accent)" }}>
            {tag}
          </span>
        ))}
      </div>
      <span className="text-[8px] opacity-40" style={{ color: "var(--accent)" }}>[MOCKUP]</span>
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
            className="group cursor-pointer rounded border p-2 transition-colors hover:bg-[rgba(13,248,249,0.05)]"
            style={{ borderColor: "rgba(13,248,249,0.1)" }}
            onClick={() => {
              setActiveProject(p.id);
              setImgIndex(0);
            }}
          >
            {p.isMockup ? (
              <MockupPlaceholder title={info.title} tags={p.tags} />
            ) : (
              <>
                <div className="relative mb-2 h-24 w-full overflow-hidden rounded"
                  style={{ background: "var(--card)" }}
                >
                  <Image
                    src={p.images[0]}
                    alt={info.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <h4 className="text-xs font-bold" style={{ color: "var(--c1)" }}>
                  {info.title}
                </h4>
                <p className="mt-0.5 text-[10px] opacity-60 line-clamp-2" style={{ color: "var(--text)" }}>
                  {info.desc}
                </p>
              </>
            )}
            <div className="mt-1 flex flex-wrap gap-1">
              {p.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded px-1 py-0 text-[8px]"
                  style={{
                    border: "1px solid rgba(13,248,249,0.15)",
                    color: "var(--accent)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        );
      })}

      {/* Project detail modal */}
      <AnimatePresence>
        {project && activeProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setActiveProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-h-[80vh] w-full max-w-lg overflow-auto rounded-xl border p-4"
              style={{
                borderColor: "rgba(13,248,249,0.3)",
                background: "rgba(8,16,32,0.95)",
                boxShadow: "0 0 30px rgba(13,248,249,0.1)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveProject(null)}
                className="absolute right-3 top-3 z-10"
                style={{ color: "var(--hud-red)" }}
              >
                <X size={16} />
              </button>

              {project.isMockup ? (
                <MockupPlaceholder title={names[activeProject as keyof typeof names]?.title || ""} tags={project.tags} />
              ) : (
                <>
                  <div className="relative mb-3 h-48 w-full overflow-hidden rounded"
                    style={{ background: "var(--card)" }}
                  >
                    <Image
                      src={project.images[imgIndex]}
                      alt="project"
                      fill
                      className="object-cover"
                    />
                    {project.images.length > 1 && (
                      <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
                        {project.images.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setImgIndex(idx)}
                            className="h-1.5 w-1.5 rounded-full"
                            style={{
                              background: idx === imgIndex ? "var(--c1)" : "rgba(255,255,255,0.3)",
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              <h3 className="text-sm font-bold" style={{ color: "var(--c1)" }}>
                {names[activeProject as keyof typeof names]?.title || ""}
              </h3>
              <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--text)" }}>
                {names[activeProject as keyof typeof names]?.desc || ""}
              </p>

              {project.video && (
                <div className="mt-3 aspect-video w-full overflow-hidden rounded"
                  style={{ background: "var(--card)" }}
                >
                  <iframe
                    src={project.video}
                    title="Demo"
                    className="h-full w-full"
                    allowFullScreen
                  />
                </div>
              )}

              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 rounded border px-3 py-1.5 text-[10px] transition-colors hover:bg-[rgba(13,248,249,0.1)]"
                  style={{ borderColor: "rgba(13,248,249,0.2)", color: "var(--accent)" }}
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
