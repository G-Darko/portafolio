"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import type { Skill } from "@/lib/data/skills";
import { useSkills } from "@/lib/data/useSkills";

const CATEGORY_KEYS = [
  "frontend",
  "backend",
  "mobile",
  "database",
  "graphics",
  "tools",
] as const;

interface SkillsWindowProps {
  onHoverSkill?: (sphereId: string | null) => void;
}

function SkillIcon({ skill }: { skill: Skill }) {
  const [failed, setFailed] = useState(false);

  if (skill.icon && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- remote SVG from the skills API in a static export
      <img
        src={skill.icon}
        alt=""
        width={18}
        height={18}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="size-[18px] shrink-0 rounded-sm"
      />
    );
  }

  if (!skill.sphereId) return <span aria-hidden className="size-[18px] shrink-0" />;

  return (
    <svg width="14" height="14" className="mx-0.5 shrink-0 text-hud-cyan" fill="currentColor">
      <use href={`#${skill.sphereId}`} />
    </svg>
  );
}

export default function SkillsWindow({ onHoverSkill }: SkillsWindowProps) {
  const { t } = useTranslation();
  const skills = useSkills();
  const [catIndex, setCatIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCatIndex((i) => (i + 1) % CATEGORY_KEYS.length), 3200);
    return () => clearInterval(id);
  }, []);

  const categoryLabel = (cat: (typeof CATEGORY_KEYS)[number]) => {
    if (cat === "database") return t.skills.databases;
    if (cat === "tools") return t.skills.environment;
    if (cat === "mobile") return t.skills.mobile;
    if (cat === "graphics") return t.skills.graphics;
    return t.skills[cat as "frontend" | "backend"];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-sm font-bold tracking-widest text-hud-cyan uppercase md:text-base">
          {t.skills.title}
        </h3>
        <AnimatePresence mode="wait">
          <motion.span
            key={CATEGORY_KEYS[catIndex]}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="-rotate-12 font-mono text-sm font-bold tracking-widest text-hud-cyan/70 uppercase"
          >
            {categoryLabel(CATEGORY_KEYS[catIndex])}
          </motion.span>
        </AnimatePresence>
      </div>

      {CATEGORY_KEYS.map((cat) => {
        const labelKey =
          cat === "database"
            ? "databases"
            : cat === "tools"
              ? "environment"
              : cat === "mobile"
                ? "mobile"
                : cat === "graphics"
                  ? "graphics"
                  : cat;
        const items = skills.filter((item) => item.category === cat);
        if (items.length === 0) return null;
        return (
          <motion.div
            key={cat}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-2"
          >
            <p className="font-mono text-sm tracking-widest text-muted-foreground uppercase">
              {t.skills[labelKey as keyof typeof t.skills]}
            </p>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  onMouseEnter={() => onHoverSkill?.(item.sphereId ?? null)}
                  onMouseLeave={() => onHoverSkill?.(null)}
                  onFocus={() => onHoverSkill?.(item.sphereId ?? null)}
                  onBlur={() => onHoverSkill?.(null)}
                  className="flex items-center gap-2 rounded border border-hud-border/60 bg-hud-bg/30 px-2 py-1.5 transition-all duration-200 hover:border-hud-cyan/50 hover:bg-hud-cyan/10 hover:shadow-[0_0_14px_color-mix(in_oklch,var(--hud-cyan)_18%,transparent)]"
                >
                  <SkillIcon skill={item} />
                  <span className="truncate font-mono text-sm text-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
