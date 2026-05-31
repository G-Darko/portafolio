"use client";

import { motion } from "motion/react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Briefcase } from "lucide-react";

export default function ExperienceWindow() {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative border-l-2 pl-4"
        style={{ borderColor: "var(--c1)" }}
      >
        <div
          className="absolute -left-[5px] top-0 h-2.5 w-2.5 rounded-full"
          style={{ background: "var(--c1)", boxShadow: "0 0 8px var(--c1)" }}
        />
        <h3 className="text-sm font-bold" style={{ color: "var(--text)" }}>
          {t.experience.leamsiTitle}
        </h3>
        <p className="text-[10px] opacity-50" style={{ color: "var(--accent)" }}>
          {t.experience.leamsiDate}
        </p>
        <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--text)" }}>
          {t.experience.leamsiDesc}
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          {["Astro", "Tailwind CSS", "JavaScript"].map((tag) => (
            <span
              key={tag}
              className="rounded px-1.5 py-0.5 text-[9px]"
              style={{
                border: "1px solid var(--glass-border)",
                color: "var(--accent)",
                background: "rgba(102,204,255,0.05)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
