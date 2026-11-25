"use client";

/**
 * LEGACY era app (`/era/legacy/`, Ronda 7 PR-2).
 *
 * The 2022–2026 static site (`a79e3fe^:_LEGACY/`) re-implemented as a
 * Next + Tailwind renderer over the current snapshot — same layout,
 * sections and palette as the original (Poppins, `#121212` / `#1e1e1e`,
 * accent `#66ccff`, cyan→blue gradient), same behaviours (typewriter,
 * project modals with sliders, responsive menu, fade-in on scroll,
 * alternating experience timeline, rotated skill-group labels), but
 * every word of content comes from `legacyData.ts` (snapshot, missions,
 * skills, certifications, contact). Nothing is copied from the old
 * CSS/JS: all styling is Tailwind (+ a small scoped `<style>` for the
 * warp background, keyframes and the timeline arrows), all behaviour
 * is React.
 *
 * Deliberate deviations from the original (documented):
 * - Dark-only: the original's light theme was not restored (same call
 *   as the HUD era in PR-1).
 * - Rendered behind a hydration gate (same pattern as HudEraApp): the
 *   server prerenders with the Node default locale, the client with
 *   the visitor's — rendering locale copy before the persisted locale
 *   rehydrates would mismatch hydration for non-English browsers.
 *   The static HTML is therefore a blank legacy-colored backdrop;
 *   the era mounts `TechIconsSprite` (the HUD's brand-icon defs) so
 *   `SkillIcon`'s sprite fallback works on this page too.
 * - No binaries added: the hero background (`fondo.gif`, 4 MB) is
 *   recreated with CSS gradients; project media comes from the
 *   snapshot (`/img/...`, already in `public/`); the dead videos
 *   (`vid/hospital.mp4`, `vid/yiza.mp4`), `Manual.pdf` and the dead
 *   YouTube placeholder are dropped. The real YouTube embed
 *   (`pmJ6ysc6ByY`) stays — it is still the snapshot's video for
 *   Aerial Depot — as the first slide of that project's modal.
 * - Ionicons (unpkg CDN) are replaced by the snapshot's remote icons
 *   (socials, skills) and lucide.
 * - The contact form posts to the same Formspree endpoint the rest of
 *   the site uses (`lib/data/profile.ts`).
 */
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Mail, Menu, X } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useLocaleStore } from "@/lib/store/useLocaleStore";
import SkillIcon from "@/components/SkillIcon";
import TechIconsSprite from "@/components/TechIconsSprite";
import { EraSwitcher } from "@/components/eras/EraSwitcher";
import LegacyProjectModal from "./LegacyProjectModal";
import LegacyContactModal from "./LegacyContactModal";
import {
  legacyAbout,
  legacyCertifications,
  legacyCertLinkLabel,
  legacyExperience,
  legacyProjects,
  legacySkillGroups,
  legacySocialById,
  type LegacyProject,
} from "./legacyData";

const NAV_ITEMS = [
  { id: "whoami", key: "home" },
  { id: "aboutme", key: "aboutNav" },
  { id: "experience", key: "experience" },
  { id: "portfolio", key: "portfolio" },
  { id: "skills", key: "skills" },
  { id: "certifications", key: "certifications" },
] as const;

