"use client";

/**
 * LEGACY project modal (Ronda 7 PR-2): the old `showModal(id)` dialog,
 * re-implemented in React. Same structure as the 2025 modal — sticky
 * header with the project name, a Steam-style slider (arrows, dots,
 * thumbnails) with the project's media from the snapshot, the stack
 * icons and the links — but the content is the current project, not
 * the 2025 copy.
 *
 * Slides: the project's video first when the snapshot has one (a local
 * `/video/...` tour as `<video>`, or the Aerial Depot YouTube embed as
 * an iframe — `pmJ6ysc6ByY`, still the snapshot's video for that
 * project), then the project's images (`/img/...`, already in `public/`).
 * The two dead `YOUR_YOUTUBE_VIDEO_ID` placeholder iframes are gone.
 */
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Play, X } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import type { LegacyProject } from "./legacyData";

type Slide =
  | { kind: "video"; src: string; isYouTube: boolean }
  | { kind: "image"; src: string; alt: string };

export default function LegacyProjectModal({
  project,
  onClose,
}: {
  project: LegacyProject | null;
  onClose: () => void;
}) {
  const { t } = useTranslation();

  // Escape closes; lock body scroll while open.
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [project, onClose]);

  if (!project) return null;

  const links: { href: string; label: string }[] = [];
  if (project.liveUrl) links.push({ href: project.liveUrl, label: t.legacy.viewSite });
  if (project.repoUrl) links.push({ href: project.repoUrl, label: t.legacy.viewRepo });
  if (project.playStoreUrl) links.push({ href: project.playStoreUrl, label: t.legacy.googlePlay });
  if (project.appStoreUrl) links.push({ href: project.appStoreUrl, label: t.legacy.appStore });
  if (project.tenantUrl) links.push({ href: project.tenantUrl, label: t.legacy.viewDemo });

  return (
    <div
      className="fixed inset-0 z-[4000] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      <button
        type="button"
        aria-label={t.eras.close}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-[#454546] opacity-60"
      />
      <div className="relative h-[90%] w-full max-w-[800px] overflow-y-auto rounded-[30px] bg-[#121212] shadow-[0_5px_15px_rgba(255,255,255,0.25)] max-md:h-[80%] max-md:w-[calc(100%-5px)]">
        <header className="sticky top-0 z-10">
          <div className="bg-[#222] pr-[45px]">
            <h2 className="p-2.5 text-[1.5em] font-bold text-[#66ccff]">{project.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.eras.close}
            className="absolute top-[15px] right-[15px] flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#f00] text-2xl text-[#f0f0f0] transition-colors hover:bg-[#f5c1bb] hover:text-[#c72f1d]"
          >
            <X size={22} aria-hidden />
          </button>
        </header>

        <section className="p-2.5">
          <ProjectSlider key={project.id} project={project} />

          <article className="mt-7">
            <p className="text-[1.1em] leading-relaxed">{project.description}</p>
            {project.period && <p className="mt-2 text-sm text-[#f0f0f0]/70 italic">{project.period}</p>}
            {project.contextTag && <p className="mt-1 text-sm text-[#0df8f9]">{project.contextTag}</p>}

            <section className="mt-2.5">
              <span className="text-[1.5em] text-[#66ccff]">{t.legacy.developedWith}</span>
              <div className="mt-2.5 flex flex-wrap gap-5">
                {project.stack.map((tech) =>
                  tech.icon ? (
                    // eslint-disable-next-line @next/next/no-img-element -- remote API icon, same as SkillIcon
                    <img
                      key={tech.id ?? tech.title}
                      src={tech.icon}
                      alt={tech.title}
                      title={tech.title}
                      width={50}
                      height={50}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                      className="h-[50px] w-[50px] object-contain grayscale transition-all duration-500 hover:scale-110 hover:grayscale-0"
                    />
                  ) : (
                    <span
                      key={tech.id ?? tech.title}
                      className="flex h-[50px] items-center rounded-lg bg-[#454546] px-3 text-sm font-bold"
                    >
                      {tech.title}
                    </span>
                  )
                )}
              </div>
            </section>

            {links.length > 0 && (
              <section className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-base text-[#f0f0f0] transition-colors hover:text-[#66ccff]"
                  >
                    <ExternalLink size={18} aria-hidden />
                    <b>{link.label}</b>
                  </a>
                ))}
              </section>
            )}
          </article>
        </section>
      </div>
    </div>
  );
}

