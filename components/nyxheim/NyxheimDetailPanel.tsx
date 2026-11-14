"use client";

import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Copy, Check, ExternalLink, X, Phone } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { getMissionCopy, getSubMissionCopy } from "@/lib/i18n/missionContent";
import { missions, type SubMission } from "@/lib/data/missions";
import { buildSkills, type Skill } from "@/lib/data/skills";
import { getCertifications } from "@/lib/data/certifications";
import { getCvContent, getContactItems } from "@/lib/data/cv";
import { profileSnapshot } from "@/lib/data/snapshot";
import { CONTACT_EMAIL, CV_PATH, GITHUB_AVATAR_URL } from "@/lib/data/profile";
import {
  DOCK_BODIES,
  NYXHEIM_STATS,
  PROJECT_BODIES,
  getBodyProject,
  getProjectBodyBySlug,
  getSiblingProjects,
  type NyxheimBody,
} from "@/lib/nyxheim/bodies";
import { useNyxheimStore, usePrefersReducedMotion } from "@/lib/nyxheim/useNyxheimStore";
import SkillIcon from "@/components/SkillIcon";
import MissionMediaViewer from "@/components/missions/MissionMediaViewer";

/** Section that reveals on scroll (opacity-only under reduced motion). */
function Reveal({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="scroll-mt-4 space-y-2"
    >
      {children}
    </motion.section>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="font-mono text-xs tracking-[0.2em] text-hud-cyan uppercase md:text-sm">
      {children}
    </h3>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-hud-border/70 bg-hud-bg/70 px-2.5 py-1 text-sm text-foreground">
      {children}
    </span>
  );
}

function OutLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="hud-focus-ring inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-hud-border/70 bg-hud-cyan/5 px-3 py-2 text-sm font-medium text-hud-cyan transition-colors hover:bg-hud-cyan/15"
    >
      {children}
      <ExternalLink size={14} aria-hidden />
    </a>
  );
}

/** Real favicon of a service (the `icon` URL from the profile snapshot).
    Falls back to the service initial if the remote icon fails to load. */
function FaviconImg({ src, alt, size = 18 }: { src?: string; alt: string; size?: number }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <span
        aria-hidden
        className="flex shrink-0 items-center justify-center rounded bg-hud-cyan/15 font-mono text-xs font-bold text-hud-cyan"
        style={{ width: size, height: size }}
      >
        {alt.charAt(0)}
      </span>
    );
  }
  return (
    <img
      src={src}
      alt=""
      aria-hidden
      width={size}
      height={size}
      loading="lazy"
      onError={() => setFailed(true)}
      className="shrink-0 rounded-sm"
    />
  );
}

/** Gael's profile photo (GitHub avatar of the login in the snapshot). */
export function AvatarImg({ size = 56 }: { size?: number }) {
  const { t } = useTranslation();
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span
        aria-hidden
        className="flex shrink-0 items-center justify-center rounded-full border border-hud-cyan/40 bg-hud-cyan/10 font-mono text-xl font-bold text-hud-cyan"
        style={{ width: size, height: size }}
      >
        G
      </span>
    );
  }
  return (
    <img
      src={GITHUB_AVATAR_URL}
      alt={t.nyxheim.avatarAlt}
      width={size}
      height={size}
      loading="lazy"
      onError={() => setFailed(true)}
      className="shrink-0 rounded-full border border-hud-cyan/40 object-cover"
      style={{ width: size, height: size }}
    />
  );
}

/** Skill id for a stack chip (match by sprite, then by name). */
function skillIdForStackItem(item: { title: string; sprite?: string }): string | undefined {
  if (item.sprite) {
    const bySprite = buildSkills.find((s) => s.sprite === item.sprite);
    if (bySprite) return bySprite.id;
  }
  return buildSkills.find((s) => s.name.toLowerCase() === item.title.toLowerCase())?.id;
}

/* ── Project panel ─────────────────────────────────────────── */