export default function LegacyEraApp() {
  const { t, locale } = useTranslation();
  // Hydration gate (same pattern as HudEraApp): the server prerenders
  // with the Node default locale ("en"), but the client renders in the
  // visitor's locale — rendering locale-dependent copy before the
  // persisted locale rehydrates causes a hydration mismatch (and a
  // console error) for every non-English browser. Until then, a blank
  // legacy-colored backdrop, exactly like the HUD era's gate.
  const hydrated = useSyncExternalStore(
    (onChange) => useLocaleStore.persist.onFinishHydration(onChange),
    () => useLocaleStore.persist.hasHydrated(),
    () => false
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<string>("");
  const [openProject, setOpenProject] = useState<LegacyProject | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [typeIdx, setTypeIdx] = useState(0);
  const [typeFading, setTypeFading] = useState(false);

  const experience = useMemo(() => legacyExperience(locale), [locale]);
  const projects = useMemo(() => legacyProjects(locale), [locale]);
  const skillGroups = useMemo(() => legacySkillGroups(), []);
  const about = useMemo(() => legacyAbout(locale), [locale]);
  const certifications = useMemo(() => legacyCertifications(locale), [locale]);
  const github = legacySocialById("github");
  const credly = legacySocialById("credly");

  const words = t.legacy.typewriterRoles;

  // Typewriter: rotate every 2.5 s with a 500 ms fade, like `js/main.js`.
  useEffect(() => {
    const timer = setInterval(() => {
      setTypeFading(true);
      setTimeout(() => {
        setTypeIdx((i) => (i + 1) % words.length);
        setTypeFading(false);
      }, 500);
    }, 2500);
    return () => clearInterval(timer);
  }, [words.length]);

  // Smooth anchor scrolling, like the old `scroll-behavior: smooth`.
  useEffect(() => {
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = prev;
    };
  }, []);

  // Fade-in on scroll (IntersectionObserver, like the old `.fade-in`).
  // Runs once the era is actually mounted (after the hydration gate).
  useEffect(() => {
    if (!hydrated) return;
    const root = rootRef.current;
    if (!root) return;
    const els = [...root.querySelectorAll("[data-lgcy-reveal]")];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => el.classList.add("lgcy-appear"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("lgcy-appear");
          observer.unobserve(entry.target);
        });
      },
      // Threshold 0 (not the old 0.2): the portfolio and experience
      // sections are much taller now (12 projects, 7 jobs) than the
      // 2025 page, and 20% of a ~8000 px mobile section never fits in
      // an 844 px viewport — with 0.2 those sections would never
      // reveal on mobile. Any visible part triggers the fade-in.
      { threshold: 0, rootMargin: "0px 0px -50px 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [hydrated]);

  const year = new Date().getFullYear();

  if (!hydrated) {
    return <div className="fixed inset-0 bg-[#121212]" aria-hidden />;
  }

  return (
    <div
      ref={rootRef}
      className="min-h-dvh w-full overflow-x-clip bg-[#121212] text-[#f0f0f0] antialiased"
    >
      {/* Brand-icon sprite (same defs the HUD shell mounts): the fallback
          for SkillIcon when a remote API icon fails to load. Without it
          the sprite fallback resolves to nothing on this page. */}
      <TechIconsSprite />
      <style>{`
        .lgcy-warp {
          background:
            radial-gradient(circle at 50% 50%, #ffffff 0%, #ff2d55 8%, #7f1d1d 22%, rgba(60, 10, 10, 0.6) 38%, transparent 55%),
            repeating-conic-gradient(from 0deg at 50% 50%, rgba(255, 255, 255, 0.6) 0deg 0.5deg, rgba(255, 45, 85, 0.35) 0.5deg 1deg, transparent 1deg 3.5deg),
            radial-gradient(circle at 50% 50%, #3f0a0a 0%, #12060a 60%, #0a0a0a 100%);
          animation: lgcy-hue 5s linear infinite;
        }
        .lgcy-ring {
          background: linear-gradient(45deg, #0df8f9, #0D82F9);
          animation: lgcy-hue 5s linear infinite;
        }
        @keyframes lgcy-hue {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
        .lgcy-fade-in {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .lgcy-fade-in.lgcy-appear { opacity: 1; transform: translateY(0); }
        .lgcy-group-label {
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
          animation: lgcy-zoom-text 2s infinite alternate ease-in-out;
        }
        @keyframes lgcy-zoom-text {
          0% { transform: translate(0, 0) rotate(var(--lgcy-deg, -45deg)); text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); }
          25% { transform: translate(2px, -1px) rotate(var(--lgcy-deg, -45deg)); text-shadow: 3px 3px 5px rgba(255, 193, 7, 0.7); }
          50% { transform: translate(-3px, 2px) rotate(var(--lgcy-deg, -45deg)); text-shadow: 4px 4px 6px rgba(255, 235, 59, 0.8); }
          75% { transform: translate(1px, -2px) rotate(var(--lgcy-deg, -45deg)); text-shadow: 3px 3px 5px rgba(255, 193, 7, 0.7); }
          100% { transform: translate(0, 0) rotate(var(--lgcy-deg, -45deg)); text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); }
        }
        .lgcy-skill-tip { animation: lgcy-hue 5s linear infinite; }
        .lgcy-skill-tip::after {
          content: "";
          position: absolute;
          right: 50px;
          top: 25px;
          width: 20px;
          height: 20px;
          background: #454546;
          border-radius: 0% 100% 0% 100% / 100% 100% 0% 0%;
          transform: rotate(-45deg);
        }
        @media (min-width: 768px) {
          .lgcy-tl-content::after {
            content: "";
            position: absolute;
            top: 22px;
            right: -10px;
            border: 10px solid transparent;
            border-left-color: #1e1e1e;
          }
          .lgcy-tl-even .lgcy-tl-content::after {
            left: -10px;
            right: auto;
            border-left-color: transparent;
            border-right-color: #1e1e1e;
          }
        }
        @media (max-width: 767px) {
          .lgcy-group-label { animation: none; }
          .lgcy-tl-content::after {
            content: "";
            position: absolute;
            top: 22px;
            left: -10px;
            border: 10px solid transparent;
            border-right-color: #1e1e1e;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .lgcy-warp, .lgcy-ring, .lgcy-group-label { animation: none; }
          .lgcy-fade-in { opacity: 1; transform: none; transition: none; }
        }
      `}</style>

      {/* ── Header: sticky nav, like the original ─────────────── */}
      <header className="sticky top-0 z-[3000] w-full border-b border-[#66ccff] bg-[#1e1e1e]/85 px-2.5 py-2.5">
        <div className="relative flex flex-wrap items-center justify-between px-2.5">
          <h1 className="w-4/5 cursor-pointer pl-5 text-[2em] font-bold">
            <a href="#whoami" onClick={() => setSelected("whoami")}>
              <span className="text-[#66ccff]">G-Darko</span>
            </a>
          </h1>
          <nav className="hidden md:block" aria-label={t.legacy.portfolio}>
            <ul className="flex list-none text-right">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={() => setSelected(item.id)}
                    className={`mx-5 rounded-[10px] px-1.5 py-1 text-base transition-colors hover:border-b-2 hover:border-[#0df8f9] hover:text-[#0df8f9] ${
                      selected === item.id ? "text-[#0df8f9]" : "text-[#f0f0f0]"
                    }`}
                  >
                    {t.legacy[item.key as keyof typeof t.legacy] as string}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center text-[2em] text-[#f0f0f0] md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label="Menu"
          >
            {menuOpen ? <X size={28} aria-hidden /> : <Menu size={28} aria-hidden />}
          </button>
          {menuOpen && (
            <nav className="absolute top-full right-0 left-0 block w-full bg-[#222]/90 px-2.5 py-2.5 md:hidden">
              <ul className="block w-full list-none text-center">
                {NAV_ITEMS.map((item) => (
                  <li key={item.id} className="my-1.5 w-full">
                    <a
                      href={`#${item.id}`}
                      onClick={() => {
                        setSelected(item.id);
                        setMenuOpen(false);
                      }}
                      className={`block w-full px-1.5 py-1 text-base transition-colors hover:text-[#0df8f9] ${
                        selected === item.id ? "text-[#0df8f9]" : "text-[#f0f0f0]"
                      }`}
                    >
                      {t.legacy[item.key as keyof typeof t.legacy] as string}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </header>

      <main id="main">
        {/* ── Hero (#whoami) ─────────────────────────────────── */}
        <section
          id="whoami"
          className="relative flex flex-wrap items-center justify-around border-b border-[#66ccff] bg-[#121212] p-5 max-md:flex-col-reverse"
        >
          <article id="iam" className="w-[350px] max-w-full rounded-[20px] bg-[#1e1e1e]/85 p-[30px] max-md:mt-2.5">
            <div className="text-[2em]">Gael Uribe</div>
            <div className="text-[1.5em] font-bold">
              <span
                className={`inline-block text-[#66ccff] transition-opacity duration-500 ${
                  typeFading ? "opacity-0" : "opacity-100"
                }`}
              >
                {words[typeIdx]}
              </span>
            </div>
            <section className="mt-2 flex flex-wrap">
              {github && (
                <a
                  title={github.title}
                  target="_blank"
                  rel="noopener noreferrer"
                  href={github.url}
                  className="mx-2.5 my-1 flex w-full items-center gap-1 text-[#f0f0f0] transition-colors hover:text-[#66ccff]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- remote API icon */}
                  <img
                    src={github.icon}
                    alt=""
                    width={30}
                    height={30}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                    className="h-[30px] w-[30px] translate-y-2 invert"
                  />
                  <b className="mr-[5px] border-l border-[#66ccff] bg-[#121212] px-[5px] text-[1.4em]">Github</b>
                </a>
              )}
              {credly && (
                <a
                  title={credly.title}
                  target="_blank"
                  rel="noopener noreferrer"
                  href={credly.url}
                  className="mx-2.5 my-1 flex w-full items-center gap-1 text-[#f0f0f0] transition-colors hover:text-[#66ccff]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- remote API icon */}
                  <img
                    src={credly.icon}
                    alt=""
                    width={30}
                    height={30}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                    className="h-[30px] w-[30px] translate-y-2 invert"
                  />
                  <b className="mr-[5px] border-l border-[#66ccff] bg-[#121212] px-[5px] text-[1.4em]">Credly</b>
                </a>
              )}
              <button
                type="button"
                title={t.legacy.contact}
                onClick={() => setContactOpen(true)}
                className="mx-2.5 my-1 flex w-full items-center gap-1 text-[#f0f0f0] transition-colors hover:text-[#66ccff]"
              >
                <Mail size={30} aria-hidden className="h-[30px] w-[30px] translate-y-2" />
                <b className="mr-[5px] border-l border-[#66ccff] bg-[#121212] px-[5px] text-[1.4em]">{t.legacy.contact}</b>
              </button>
            </section>
          </article>

          <div className="hero relative flex h-[350px] w-[350px] max-w-full items-center justify-center">
            <div className="lgcy-warp absolute inset-0 rounded-full opacity-60" aria-hidden />
            <div className="perfil absolute inset-0 flex items-center justify-center" aria-hidden>
              <div className="lgcy-ring absolute h-[245px] w-[245px] rounded-full opacity-60 blur-[5px]" />
              <div className="lgcy-ring absolute h-[200px] w-[200px] rounded-full opacity-60 blur-[5px]" />
              <div className="absolute">
                {/* eslint-disable-next-line @next/next/no-img-element -- local /img/DARKO.png, the legacy avatar */}
                <img
                  src="/img/DARKO.png"
                  alt="G-Darko"
                  width={157}
                  height={157}
                  className="h-[157px] w-[157px] rounded-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Sobre mí ───────────────────────────────────────── */}
        <section id="aboutme" data-lgcy-reveal className="lgcy-fade-in scroll-mt-24">
          <article className="mx-auto flex w-[90%] flex-col items-center justify-center pt-5">
            <h2 className="w-full p-10 text-center text-[1.5em] font-bold">
              <span className="text-[#66ccff]">{t.legacy.about}</span>
            </h2>
            <p className="text-base leading-relaxed">{about}</p>
          </article>
        </section>

        {/* ── Experiencia (timeline) ─────────────────────────── */}
        <section id="experience" data-lgcy-reveal className="lgcy-fade-in mx-auto w-[90%] scroll-mt-24 pt-5">
          <h2 className="w-full p-10 text-center text-[1.5em] font-bold">
            <span className="text-[#66ccff]">{t.legacy.experience}</span>
          </h2>
          <div className="relative mx-auto max-w-[1200px] px-5">
            <div className="absolute top-0 bottom-0 left-1/2 z-[1] -ml-[2px] w-1 bg-[linear-gradient(45deg,#0df8f9,#0D82F9)] max-md:left-5 max-md:ml-0" aria-hidden />
            {experience.map((item, i) => {
              const even = i % 2 === 1;
              return (
                <div
                  key={item.id}
                  className={`relative z-[2] px-10 py-2.5 md:w-1/2 ${
                    even ? "lgcy-tl-even md:left-1/2" : "md:left-0"
                  } max-md:w-full max-md:pr-5 max-md:pl-[60px]`}
                >
                  <div
                    className={`absolute top-5 left-[22px] z-[3] h-[15px] w-[15px] -translate-x-1/2 rounded-full border-[3px] border-[#1e1e1e] bg-[#66ccff] ${
                      even ? "md:right-auto md:left-0 md:-translate-x-1/2" : "md:right-0 md:left-auto md:translate-x-1/2"
                    }`}
                    aria-hidden
                  />
                  <div className="lgcy-tl-content relative rounded-lg border border-[#454546] bg-[#1e1e1e] px-7 py-5 transition-transform duration-300 hover:-translate-y-2.5">
                    <h3 className="mt-0 mb-1 text-lg font-bold">
                      <span className="text-[#66ccff]">
                        {item.title}
                        {item.orgUrl ? (
                          <>
                            {" — "}
                            <a
                              href={item.orgUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="cursor-pointer italic underline transition-colors hover:text-[#0D82F9]"
                            >
                              {item.org}
                            </a>
                          </>
                        ) : (
                          <> — {item.org}</>
                        )}
                      </span>
                    </h3>
                    {item.period && <span className="mb-4 block text-sm font-semibold italic">{item.period}</span>}
                    <p className="text-base leading-relaxed">{item.description}</p>
                    {item.url && (
                      <p className="mt-2">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="italic underline transition-colors hover:text-[#0D82F9]"
                        >
                          {t.legacy.visitSite} ↗
                        </a>
                      </p>
                    )}
                    <div className="mt-4">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="mt-1 mr-1 inline-block rounded bg-[#454546] px-2 py-[3px] text-[0.85em] font-semibold whitespace-nowrap"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Portafolio ─────────────────────────────────────── */}
        <section id="portfolio" data-lgcy-reveal className="lgcy-fade-in scroll-mt-24">
          <h2 className="w-full px-10 pt-[60px] pb-10 text-center text-[1.5em] font-bold">
            <span className="text-[#66ccff]">{t.legacy.projects}</span>
          </h2>
          <section className="mx-auto w-[90%]">
            {projects.map((project) => (
              <article
                key={project.id}
                className="relative mx-auto my-2.5 flex flex-wrap rounded-[10px] bg-[#1e1e1e] p-2.5"
              >
                <figure className="relative flex w-1/2 items-center justify-center bg-[#1e1e1e] max-md:w-full">
                  {project.images[0] ? (
                    <button
                      type="button"
                      onClick={() => setOpenProject(project)}
                      aria-label={`${t.legacy.viewMore}: ${project.title}`}
                      className="block w-full cursor-pointer"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- local /img asset from the snapshot */}
                      <img
                        src={project.images[0]}
                        alt={project.title}
                        loading="lazy"
                        className="aspect-video w-full rounded-[15px] object-contain p-1.5"
                      />
                    </button>
                  ) : (
                    <div className="aspect-video w-full rounded-[15px] bg-[linear-gradient(45deg,#0df8f9,#0D82F9)] opacity-60" aria-hidden />
                  )}
                </figure>
                <div className="flex min-h-[300px] w-1/2 flex-col items-start justify-between bg-[#222] p-5 max-md:w-full max-md:min-h-0">
                  <h4 className="text-base font-bold">
                    <span className="text-[#66ccff]">
                      {project.title}
                      {project.contextTag ? (
                        <>
                          {" — "}
                          <i>{project.contextTag}</i>
                        </>
                      ) : null}
                    </span>
                  </h4>
                  <p className="mt-1 text-sm text-[#f0f0f0]/70">
                    {project.missionTitle}
                    {project.period ? ` — ${project.period}` : ""}
                  </p>
                  <div>
                    <b>{t.legacy.description}</b>
                    <div className="max-h-[130px] overflow-y-auto">
                      <p className="text-base leading-relaxed">{project.description}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpenProject(project)}
                    className="my-2.5 cursor-pointer rounded-[10px] border-none bg-[#66ccff] px-2.5 py-2.5 text-base font-semibold tracking-[0.3em] text-[#121212] uppercase transition-colors duration-500 hover:bg-[linear-gradient(45deg,#0df8f9,#0D82F9)]"
                  >
                    {t.legacy.viewMore}
                  </button>
                </div>
              </article>
            ))}
          </section>
        </section>

        {/* ── Habilidades ────────────────────────────────────── */}
        <section id="skills" data-lgcy-reveal className="lgcy-fade-in mx-auto w-[90%] scroll-mt-24">
          <h2 className="w-full p-10 text-center text-[1.5em] font-bold">
            <span className="text-[#66ccff]">{t.legacy.skills}</span>
          </h2>
          <div className="mx-auto w-full justify-center gap-20">
            {skillGroups.map((group, gi) => {
              const even = gi % 2 === 1;
              return (
                <section key={group.label} className="relative mb-10">
                  <h2
                    className={`lgcy-group-label z-10 w-[150px] overflow-hidden text-center text-[clamp(1.2em,1vw,1.4em)] font-bold whitespace-nowrap text-ellipsis uppercase max-md:static max-md:mx-auto max-md:mb-2 max-md:rotate-0 md:absolute md:top-[15px] ${
                      even ? "md:right-[-50px]" : "md:left-[-50px]"
                    }`}
                    style={{ ["--lgcy-deg" as string]: even ? "45deg" : "-45deg" }}
                  >
                    <span className="text-[#66ccff]">{group.label}</span>
                  </h2>
                  <div className="grid auto-rows-auto grid-cols-[repeat(auto-fit,minmax(70px,auto))] justify-around gap-[25px] rounded-[10px] bg-[#1e1e1e] px-10 py-5">
                    {group.skills.map((skill) => (
                      <div
                        key={skill.id}
                        className="group relative flex flex-col items-center justify-center text-center transition-all duration-500"
                      >
                        <div className="flex h-[70px] w-[70px] items-center justify-center">
                          <SkillIcon skill={skill} size={70} className="grayscale brightness-[1.2]" />
                        </div>
                        <span className="mt-2 text-xs text-[#f0f0f0]/70 md:hidden">{skill.name}</span>
                        <h3 className="lgcy-skill-tip pointer-events-none absolute bottom-0 hidden h-9 w-[120px] rounded-[5px] bg-[#454546] py-1 text-center text-[1.1em] text-[#0df8f9] opacity-0 shadow-[0_5px_20px_rgba(255,255,255,0.25)] transition-all duration-500 group-hover:-translate-y-[100px] group-hover:opacity-100 md:block">
                          {skill.name}
                        </h3>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </section>

        {/* ── Certificaciones ────────────────────────────────── */}
        <section id="certifications" data-lgcy-reveal className="lgcy-fade-in scroll-mt-24">
          <h2 className="w-full px-10 pt-5 pb-10 text-center text-[1.5em] font-bold">
            <span className="text-[#66ccff]">{t.legacy.certifications}</span>
          </h2>
          <div className="mx-auto grid w-[90%] grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
            {certifications.map((cert) => {
              const linkLabel = legacyCertLinkLabel(cert.url, {
                badge: t.legacy.certBadge,
                validate: t.legacy.certValidate,
                view: t.legacy.certView,
              });
              return (
                <div
                  key={cert.id}
                  className="rounded-[10px] bg-[#1e1e1e] p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_25px_rgba(102,204,255,0.15)]"
                >
                  <h3 className="text-lg font-bold">
                    <span className="text-[#66ccff]">{cert.name}</span>
                  </h3>
                  <p className="mt-2.5 font-extrabold italic">{cert.issuer}</p>
                  <p>{cert.date}</p>
                  {cert.folio && (
                    <p>
                      {t.legacy.certFolio}: <b>{cert.folio}</b>
                    </p>
                  )}
                  {cert.url && linkLabel && (
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2.5 inline-block font-bold text-[#66ccff] hover:underline"
                    >
                      {linkLabel}
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="mt-[50px] border-t border-[#66ccff] bg-[#1e1e1e] px-1.5 py-1.5 text-center text-[1.8em] font-bold">
        <b>{year}</b> | <span className="text-[#66ccff]">G-Darko</span>
      </footer>

      {/* Era switcher: fixed corner chip, legacy styling (plan §2.6). */}
      <div className="fixed right-4 bottom-4 z-[3500]">
        <EraSwitcher currentEra="legacy" variant="legacy" />
      </div>

      <LegacyProjectModal project={openProject} onClose={() => setOpenProject(null)} />
      <LegacyContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}
