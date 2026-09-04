"use client";

import { motion } from "motion/react";
import { Rocket, Briefcase, GraduationCap } from "lucide-react";
import { useProgressStore } from "@/lib/store/useProgressStore";
import { useHUDStore } from "@/lib/store/useHUDStore";
import { missions, type MissionId } from "@/lib/data/missions";
import { playHUDClick } from "@/lib/audio/audio";
import { useTranslation } from "@/lib/i18n/useTranslation";

const iconMap = {
  Rocket,
  Briefcase,
  GraduationCap,
};

function MissionButtons({
  layout,
}: {
  layout: "rail" | "dock";
}) {
  const { activeMissionId, openMissionPanel } = useHUDStore();
  const { readSubmissions } = useProgressStore();
  const { t } = useTranslation();

  const handleOpen = (id: MissionId) => {
    playHUDClick();
    openMissionPanel(id);
  };

  return (
    <>
      {missions.map((mission) => {
        const Icon = iconMap[mission.icon];
        const isActive = activeMissionId === mission.id;
        const readCount = mission.subMissions.filter((sm) =>
          readSubmissions.includes(sm.id)
        ).length;
        const label = `${mission.rank} · ${readCount}/${mission.subMissions.length}`;

        if (layout === "dock") {
          return (
            <motion.button
              key={mission.id}
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => handleOpen(mission.id)}
              aria-label={label}
              aria-pressed={isActive}
              className={`flex min-h-11 min-w-11 items-center justify-center rounded-lg border p-2.5 transition-colors ${
                isActive
                  ? "border-hud-cyan/50 bg-hud-cyan/10 text-hud-cyan shadow-[0_0_16px_oklch(0.65_0.18_255/0.12)]"
                  : "border-hud-border/60 bg-hud-bg/80 text-muted-foreground hover:border-hud-cyan/30"
              }`}
            >
              <Icon size={18} />
            </motion.button>
          );
        }

        return (
          <motion.button
            key={mission.id}
            type="button"
            whileHover={{ scale: 1.06, x: -3 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleOpen(mission.id)}
            aria-label={label}
            aria-pressed={isActive}
            className={`group relative flex min-h-11 min-w-11 items-center justify-center rounded-lg border p-3 transition-colors ${
              isActive
                ? "border-hud-cyan/50 bg-hud-cyan/10 shadow-[0_0_16px_oklch(0.65_0.18_255/0.12)]"
                : "border-hud-border/60 bg-hud-bg/60 hover:border-hud-cyan/30"
            }`}
          >
            <Icon size={18} className={isActive ? "text-hud-cyan" : "text-muted-foreground"} />
            <span className="pointer-events-none absolute right-full mr-2 whitespace-nowrap rounded border border-hud-border bg-hud-bg px-2 py-1 font-mono text-xs text-foreground opacity-0 transition-opacity group-hover:opacity-100 md:text-sm">
              {label}
            </span>
          </motion.button>
        );
      })}
      {layout === "dock" && (
        <span className="sr-only">{t.header.missions}</span>
      )}
    </>
  );
}

export default function MissionNavigator() {
  return (
    <>
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 12, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-[calc(4.25rem+env(safe-area-inset-bottom))] left-1/2 z-150 flex -translate-x-1/2 items-center gap-2 rounded-xl border border-hud-border/70 bg-hud-bg/90 p-2 shadow-[0_0_24px_oklch(0.65_0.18_255/0.1)] backdrop-blur-xl lg:hidden"
        role="navigation"
        aria-label="Missions"
      >
        <MissionButtons layout="dock" />
      </motion.div>

      <motion.div
        initial={{ x: 24, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 16, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="fixed right-3 top-1/2 z-150 hidden -translate-y-1/2 flex-col gap-2 lg:flex"
        role="navigation"
        aria-label="Missions"
      >
        <MissionButtons layout="rail" />
      </motion.div>
    </>
  );
}