function ProjectPanel({ body, project }: { body: NyxheimBody; project: SubMission }) {
  const { t, locale } = useTranslation();
  const focus = useNyxheimStore((s) => s.focus);
  const reduced = usePrefersReducedMotion();
  const copy = getSubMissionCopy(locale, project);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToSection = useCallback(
    (id: string) => {
      const root = scrollRef.current;
      const el = root?.querySelector(`#${id}`);
      if (!el) return;
      el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    },
    [reduced]
  );

  const idx = PROJECT_BODIES.findIndex((b) => b.id === body.id);
  const prev = PROJECT_BODIES[(idx - 1 + PROJECT_BODIES.length) % PROJECT_BODIES.length];
  const next = PROJECT_BODIES[(idx + 1) % PROJECT_BODIES.length];
  const siblings = getSiblingProjects(body);
  const isCreser = body.projectSlug === "creser";

  return (
    <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto p-4 md:p-5">
      <div className="flex flex-wrap gap-2">
        {[
          { id: "nyx-media", label: t.nyxheim.media },
          { id: "nyx-highlights", label: t.nyxheim.highlights },
          { id: "nyx-stack", label: t.nyxheim.stack },
          { id: "nyx-links", label: t.nyxheim.links },
        ].map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => scrollToSection(s.id)}
            className="hud-focus-ring rounded-full border border-hud-border/60 px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-hud-cyan/50 hover:text-hud-cyan"
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-5">
        <Reveal id="nyx-media">
          <MissionMediaViewer
            images={project.images ?? []}
            video={project.video}
            title={copy.title}
          />
        </Reveal>

        <Reveal>
          <SectionTitle>{t.nyxheim.summary}</SectionTitle>
          <p className="text-base leading-relaxed text-pretty text-muted-foreground">
            {copy.description}
          </p>
          {copy.period && (
            <p className="font-mono text-sm text-muted-foreground">{copy.period}</p>
          )}
          {isCreser && (
            <p>
              <Chip>{t.nyxheim.whiteLabel}</Chip>
            </p>
          )}
        </Reveal>

        {project.highlights?.[locale] && project.highlights[locale].length > 0 && (
          <Reveal id="nyx-highlights">
            <SectionTitle>{t.nyxheim.highlights}</SectionTitle>
            <ul className="space-y-2">
              {project.highlights[locale].map((h, i) => (
                <li key={i} className="flex gap-2 text-base leading-relaxed text-pretty text-foreground">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-hud-cyan" />
                  {h}
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        <Reveal id="nyx-stack">
          <SectionTitle>{t.nyxheim.stack}</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {project.stack.map((item, i) => {
              const skillId = skillIdForStackItem(item);
              const chip = (
                <>
                  <SkillIcon skill={{ icon: item.icon, sprite: item.sprite, uiIcon: undefined }} size={16} />
                  {item.title}
                </>
              );
              // A technology is a destination: click it and the camera flies
              // to its star in Sinistra (only when it maps to a skill).
              return skillId ? (
                <button
                  key={`${item.title}-${i}`}
                  type="button"
                  onClick={() => useNyxheimStore.getState().focusSkill(skillId)}
                  title={t.nyxheim.goToStar}
                  aria-label={`${item.title} — ${t.nyxheim.goToStar}`}
                  className="hud-focus-ring inline-flex items-center gap-1.5 rounded-full border border-hud-border/70 bg-hud-bg/70 px-2.5 py-1 text-sm text-foreground transition-colors hover:border-hud-cyan/60 hover:bg-hud-cyan/10 hover:text-hud-cyan"
                >
                  {chip}
                </button>
              ) : (
                <Chip key={`${item.title}-${i}`}>{chip}</Chip>
              );
            })}
          </div>
        </Reveal>

        <Reveal id="nyx-links">
          <SectionTitle>{t.nyxheim.links}</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {project.liveUrl && <OutLink href={project.liveUrl}>{t.missionsUI.live}</OutLink>}
            {project.repoUrl && <OutLink href={project.repoUrl}>{t.missionsUI.repo}</OutLink>}
            {project.appStoreUrl && <OutLink href={project.appStoreUrl}>{t.missionsUI.appStore}</OutLink>}
            {project.playStoreUrl && <OutLink href={project.playStoreUrl}>{t.missionsUI.playStore}</OutLink>}
            {project.tenantUrl && <OutLink href={project.tenantUrl}>{t.missionsUI.tenant}</OutLink>}
          </div>
        </Reveal>

        {siblings.length > 0 && (
          <Reveal>
            <SectionTitle>{t.nyxheim.alsoInOrbit}</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {siblings.map((s) => {
                const target = getProjectBodyBySlug(s.slug);
                if (!target) return null;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => focus(target.id)}
                    className="hud-focus-ring rounded-full border border-hud-border/60 px-3 py-1.5 text-sm text-foreground transition-colors hover:border-hud-cyan/50 hover:text-hud-cyan"
                  >
                    {getSubMissionCopy(locale, s).title}
                  </button>
                );
              })}
            </div>
          </Reveal>
        )}

        <div className="flex items-center justify-between gap-2 border-t border-hud-border/50 pt-3">
          <button
            type="button"
            onClick={() => prev && focus(prev.id)}
            className="hud-focus-ring inline-flex min-h-11 items-center gap-1 rounded-lg px-2 py-2 font-mono text-sm text-muted-foreground transition-colors hover:text-hud-cyan"
          >
            <ChevronLeft size={16} aria-hidden />
            {t.nyxheim.prevBody}
          </button>
          <button
            type="button"
            onClick={() => next && focus(next.id)}
            className="hud-focus-ring inline-flex min-h-11 items-center gap-1 rounded-lg px-2 py-2 font-mono text-sm text-muted-foreground transition-colors hover:text-hud-cyan"
          >
            {t.nyxheim.nextBody}
            <ChevronRight size={16} aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Skills panel (the constellation) ──────────────────────── */

const SKILL_GROUP_LABEL: Record<string, "frontend" | "backend" | "mobile" | "databases" | "graphics" | "environment"> = {
  frontend: "frontend",
  backend: "backend",
  mobile: "mobile",
  database: "databases",
  graphics: "graphics",
  tools: "environment",
};

function SkillsPanel() {
  const { t } = useTranslation();
  const hoveredSkillId = useNyxheimStore((s) => s.hoveredSkillId);
  const focusedSkillId = useNyxheimStore((s) => s.focusedSkillId);
  const setHoveredSkill = useNyxheimStore((s) => s.setHoveredSkill);
  const focusSkill = useNyxheimStore((s) => s.focusSkill);

  const groups = useMemo(() => {
    const map = new Map<string, Skill[]>();
    for (const skill of buildSkills) {
      const list = map.get(skill.category) ?? [];
      list.push(skill);
      map.set(skill.category, list);
    }
    return [...map.entries()];
  }, []);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-4 md:p-5">
      <div className="space-y-5">
        {groups.map(([category, skills]) => (
          <Reveal key={category}>
            <SectionTitle>{t.skills[SKILL_GROUP_LABEL[category] ?? "environment"]}</SectionTitle>
            <ul className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {skills.map((skill) => (
                <li key={skill.id}>
                  <button
                    type="button"
                    onClick={() => focusSkill(skill.id)}
                    title={t.nyxheim.goToStar}
                    aria-label={`${skill.name} — ${t.nyxheim.goToStar}`}
                    onPointerEnter={() => setHoveredSkill(skill.id)}
                    onPointerLeave={() => setHoveredSkill(null)}
                    onFocus={() => setHoveredSkill(skill.id)}
                    onBlur={() => setHoveredSkill(null)}
                    className={`hud-focus-ring flex w-full items-center gap-2.5 rounded-lg border px-3 py-2 text-left text-base transition-colors ${
                      hoveredSkillId === skill.id || focusedSkillId === skill.id
                        ? "border-hud-cyan/60 bg-hud-cyan/10 text-foreground"
                        : "border-hud-border/50 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <SkillIcon skill={skill} size={20} />
                    <span className="min-w-0 truncate">{skill.name}</span>
                    {skill.url && (
                      <a
                        href={skill.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`${skill.name} — ${t.missionsUI.live}`}
                        className="ml-auto shrink-0 text-hud-cyan/70 hover:text-hud-cyan"
                      >
                        <ExternalLink size={14} aria-hidden />
                      </a>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* ── Certifications panel ──────────────────────────────────── */

function CertificationsPanel() {
  const { t, locale } = useTranslation();
  const certs = getCertifications(locale);
  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-4 md:p-5">
      <div className="space-y-3">
        {certs.map((cert) => (
          <Reveal key={cert.id}>
            <div className="flex items-start gap-3 rounded-lg border border-hud-border/60 bg-hud-bg/40 p-3">
              <span
                aria-hidden
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold"
                style={{ backgroundColor: `${cert.color}22`, color: cert.color }}
              >
                {cert.emblem}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-base leading-snug font-medium text-foreground">{cert.name}</p>
                <p className="font-mono text-sm text-muted-foreground">
                  {cert.issuer} — {cert.date}
                </p>
                {cert.url && (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hud-focus-ring mt-1 inline-flex items-center gap-1 font-mono text-sm text-hud-cyan hover:underline"
                  >
                    {t.certifications.link}
                    <ExternalLink size={13} aria-hidden />
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* ── CV panel ──────────────────────────────────────────────── */

function CvPanel() {
  const { t, locale } = useTranslation();
  const cv = getCvContent(locale);
  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-4 md:p-5">
      <div className="space-y-5">
        <Reveal>
          <SectionTitle>{t.nyxheim.summary}</SectionTitle>
          <p className="text-base leading-relaxed text-pretty text-muted-foreground">{cv.summary}</p>
          <p className="font-mono text-sm text-muted-foreground">{cv.location}</p>
        </Reveal>
        <Reveal>
          <SectionTitle>{cv.titles.experience}</SectionTitle>
          <div className="space-y-4">
            {cv.roles.map((role, i) => (
              <div key={i} className="space-y-1.5">
                <p className="text-base leading-snug font-medium text-foreground">{role.title}</p>
                <p className="font-mono text-sm text-muted-foreground">
                  {role.org} — {role.period}
                </p>
                <ul className="space-y-1.5">
                  {role.bullets.map((b, j) => (
                    <li key={j} className="flex gap-2 text-base leading-relaxed text-pretty text-muted-foreground">
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-hud-cyan" />
                      <span>
                        {b.label && <strong className="text-foreground">{b.label}: </strong>}
                        {b.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal>
          <SectionTitle>{cv.titles.skills}</SectionTitle>
          <div className="space-y-3">
            {cv.skillGroups.map((g) => (
              <div key={g.label}>
                <p className="font-mono text-sm text-hud-cyan">{g.label}</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {g.items.map((item) => (
                    <Chip key={item}>{item}</Chip>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal>
          <SectionTitle>{cv.titles.education}</SectionTitle>
          <ul className="space-y-1.5">
            {cv.education.map((e) => (
              <li key={e.title} className="text-base text-muted-foreground">
                <span className="text-foreground">{e.title}</span> — {e.org} ({e.period})
              </li>
            ))}
          </ul>
          <p className="mt-2 font-mono text-sm text-muted-foreground">{cv.languages.join(" / ")}</p>
        </Reveal>
        <Link
          href={CV_PATH}
          className="hud-focus-ring inline-flex min-h-11 items-center gap-2 rounded-lg border border-hud-cyan/40 bg-hud-cyan/10 px-4 py-2.5 text-base font-medium text-hud-cyan transition-colors hover:bg-hud-cyan/20"
        >
          {t.nyxheim.viewCv}
          <ExternalLink size={16} aria-hidden />
        </Link>
      </div>
    </div>
  );
}

/* ── Profile panel (Nyxheim station only — the sun does nothing) ── */

function ProfilePanel() {
  const { t, locale } = useTranslation();
  const focus = useNyxheimStore((s) => s.focus);
  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-4 md:p-5">
      <div className="space-y-5">
        <Reveal>
          <div className="flex items-center gap-3">
            <AvatarImg size={56} />
            <div className="min-w-0">
              <p className="truncate text-lg leading-snug font-bold text-foreground">{t.profile.name}</p>
              <p className="font-mono text-sm text-hud-cyan">{t.profile.role}</p>
            </div>
          </div>
        </Reveal>
        <Reveal>
          <SectionTitle>{t.nyxheim.summary}</SectionTitle>
          <p className="text-base leading-relaxed text-pretty text-muted-foreground">{t.profile.about}</p>
          <p className="font-mono text-sm text-muted-foreground">
            {t.nyxheim.location} — {t.nyxheim.coordinates}
          </p>
        </Reveal>
        <Reveal>
          <SectionTitle>{t.nyxheim.experience}</SectionTitle>
          <ul className="space-y-2">
            {missions.map((mission) => {
              const copy = getMissionCopy(locale, mission);
              return (
                <li key={mission.id} className="text-base text-muted-foreground">
                  <span className="text-foreground">{copy.title}</span>
                  {copy.role ? ` — ${copy.role}` : ""} ({copy.period})
                </li>
              );
            })}
          </ul>
        </Reveal>
        <Reveal>
          <SectionTitle>{t.nyxheim.links}</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {profileSnapshot.socials.map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hud-focus-ring inline-flex min-h-10 items-center gap-2 rounded-lg border border-hud-border/70 bg-hud-cyan/5 px-3 py-2 text-sm font-medium text-hud-cyan transition-colors hover:bg-hud-cyan/15"
              >
                <FaviconImg src={s.icon} alt={s.title} />
                {s.title}
              </a>
            ))}
          </div>
        </Reveal>
        <button
          type="button"
          onClick={() => focus("contacto")}
          className="hud-focus-ring inline-flex min-h-11 items-center rounded-lg border border-hud-cyan/40 bg-hud-cyan/10 px-4 py-2.5 text-base font-medium text-hud-cyan transition-colors hover:bg-hud-cyan/20"
        >
          {t.header.contact}
        </button>
      </div>
    </div>
  );
}

/* ── Contact panel ─────────────────────────────────────────── */

function ContactPanel() {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const items = getContactItems();

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable: the mailto link below still works.
    }
  };

  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-4 md:p-5">
      <div className="space-y-5">
        <Reveal>
          <p className="text-base leading-relaxed text-pretty text-muted-foreground">{t.contact.desc}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="hud-focus-ring inline-flex min-h-11 items-center rounded-lg border border-hud-cyan/40 bg-hud-cyan/10 px-4 py-2.5 text-base font-medium break-all text-hud-cyan transition-colors hover:bg-hud-cyan/20"
            >
              {CONTACT_EMAIL}
            </a>
            <button
              type="button"
              onClick={copyEmail}
              className="hud-focus-ring inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-hud-border/70 px-3 py-2.5 text-sm text-foreground transition-colors hover:border-hud-cyan/50"
            >
              {copied ? <Check size={15} aria-hidden /> : <Copy size={15} aria-hidden />}
              {copied ? t.nyxheim.copied : t.nyxheim.copyEmail}
            </button>
          </div>
        </Reveal>
        <Reveal>
          <SectionTitle>{t.contact.channels}</SectionTitle>
          <ul className="space-y-2">
            {profileSnapshot.socials.map((s) => (
              <li key={s.id}>
                <a
                  href={s.url}
                  target={s.url.startsWith("http") ? "_blank" : undefined}
                  rel={s.url.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="hud-focus-ring inline-flex items-center gap-2.5 rounded-lg border border-hud-border/60 bg-hud-bg/40 px-3 py-2 text-base text-foreground transition-colors hover:border-hud-cyan/50 hover:text-hud-cyan"
                >
                  <FaviconImg src={s.icon} alt={s.title} size={20} />
                  <span className="min-w-0 truncate">{s.label ?? s.title}</span>
                </a>
              </li>
            ))}
            {items
              .filter((item) => item.kind === "phone")
              .map((item) => (
                <li key={item.kind}>
                  <a
                    href={item.href}
                    className="hud-focus-ring inline-flex items-center gap-2.5 rounded-lg border border-hud-border/60 bg-hud-bg/40 px-3 py-2 font-mono text-base text-muted-foreground transition-colors hover:border-hud-cyan/50 hover:text-hud-cyan"
                  >
                    <Phone size={18} aria-hidden className="shrink-0" />
                    <span className="min-w-0 truncate">{item.label}</span>
                  </a>
                </li>
              ))}
          </ul>
        </Reveal>
      </div>
    </div>
  );
}

/* ── Erebo panel (the black hole at the edge of Exordia) ─────── */

function EreboPanel() {
  const { t } = useTranslation();
  const goOverview = useNyxheimStore((s) => s.goOverview);
  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-4 md:p-5">
      <div className="space-y-5">
        <Reveal>
          <p className="text-base leading-relaxed text-pretty text-muted-foreground">{t.nyxheim.ereboAbout}</p>
        </Reveal>
        <button
          type="button"
          onClick={() => goOverview()}
          className="hud-focus-ring inline-flex min-h-11 items-center rounded-lg border border-hud-cyan/40 bg-hud-cyan/10 px-4 py-2.5 text-base font-medium text-hud-cyan transition-colors hover:bg-hud-cyan/20"
        >
          {t.nyxheim.backToOverview}
        </button>
      </div>
    </div>
  );
}

/* ── Panel shell ───────────────────────────────────────────── */

export function NyxheimDetailPanel({ body }: { body: NyxheimBody }) {
  const { t, locale } = useTranslation();
  const goOverview = useNyxheimStore((s) => s.goOverview);
  const focus = useNyxheimStore((s) => s.focus);

  const { title, subtitle } = (() => {
    const project = getBodyProject(body);
    if (project) {
      const copy = getSubMissionCopy(locale, project);
      return { title: copy.title, subtitle: copy.tagline };
    }
    switch (body.kind) {
      case "station":
        // Nyxheim is the station: Gael's profile, living in the system.
        // (The sun does nothing: it is not a destination and never opens a panel.)
        return { title: t.nyxheim.base, subtitle: t.nyxheim.station };
      case "certs":
        return { title: t.header.certifications, subtitle: t.nyxheim.certs };
      case "cv":
        return { title: "CV", subtitle: t.profile.name };
      case "contact":
        return { title: t.header.contact, subtitle: CONTACT_EMAIL };
      case "constellation":
        return { title: t.nyxheim.sinistra, subtitle: `${NYXHEIM_STATS.skills} ${t.nyxheim.technologies}` };
      case "blackhole":
        return { title: t.nyxheim.erebo, subtitle: t.nyxheim.ereboRole };
      default:
        return { title: body.id, subtitle: "" };
    }
  })();

  const content = (() => {
    const project = getBodyProject(body);
    if (project) return <ProjectPanel body={body} project={project} />;
    switch (body.kind) {
      case "station":
        return <ProfilePanel />;
      case "certs":
        return <CertificationsPanel />;
      case "cv":
        return <CvPanel />;
      case "contact":
        return <ContactPanel />;
      case "constellation":
        return <SkillsPanel />;
      case "blackhole":
        return <EreboPanel />;
      default:
        return null;
    }
  })();

  const dockIdx = DOCK_BODIES.findIndex((b) => b.id === body.id);
  const dockPrev = dockIdx > 0 ? DOCK_BODIES[(dockIdx - 1 + DOCK_BODIES.length) % DOCK_BODIES.length] : undefined;
  const dockNext = dockIdx >= 0 ? DOCK_BODIES[(dockIdx + 1) % DOCK_BODIES.length] : undefined;

  return (
    <motion.aside
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      aria-label={title}
      className="pointer-events-auto absolute z-30 flex flex-col overflow-hidden rounded-2xl border border-hud-border/80 bg-hud-bg/85 shadow-[0_0_40px_oklch(0.65_0.18_255/0.18)] backdrop-blur-xl max-md:inset-x-3 max-md:bottom-24 max-md:max-h-[52vh] md:top-20 md:right-4 md:bottom-24 md:w-[min(30rem,44vw)]"
      style={{ boxShadow: `0 0 48px ${body.color}30, 0 0 40px oklch(0.65 0.18 255 / 0.15)` }}
    >
      {/* Orbit accent: the panel is part of the world — its top edge glows
          with the focused body's own color. */}
      <div
        aria-hidden
        className="h-1 w-full shrink-0"
        style={{
          background: `linear-gradient(90deg, transparent, ${body.color} 35%, ${body.color} 65%, transparent)`,
        }}
      />
      <div className="flex items-center justify-between gap-2 border-b border-hud-border/60 px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2.5">
          {/* Shared element: the dock chip flies here. */}
          <motion.span
            layoutId={`nyx-chip-${body.id}`}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold"
            style={{ backgroundColor: `${body.color}22`, color: body.color }}
          >
            {title.charAt(0)}
          </motion.span>
          <div className="min-w-0">
            <span className="block font-mono text-[10px] tracking-[0.24em] text-hud-cyan/70 uppercase">
              {t.nyxheim.systemName}
            </span>
            <span className="block truncate text-base leading-snug font-bold tracking-[0.12em] text-foreground">
              {title}
            </span>
            {subtitle && (
              <span className="block truncate font-mono text-sm leading-snug text-muted-foreground">
                {subtitle}
              </span>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={goOverview}
          className="hud-focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded font-mono text-sm text-muted-foreground transition-colors hover:bg-hud-cyan/10 hover:text-hud-red"
          aria-label={t.nyxheim.close}
        >
          <X size={16} aria-hidden />
        </button>
      </div>

      {content}

      <div className="flex items-center justify-between gap-2 border-t border-hud-border/50 px-3 py-2">
        <button
          type="button"
          onClick={() => goOverview()}
          className="hud-focus-ring min-h-10 rounded-lg px-2 py-2 font-mono text-sm text-muted-foreground transition-colors hover:text-hud-cyan"
        >
          {t.nyxheim.backToOverview}
        </button>
        <div className="flex gap-1">
          {dockPrev && (
            <button
              type="button"
              onClick={() => focus(dockPrev.id)}
              aria-label={t.nyxheim.prevBody}
              className="hud-focus-ring flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-hud-cyan/10 hover:text-hud-cyan"
            >
              <ChevronLeft size={16} aria-hidden />
            </button>
          )}
          {dockNext && (
            <button
              type="button"
              onClick={() => focus(dockNext.id)}
              aria-label={t.nyxheim.nextBody}
              className="hud-focus-ring flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-hud-cyan/10 hover:text-hud-cyan"
            >
              <ChevronRight size={16} aria-hidden />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
