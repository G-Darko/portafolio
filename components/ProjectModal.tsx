"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Project } from "@/lib/data";
import SkillIcon from "./SkillIcon";

export default function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(0);

  const showSlide = useCallback(
    (idx: number) => {
      const total = project.images.length + (project.video ? 1 : 0);
      if (idx >= total) idx = 0;
      if (idx < 0) idx = total - 1;
      setCurrent(idx);
    },
    [project]
  );

  const next = useCallback(() => showSlide(current + 1), [current, showSlide]);
  const prev = useCallback(() => showSlide(current - 1), [current, showSlide]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, next, prev]);

  const totalSlides = project.images.length + (project.video ? 1 : 0);
  const allMedia = project.video
    ? [{ type: "video" as const, src: project.video.src }, ...project.images.map((src) => ({ type: "image" as const, src }))]
    : project.images.map((src) => ({ type: "image" as const, src }));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[4000] flex items-center justify-center"
      >
        <div
          className="absolute inset-0 bg-[var(--gris)]/60"
          onClick={onClose}
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative z-10 flex max-h-[90%] w-full max-w-[800px] flex-col overflow-hidden rounded-3xl bg-[var(--bg)] shadow-xl"
        >
          <div className="sticky top-0 z-20 flex items-center justify-between bg-[var(--complement)] px-4 py-3">
            <h2 className="pr-8 text-lg font-bold text-[var(--accent)]">
              {project.title}
            </h2>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-[var(--text)] transition-colors hover:bg-red-300 hover:text-red-700"
            >
              <X size={22} />
            </button>
          </div>

          <div className="overflow-y-auto p-4">
            <div className="relative overflow-hidden rounded-lg bg-[var(--card)]">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${current * 100}%)` }}
              >
                {allMedia.map((item, i) => (
                  <div
                    key={i}
                    className="flex min-w-full items-center justify-center"
                  >
                    {item.type === "video" ? (
                      <div className="aspect-video w-full p-4">
                        <iframe
                          src={item.src}
                          title="Video"
                          className="h-full w-full rounded-lg"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <Image
                        src={item.src}
                        alt={`Vista previa ${i + 1}`}
                        width={800}
                        height={450}
                        className="aspect-video w-full object-contain"
                      />
                    )}
                  </div>
                ))}
              </div>

              {totalSlides > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--complement)] text-[var(--text)] shadow-md transition-colors hover:bg-[var(--bg)]"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--complement)] text-[var(--text)] shadow-md transition-colors hover:bg-[var(--bg)]"
                  >
                    <ChevronRight size={22} />
                  </button>
                  <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                    {allMedia.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => showSlide(i)}
                        className={`h-2.5 w-2.5 rounded-full transition-all ${
                          i === current
                            ? "scale-125 bg-[var(--accent)] shadow-[0_0_5px_var(--accent)]"
                            : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="mt-3 flex gap-2 overflow-x-auto rounded-lg bg-[var(--complement)] p-2">
              {allMedia.map((item, i) => (
                <button
                  key={i}
                  onClick={() => showSlide(i)}
                  className={`shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                    i === current
                      ? "border-[var(--accent)] opacity-100"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  {item.type === "video" ? (
                    <div className="flex h-[45px] w-[80px] items-center justify-center bg-[var(--bg)] text-xs text-[var(--text)]">
                      Video
                    </div>
                  ) : (
                    <Image
                      src={item.src}
                      alt={`Miniatura ${i + 1}`}
                      width={80}
                      height={45}
                      className="h-[45px] w-[80px] object-cover"
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="mt-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-lg font-semibold">Desarrollado con:</span>
                <div className="flex flex-wrap gap-3">
                  {project.tech.map((t) => (
                    <SkillIcon key={t} icon={t} name={t} />
                  ))}
                </div>
              </div>
              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-[var(--accent)] transition-colors hover:text-[var(--c1)]"
                >
                  <span>Ver repositorio</span>
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
