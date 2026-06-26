"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "@/lib/i18n/useTranslation";

export default function WelcomeHologram() {
  const { t } = useTranslation();
  const roles = t.bootup.typewriterRoles;
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const full = roles[roleIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && displayed.length < full.length) {
      timeout = setTimeout(() => setDisplayed(full.slice(0, displayed.length + 1)), 45);
    } else if (!deleting && displayed.length === full.length) {
      timeout = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(full.slice(0, displayed.length - 1)), 28);
    } else {
      setDeleting(false);
      setRoleIndex((i) => (i + 1) % roles.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, roleIndex, roles]);

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
            <span className="font-mono text-sm tracking-[0.25em] text-hud-green uppercase">
              {t.bootup.granted}
            </span>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="font-mono text-xl font-bold tracking-wide text-hud-cyan md:text-2xl"
          >
            {t.bootup.welcomeTitle}
          </motion.h2>

          <p className="min-h-5 font-mono text-sm text-hud-cyan/90 md:text-base">
            {displayed}
            <span className="ml-0.5 inline-block h-3 w-0.5 animate-pulse bg-hud-cyan align-middle" />
          </p>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-mono text-sm leading-relaxed text-muted-foreground md:text-base"
          >
            {t.bootup.welcomeHint}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
