"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useHUDStore, type PanelId } from "@/lib/store/useHUDStore";
import { playWindowOpen } from "@/lib/audio/audio";
import Link from "next/link";
import { getHudBasePath } from "@/lib/hud/routes";

const PRIMARY_ACTIONS: { id: PanelId; labelKey: "profile" | "missions" | "contact" }[] = [
  { id: "profile", labelKey: "profile" },
  { id: "missions", labelKey: "missions" },
  { id: "contact", labelKey: "contact" },
];

export default function WelcomeHologram() {
  const { t } = useTranslation();
  const openPanel = useHUDStore((s) => s.openPanel);
  const openMissionPanel = useHUDStore((s) => s.openMissionPanel);
  const roles = t.bootup.typewriterRoles;
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const base = getHudBasePath();

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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDeleting(false);
      setRoleIndex((i) => (i + 1) % roles.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, roleIndex, roles]);

  const handleOpen = (id: PanelId) => {
    playWindowOpen();
    openPanel(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-lg flex-1 px-2 md:max-w-xl"
    >
      <div
        className="relative overflow-hidden rounded-lg border border-hud-border/80 bg-hud-bg/55 p-6 backdrop-blur-xl md:p-8"
        style={{
          boxShadow:
            "0 0 40px oklch(0.65 0.18 255 / 0.1), inset 0 1px 0 oklch(1 0 0 / 0.05)",
        }}
      >
        <div className="relative z-10 space-y-4 md:space-y-5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-hud-green shadow-[0_0_8px_var(--hud-green)]" />
            <span className="font-mono text-xs tracking-[0.2em] text-hud-green uppercase md:text-sm">
              {t.bootup.granted}
            </span>
          </div>

          <div className="space-y-2">
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-bold tracking-tight text-foreground md:text-4xl"
            >
              {t.profile.name}
            </motion.h2>

            <p className="min-h-6 font-mono text-sm text-hud-cyan md:text-base">
              {displayed}
              <span className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse bg-hud-cyan align-middle" />
            </p>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-prose text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            {t.bootup.welcomeLead}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="flex flex-wrap gap-2 pt-2"
          >
            {PRIMARY_ACTIONS.map(({ id, labelKey }) => (
              <button
                key={id}
                type="button"
                onClick={() => handleOpen(id)}
                className="min-h-11 rounded border border-hud-cyan/40 px-4 py-2.5 font-mono text-sm font-bold tracking-[0.14em] text-hud-cyan uppercase transition-colors hover:bg-hud-cyan/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hud-cyan md:text-base"
              >
                {t.header[labelKey]}
              </button>
            ))}
          </motion.div>

          <motion.button
            type="button"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.34 }}
            onClick={() => {
              playWindowOpen();
              openMissionPanel("black-sheep");
            }}
            className="w-full rounded-lg border border-hud-border/70 bg-hud-cyan/5 px-4 py-3 text-left transition-colors hover:border-hud-cyan/40 hover:bg-hud-cyan/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hud-cyan"
          >
            <span className="font-mono text-xs tracking-[0.18em] text-hud-cyan/80 uppercase">
              {t.bootup.featuredLabel}
            </span>
            <span className="mt-1 block text-sm font-medium text-foreground md:text-base">
              {t.bootup.featuredMission}
            </span>
          </motion.button>

          <div className="space-y-2 pt-1">
            <Link
              href={`${base}/cv/`}
              className="inline-flex min-h-10 items-center font-mono text-sm tracking-widest text-muted-foreground underline-offset-4 transition-colors hover:text-hud-cyan hover:underline md:text-base"
            >
              {t.profile.viewCv}
            </Link>

            <p className="font-mono text-xs leading-relaxed text-muted-foreground/80 md:text-sm">
              {t.bootup.welcomeHint}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
