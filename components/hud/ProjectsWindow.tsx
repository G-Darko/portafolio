"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { X, GitBranch, ExternalLink } from "lucide-react";
import Image from "next/image";

const projectsData = [
  {
    id: "aerial",
    images: ["/img/aerial/2.webp", "/img/aerial/1.webp", "/img/aerial/3.webp", "/img/aerial/4.webp", "/img/aerial/5.webp", "/img/aerial/6.webp"],
    video: "https://www.youtube.com/embed/pmJ6ysc6ByY",
    tags: ["Laravel", "Vue.js", "Three.js", "MySQL"],
  },
  {
    id: "tienko",
    images: ["/img/tienko/3.webp", "/img/tienko/1.webp", "/img/tienko/2.webp", "/img/tienko/4.webp", "/img/tienko/5.webp"],
    repo: "https://github.com/G-Darko/Tienko",
    tags: ["Java", "MySQL"],
  },
  {
    id: "postgrados",
    images: ["/img/postg/1.webp", "/img/postg/2.webp", "/img/postg/3.webp"],
    repo: "https://github.com/G-Darko/Postgrados_UPVM",
    tags: ["HTML", "CSS", "JS", "PHP", "MySQL"],
  },
  {
    id: "yiza",
    images: ["/img/yiza/1.webp", "/img/yiza/2.webp", "/img/yiza/3.webp"],
    repo: "https://github.com/G-Darko/YIZA",
    tags: ["HTML", "CSS", "JS", "PHP", "MySQL"],
  },
];

function getProjectNames(t: any) {
  return {
    aerial: { title: t.projects.aerial.title, desc: t.projects.aerial.desc, tag: t.projects.aerial.tag },
    tienko: { title: t.projects.tienko.title, desc: t.projects.tienko.desc, tag: t.projects.tienko.tag },
    postgrados: { title: t.projects.postgrados.title, desc: t.projects.postgrados.desc, tag: t.projects.postgrados.tag },
    yiza: { title: t.projects.yiza.title, desc: t.projects.yiza.desc, tag: t.projects.yiza.tag },
  };
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
            transition={{ delay: i * 0.1 }}
            className="group cursor-pointer rounded-lg border p-2 transition-colors hover:bg-accent/5"
            style={{ borderColor: "var(--glass-border)" }}
            onClick={() => {
              setActiveProject(p.id);
              setImgIndex(0);
            }}
          >
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
            <div className="mt-1 flex flex-wrap gap-1">
              {p.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded px-1 py-0 text-[8px]"
                  style={{
                    border: "1px solid var(--glass-border)",
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
                borderColor: "var(--glass-border)",
                background: "rgba(12,16,24,0.95)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveProject(null)}
                className="absolute right-3 top-3"
                style={{ color: "var(--hud-red)" }}
              >
                <X size={16} />
              </button>

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
                  className="mt-3 inline-flex items-center gap-1 rounded border px-3 py-1.5 text-[10px] transition-colors hover:bg-accent/10"
                  style={{ borderColor: "var(--glass-border)", color: "var(--accent)" }}
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
