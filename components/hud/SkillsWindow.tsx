"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { techStackCatalog } from "@/lib/data/missions";

const CATEGORY_KEYS = [
  "frontend",
  "backend",
  "mobile",
  "database",
  "graphics",
  "tools",
] as const;

export default function SkillsWindow() {
  const { t } = useTranslation();
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
        const items = techStackCatalog.filter((item) => item.category === cat);
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
                  key={item.name}
                  className="flex items-center gap-2 rounded border border-hud-border/60 bg-hud-bg/30 px-2 py-1.5 transition-colors hover:border-hud-cyan/30"
                >
                  <svg width="14" height="14" className="shrink-0 text-hud-cyan" fill="currentColor">
                    <use href={`#${item.iconId}`} />
                  </svg>
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
