"use client";

import { motion } from "motion/react";
import { Rocket, Briefcase, GraduationCap } from "lucide-react";
import { useProgressStore } from "@/lib/store/useProgressStore";
import { useHUDStore } from "@/lib/store/useHUDStore";
import { missions, type MissionId } from "@/lib/data/missions";
import { playHUDClick } from "@/lib/audio/audio";

const iconMap = {
  Rocket,
  Briefcase,
  GraduationCap,
};

export default function MissionNavigator() {
  const { activeMissionId, openMissionPanel, soundEnabled } = useHUDStore();
  const { readSubmissions } = useProgressStore();

  const handleOpen = (id: MissionId) => {
    if (soundEnabled) playHUDClick();
    openMissionPanel(id);
  };

  return (
    <motion.div
      initial={{ x: 80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="fixed right-3 top-1/2 z-150 hidden -translate-y-1/2 flex-col gap-2 lg:flex"
    >
      {missions.map((mission) => {
        const Icon = iconMap[mission.icon];
        const isActive = activeMissionId === mission.id;
        const readCount = mission.subMissions.filter((sm) =>
          readSubmissions.includes(sm.id)
        ).length;

        return (
          <motion.button
            key={mission.id}
            type="button"
            whileHover={{ scale: 1.06, x: -3 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleOpen(mission.id)}
            className={`group relative flex items-center justify-center rounded-lg border p-3 transition-colors ${
              isActive
                ? "border-hud-cyan/50 bg-hud-cyan/10 shadow-[0_0_16px_oklch(0.65_0.18_255/0.12)]"
                : "border-hud-border/60 bg-hud-bg/60 hover:border-hud-cyan/30"
            }`}
          >
            <Icon size={18} className={isActive ? "text-hud-cyan" : "text-muted-foreground"} />
            <span className="pointer-events-none absolute right-full mr-2 whitespace-nowrap rounded border border-hud-border bg-hud-bg px-2 py-1 font-mono text-xs text-foreground opacity-0 transition-opacity group-hover:opacity-100 md:text-sm">
              {mission.rank} · {readCount}/{mission.subMissions.length}
            </span>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
