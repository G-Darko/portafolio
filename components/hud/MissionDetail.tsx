"use client";

import { motion, AnimatePresence } from "motion/react";
import { ExternalLink, GitBranch, Eye } from "lucide-react";
import { missions } from "@/lib/data/missions";
import { useProgressStore } from "@/lib/store/useProgressStore";
import { useHUDStore } from "@/lib/store/useHUDStore";
import GlassWindow from "./GlassWindow";
import { playHUDClick } from "@/lib/audio/audio";

export function MissionDetail() {
  const { activeMissionId, closeMission, soundEnabled } = useHUDStore();
  const { readSubmissions, markRead } = useProgressStore();

  const mission = missions.find((m) => m.id === activeMissionId);
  if (!mission) return null;

  return (
    <AnimatePresence>
      {activeMissionId && (
        <div
          className="fixed inset-0 z-[155] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={closeMission}
        >
          <GlassWindow
            title={`MISION: ${mission.codename}`}
            subtitle={mission.org}
            onClose={closeMission}
          >
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="rounded px-1.5 py-0.5 text-xs font-bold"
                    style={{
                      background: "rgba(102,204,255,0.12)",
                      color: "var(--c1)",
                      border: "1px solid var(--glass-border)",
                    }}
                  >
                    RANK {mission.rank}
                  </span>
                  <span className="text-xs opacity-50" style={{ color: "var(--text)" }}>
                    {mission.subMissions.length} submisiones
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text)" }}>
                  {mission.description}
                </p>
              </div>

              <div className="space-y-3">
                {mission.subMissions.map((sm, i) => {
                  const isRead = readSubmissions.includes(sm.id);
                  return (
                    <motion.div
                      key={sm.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="group relative rounded-lg border p-4 transition-colors hover:bg-accent/5"
                      style={{ borderColor: "var(--glass-border)" }}
                    >
                      <div
                        className="absolute left-0 top-0 h-full w-[3px] rounded-l-lg transition-colors"
                        style={{
                          background: isRead
                            ? "linear-gradient(var(--lg))"
                            : "rgba(102,204,255,0.2)",
                        }}
                      />
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4
                              className="text-sm font-bold"
                              style={{ color: isRead ? "var(--c1)" : "var(--text)" }}
                            >
                              {sm.title}
                            </h4>
                            {isRead && (
                              <Eye size={14} style={{ color: "var(--c1)" }} />
                            )}
                          </div>
                          <p className="mt-1 text-xs opacity-70" style={{ color: "var(--text)" }}>
                            {sm.tagline}
                          </p>
                          <p
                            className="mt-2 text-xs leading-relaxed"
                            style={{ color: "var(--text)" }}
                            onClick={() => {
                              if (!isRead) {
                                if (soundEnabled) playHUDClick();
                                markRead(sm.id);
                              }
                            }}
                          >
                            {sm.description}
                          </p>

                          <div className="mt-2 flex flex-wrap gap-1">
                            {sm.techStack.map((t) => (
                              <span
                                key={t}
                                className="rounded px-1.5 py-0.5 text-[10px] tracking-wider"
                                style={{
                                  background: "rgba(102,204,255,0.06)",
                                  color: "var(--accent)",
                                  border: "1px solid var(--glass-border)",
                                }}
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex gap-2">
                        {sm.liveUrl && (
                          <a
                            href={sm.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 rounded px-2 py-1 text-[10px] transition-colors hover:bg-accent/10"
                            style={{ color: "var(--c1)", border: "1px solid var(--glass-border)" }}
                          >
                            <ExternalLink size={10} />
                            VER EN VIVO
                          </a>
                        )}
                        {sm.repoUrl && (
                          <a
                            href={sm.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 rounded px-2 py-1 text-[10px] transition-colors hover:bg-accent/10"
                            style={{ color: "var(--accent)", border: "1px solid var(--glass-border)" }}
                          >
                            <GitBranch size={10} />
                            REPO
                          </a>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </GlassWindow>
        </div>
      )}
    </AnimatePresence>
  );
}
