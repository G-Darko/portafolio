"use client";

import { motion } from "motion/react";
import { useTranslation } from "@/lib/i18n/useTranslation";

export default function ExperienceWindow() {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative border-l-2 border-hud-cyan pl-4"
      >
        <div className="absolute -left-[5px] top-0 h-2.5 w-2.5 rounded-full bg-hud-cyan shadow-[0_0_8px_var(--hud-cyan)]" />
        <h3 className="text-sm font-bold text-foreground">
          {t.experience.leamsiTitle}
        </h3>
        <p className="text-[10px] text-muted-foreground">
          {t.experience.leamsiDate}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-foreground">
          {t.experience.leamsiDesc}
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          {["Astro", "Tailwind CSS", "JavaScript"].map((tag) => (
            <span
              key={tag}
              className="rounded border border-hud-border bg-hud-cyan/5 px-1.5 py-0.5 text-[9px] text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
