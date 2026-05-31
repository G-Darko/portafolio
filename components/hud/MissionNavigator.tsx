"use client";

import { motion } from "motion/react";
import { Eye, Rocket, Briefcase, GraduationCap } from "lucide-react";
import { useProgressStore } from "@/lib/store/useProgressStore";
import { useHUDStore } from "@/lib/store/useHUDStore";
import { missions } from "@/lib/data/missions";
import { playHUDClick } from "@/lib/audio/audio";

const iconMap: Record<string, typeof Rocket> = {
  Rocket,
  Briefcase,
  GraduationCap,
};

export default function MissionNavigator() {
  const { activeMissionId, openMission, soundEnabled } = useHUDStore();
  const { readSubmissions } = useProgressStore();

  const openMissionHandler = (id: string) => {
    if (soundEnabled) playHUDClick();
    openMission(id);
  };

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
      className="fixed right-3 top-1/2 z-[150] hidden -translate-y-1/2 flex-col gap-2 md:flex"
    >
      {missions.map((mission, i) => {
        const Icon = iconMap[mission.icon] || Eye;
        const isActive = activeMissionId === mission.id;
        const readCount = mission.subMissions.filter((sm) =>
          readSubmissions.includes(sm.id)
        ).length;

        return (
          <motion.button
            key={mission.id}
            whileHover={{ scale: 1.08, x: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openMissionHandler(mission.id)}
            className="group relative flex items-center justify-center rounded-lg p-3 transition-colors"
            style={{
              background: isActive
                ? "rgba(102,204,255,0.1)"
                : "rgba(30,30,30,0.8)",
              border: `1px solid ${isActive ? "var(--c1)" : "var(--glass-border)"}`,
            }}
          >
            <Icon
              size={20}
              style={{ color: isActive ? "var(--c1)" : "var(--accent)" }}
            />
            {/* Tooltip */}
            <span
              className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-md border px-3 py-1.5 text-xs opacity-0 transition-opacity group-hover:opacity-100"
              style={{
                background: "var(--card)",
                borderColor: "var(--glass-border)",
                color: "var(--text)",
              }}
            >
              {mission.title} [{readCount}/{mission.subMissions.length}]
            </span>
            {/* Active indicator */}
            {isActive && (
              <div
                className="absolute -right-1 top-1/2 h-6 w-[2px] -translate-y-1/2"
                style={{ background: "var(--c1)" }}
              />
            )}
          </motion.button>
        );
      })}

      {/* Access buttons */}
      {[
        { label: "GitHub", url: "https://github.com/G-Darko", icon: "GH" },
        { label: "CV", url: "/cv", icon: "CV" },
      ].map((item) => (
        <motion.a
          key={item.label}
          href={item.url}
          target={item.url.startsWith("http") ? "_blank" : undefined}
          rel="noopener noreferrer"
          whileHover={{ scale: 1.08, x: -4 }}
          whileTap={{ scale: 0.95 }}
          className="group relative flex items-center justify-center rounded-lg p-3 text-xs font-bold transition-colors"
          style={{
            background: "rgba(30,30,30,0.8)",
            border: "1px solid var(--glass-border)",
            color: "var(--accent)",
          }}
        >
          {item.icon}
          <span
            className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-md border px-3 py-1.5 text-xs opacity-0 transition-opacity group-hover:opacity-100"
            style={{
              background: "var(--card)",
              borderColor: "var(--glass-border)",
              color: "var(--text)",
            }}
          >
            {item.label}
          </span>
        </motion.a>
      ))}
    </motion.div>
  );
}
