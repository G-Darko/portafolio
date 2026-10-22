"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import type { HudCategory } from "@/lib/data/api";
import { useSkills } from "@/lib/data/useSkills";
import SkillIcon from "@/components/SkillIcon";

type SkillsCopy = ReturnType<typeof useTranslation>["t"]["skills"];

/** Order and translation key of each skills section. */
const CATEGORY_META: { id: HudCategory; label: keyof SkillsCopy }[] = [
  { id: "frontend", label: "frontend" },
  { id: "backend", label: "backend" },
  { id: "mobile", label: "mobile" },
  { id: "database", label: "databases" },
  { id: "graphics", label: "graphics" },
  { id: "tools", label: "environment" },
];

interface SkillsWindowProps {
  onHoverSkill?: (sphereId: string | null) => void;
}

export default function SkillsWindow({ onHoverSkill }: SkillsWindowProps) {
  const { t } = useTranslation();
  const skills = useSkills();
  const [catIndex, setCatIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCatIndex((i) => (i + 1) % CATEGORY_META.length), 3200);
    return () => clearInterval(id);
  }, []);

  const current = CATEGORY_META[catIndex];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-sm font-bold tracking-widest text-hud-cyan uppercase md:text-base">
          {t.skills.title}
        </h3>
        <AnimatePresence mode="wait">
          <motion.span
            key={current.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="-rotate-12 font-mono text-sm font-bold tracking-widest text-hud-cyan/70 uppercase"
          >
            {t.skills[current.label]}
          </motion.span>
        </AnimatePresence>
      </div>

      {CATEGORY_META.map(({ id: cat, label }) => {
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
              {t.skills[label]}
            </p>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  onMouseEnter={() => onHoverSkill?.(item.sprite ?? null)}
                  onMouseLeave={() => onHoverSkill?.(null)}
                  onFocus={() => onHoverSkill?.(item.sprite ?? null)}
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
