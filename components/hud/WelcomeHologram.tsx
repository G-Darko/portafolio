"use client";

import { motion } from "motion/react";
import { useTranslation } from "@/lib/i18n/useTranslation";

export default function WelcomeHologram() {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, x: -24, filter: "blur(8px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, x: -16, filter: "blur(6px)" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative max-w-sm flex-1 px-2 md:max-w-md lg:max-w-lg"
    >
      <div
        className="relative overflow-hidden rounded-lg border border-dashed border-hud-cyan/30 bg-hud-bg/30 p-6 backdrop-blur-md md:p-8"
        style={{
          boxShadow:
            "0 0 40px oklch(0.65 0.18 255 / 0.08), inset 0 0 30px oklch(0.65 0.18 255 / 0.03)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, oklch(0.65 0.18 255 / 0.04) 2px, oklch(0.65 0.18 255 / 0.04) 4px)",
          }}
        />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-hud-green shadow-[0_0_8px_var(--hud-green)]" />
            <span className="font-mono text-[10px] tracking-[0.25em] text-hud-green uppercase">
              {t.bootup.granted}
            </span>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="font-mono text-lg font-bold tracking-wide text-hud-cyan md:text-xl"
          >
            {t.bootup.welcomeTitle}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-mono text-xs leading-relaxed text-muted-foreground md:text-sm"
          >
            {t.bootup.welcomeHint}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex gap-1 pt-2"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1 w-8 rounded-full bg-hud-cyan/20"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