/**
 * Steam-style slider: arrows, dots and thumbnails. It owns its slide
 * index, and the modal remounts it per project (`key={project.id}`),
 * so a new project always starts on its first slide.
 */
function ProjectSlider({ project }: { project: LegacyProject }) {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);

  const slides: Slide[] = useMemo(() => {
    const list: Slide[] = [];
    if (project.video) {
      list.push({
        kind: "video",
        src: project.video,
        isYouTube: project.video.includes("youtube.com"),
      });
    }
    project.images.forEach((src, i) => {
      list.push({ kind: "image", src, alt: `${project.title} — ${i + 1}` });
    });
    return list;
  }, [project]);

  const total = slides.length;
  if (total === 0) return null;
  const go = (i: number) => setIndex(((i % total) + total) % total);

  return (
    <>
      <div className="relative max-h-[400px] overflow-hidden rounded-lg bg-[#1e1e1e]">
        <div
          className="flex h-full w-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <figure
              key={`${slide.kind}-${i}`}
              className={`flex min-w-full items-center justify-center overflow-hidden ${
                slide.kind === "video" ? "p-[25px] max-md:p-0" : ""
              }`}
            >
              {slide.kind === "video" ? (
                slide.isYouTube ? (
                  <iframe
                    src={slide.src}
                    title={`${project.title} — video`}
                    className="aspect-video w-full object-contain"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={slide.src}
                    controls
                    preload="metadata"
                    className="aspect-video w-full object-contain"
                  />
                )
              ) : (
                // eslint-disable-next-line @next/next/no-img-element -- local /img asset, same as the legacy <img>
                <img src={slide.src} alt={slide.alt} className="aspect-video w-full object-contain" />
              )}
            </figure>
          ))}
        </div>
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label={t.nyxheim.prevSlide}
              className="absolute top-1/2 left-2.5 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#222] text-[#f0f0f0] shadow-[0_0_5px_#66ccff] transition-colors hover:bg-[#121212]"
            >
              <ChevronLeft size={20} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label={t.nyxheim.nextSlide}
              className="absolute top-1/2 right-2.5 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#222] text-[#f0f0f0] shadow-[0_0_5px_#66ccff] transition-colors hover:bg-[#121212]"
            >
              <ChevronRight size={20} aria-hidden />
            </button>
            <div className="absolute bottom-2.5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
              {slides.map((slide, i) => (
                <button
                  key={`${slide.kind}-${i}`}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`${t.nyxheim.slide} ${i + 1}`}
                  className={`h-2.5 w-2.5 rounded-full transition-all ${
                    i === index
                      ? "scale-125 bg-[#66ccff] shadow-[0_0_5px_#66ccff]"
                      : "bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {total >= 1 && (
        <div className="mt-0 flex flex-nowrap justify-around gap-2.5 overflow-x-auto bg-[#222] p-2.5">
          {slides.map((slide, i) => (
            <button
              key={`${slide.kind}-${i}`}
              type="button"
              onClick={() => go(i)}
              aria-label={`${t.nyxheim.slide} ${i + 1}`}
              className={`h-[45px] w-20 shrink-0 overflow-hidden rounded-[5px] border-2 object-cover transition-all ${
                i === index
                  ? "scale-105 border-[#66ccff] opacity-100"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              {slide.kind === "video" ? (
                <span className="flex h-full w-full items-center justify-center bg-[#121212] text-[#66ccff]">
                  <Play size={18} aria-hidden />
                </span>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element -- local /img asset thumbnail
                <img src={slide.src} alt="" className="aspect-video h-full w-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
