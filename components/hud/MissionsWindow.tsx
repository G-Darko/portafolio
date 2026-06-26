"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ExternalLink, GitBranch, CheckCircle2 } from "lucide-react";
import { missions, type Mission, type MissionId, type SubMission } from "@/lib/data/missions";
import { useLocaleStore } from "@/lib/store/useLocaleStore";
import { useHUDStore } from "@/lib/store/useHUDStore";
import { useProgressStore } from "@/lib/store/useProgressStore";
import { getMissionCopy, getSubMissionCopy, getMissionsUI } from "@/lib/i18n/missionContent";
import { playHUDClick } from "@/lib/audio/audio";
import MissionMediaViewer from "@/components/missions/MissionMediaViewer";

type View = "map" | "brief" | "detail";

function MockupPlaceholder({ title, tags, label }: { title: string; tags: string[]; label: string }) {
  return (
    <div className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded border border-dashed border-hud-border bg-hud-cyan/5">
      <div className="text-sm font-mono font-bold tracking-widest text-hud-cyan md:text-base">{title}</div>
      <div className="flex flex-wrap justify-center gap-1">
        {tags.map((tag) => (
          <span key={tag} className="rounded border border-hud-border px-1 py-0 text-sm text-muted-foreground">
            {tag}
          </span>
        ))}
      </div>
      <span className="text-sm text-muted-foreground opacity-40">[{label}]</span>
    </div>
  );
}

export default function MissionsWindow() {
  const locale = useLocaleStore((s) => s.locale);
  const ui = getMissionsUI(locale);
  const { activeMissionId, activeSubMissionId, selectMission, selectSubMission, soundEnabled } =
    useHUDStore();
  const { readSubmissions, markRead, completedMissions, completeMission } = useProgressStore();

  const [view, setView] = useState<View>("map");
  const [toast, setToast] = useState<string | null>(null);

  const mission = useMemo(
    () => missions.find((m) => m.id === activeMissionId) ?? null,
    [activeMissionId]
  );

  const subMission = useMemo(() => {
    if (!mission || !activeSubMissionId) return null;
    return mission.subMissions.find((s) => s.id === activeSubMissionId) ?? null;
  }, [mission, activeSubMissionId]);

  useEffect(() => {
    if (activeMissionId && !activeSubMissionId) {
      setView("brief");
    } else if (activeMissionId && activeSubMissionId) {
      setView("detail");
    } else if (!activeMissionId) {
      setView("map");
    }
  }, [activeMissionId, activeSubMissionId]);

  const openMission = (id: MissionId) => {
    if (soundEnabled) playHUDClick();
    selectMission(id);
    selectSubMission(null);
    setView("brief");
  };

  const openSubMission = (sm: SubMission) => {
    if (soundEnabled) playHUDClick();
    selectSubMission(sm.id);
    setView("detail");
  };

  const backToBrief = () => {
    if (soundEnabled) playHUDClick();
    selectSubMission(null);
    setView("brief");
  };

  const backToMap = () => {
    if (soundEnabled) playHUDClick();
    selectMission(null);
    selectSubMission(null);
    setView("map");
  };

  const handleCompleteBrief = (sm: SubMission, missionId: MissionId) => {
    if (soundEnabled) playHUDClick();
    markRead(sm.id);
    const m = missions.find((x) => x.id === missionId)!;
    const allRead = m.subMissions.every((s) =>
      readSubmissions.includes(s.id) || s.id === sm.id
    );
    if (allRead && !completedMissions.includes(missionId)) {
      completeMission(missionId);
      setToast(ui.operationComplete);
      setTimeout(() => setToast(null), 2500);
    }
  };

  const missionProgress = (m: Mission) => {
    const read = m.subMissions.filter((s) => readSubmissions.includes(s.id)).length;
    return { read, total: m.subMissions.length, pct: Math.round((read / m.subMissions.length) * 100) };
  };

  return (
    <div className="relative min-h-[320px] space-y-3">
      <AnimatePresence mode="wait">
        {view === "map" && (
          <motion.div
            key="map"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-3"
          >
            <p className="font-mono text-sm tracking-widest text-muted-foreground uppercase">
              {ui.mapTitle}
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {missions.map((m, i) => {
                const copy = getMissionCopy(locale, m);
                const prog = missionProgress(m);
                const done = completedMissions.includes(m.id);
                return (
                  <motion.button
                    key={m.id}
                    type="button"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => openMission(m.id)}
                    className="group relative overflow-hidden rounded-lg border border-hud-border/80 bg-hud-bg/40 p-4 text-left transition-colors hover:border-hud-cyan/40 hover:bg-hud-cyan/5"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="rounded border border-hud-cyan/30 bg-hud-cyan/10 px-1.5 py-0.5 font-mono text-sm font-bold text-hud-cyan">
                        {ui.rank} {m.rank}
                      </span>
                      {done && <CheckCircle2 size={14} className="text-hud-green" />}
                    </div>
                    <h3 className="text-base font-bold text-hud-cyan">{copy.codename}</h3>
                    <p className="mt-1 text-sm font-medium text-foreground">{copy.title}</p>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {copy.description}
                    </p>
                    <div className="mt-3">
                      <div className="mb-1 flex justify-between font-mono text-sm text-muted-foreground">
                        <span>{ui.progress}</span>
                        <span>
                          {prog.read}/{prog.total}
                        </span>
                      </div>
                      <div className="h-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-linear-to-r from-hud-cyan to-hud-blue transition-all"
                          style={{ width: `${prog.pct}%` }}
                        />
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
            <p className="text-center font-mono text-sm text-muted-foreground">{ui.selectMission}</p>
          </motion.div>
        )}

        {view === "brief" && mission && (
          <motion.div
            key="brief"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="space-y-4"
          >
            <button
              type="button"
              onClick={backToMap}
              className="inline-flex items-center gap-1 font-mono text-sm text-hud-cyan hover:underline"
            >
              <ArrowLeft size={12} />
              {ui.backToMap}
            </button>

            {(() => {
              const copy = getMissionCopy(locale, mission);
              const prog = missionProgress(mission);
              return (
                <>
                  <div className="rounded-lg border border-hud-border/60 bg-hud-bg/30 p-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-bold text-hud-cyan">{copy.codename}</span>
                      <span className="rounded border border-hud-cyan/30 px-1.5 py-0.5 font-mono text-sm text-hud-cyan">
                        {ui.rank} {mission.rank}
                      </span>
                    </div>
                    <h3 className="mt-1 text-sm font-bold">{copy.title}</h3>
                    <p className="font-mono text-sm text-muted-foreground">{copy.org}</p>
                    {copy.role && (
                      <p className="mt-1 font-mono text-sm text-hud-cyan">{copy.role}</p>
                    )}
                    {mission.period && (
                      <p className="mt-1 font-mono text-sm text-muted-foreground">
                        {mission.period.start} — {mission.period.end}
                      </p>
                    )}
                    <p className="mt-2 text-sm leading-relaxed text-foreground">{copy.description}</p>
                    <div className="mt-3 h-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-hud-cyan to-hud-blue"
                        style={{ width: `${prog.pct}%` }}
                      />
                    </div>
                  </div>

                  <p className="font-mono text-sm tracking-widest text-muted-foreground uppercase">
                    {ui.objectives}
                  </p>
                  <div className="space-y-2">
                    {mission.subMissions.map((sm, i) => {
                      const smCopy = getSubMissionCopy(locale, sm);
                      const isRead = readSubmissions.includes(sm.id);
                      return (
                        <motion.button
                          key={sm.id}
                          type="button"
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.05 }}
                          onClick={() => openSubMission(sm)}
                          className="group w-full rounded-lg border border-hud-border p-3 text-left transition-colors hover:border-hud-cyan/40 hover:bg-hud-cyan/5"
                        >
                          <div className="flex items-start gap-2">
                            <div
                              className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                                isRead ? "bg-hud-green shadow-[0_0_6px_var(--hud-green)]" : "bg-hud-cyan/50"
                              }`}
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="text-sm font-bold text-hud-cyan md:text-base">{smCopy.title}</h4>
                                {smCopy.contextTag && (
                                  <span className="rounded border border-hud-border px-1 text-sm text-muted-foreground">
                                    {smCopy.contextTag}
                                  </span>
                                )}
                                <span className="font-mono text-sm text-muted-foreground">
                                  {isRead ? ui.completed : ui.available}
                                </span>
                              </div>
                              <p className="mt-0.5 text-sm text-muted-foreground">{smCopy.tagline}</p>
                              <div className="mt-2 flex flex-wrap gap-1">
                                {sm.techStack.map((tag) => (
                                  <span
                                    key={tag}
                                    className="rounded border border-hud-border px-1 py-0 text-sm text-muted-foreground"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </>
              );
            })()}
          </motion.div>
        )}

        {view === "detail" && mission && subMission && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="space-y-3"
          >
            <button
              type="button"
              onClick={backToBrief}
              className="inline-flex items-center gap-1 font-mono text-sm text-hud-cyan hover:underline"
            >
              <ArrowLeft size={12} />
              {ui.back}
            </button>

            {(() => {
              const smCopy = getSubMissionCopy(locale, subMission);
              const isRead = readSubmissions.includes(subMission.id);
              return (
                <>
                  <div>
                    <h3 className="text-sm font-bold text-hud-cyan">{smCopy.title}</h3>
                    <p className="font-mono text-sm text-muted-foreground">{smCopy.tagline}</p>
                    {smCopy.contextTag && (
                      <span className="mt-1 inline-block rounded border border-hud-border px-1.5 py-0.5 text-sm text-muted-foreground">
                        {smCopy.contextTag}
                      </span>
                    )}
                  </div>

                  {subMission.isMockup || !subMission.images?.length ? (
                    <MockupPlaceholder
                      title={smCopy.title}
                      tags={subMission.techStack}
                      label={ui.mockup}
                    />
                  ) : (
                    <MissionMediaViewer
                      images={subMission.images}
                      video={subMission.video}
                      title={smCopy.title}
                    />
                  )}

                  <p className="text-sm leading-relaxed text-foreground">{smCopy.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {subMission.repoUrl && (
                      <a
                        href={subMission.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded border border-hud-border px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-hud-cyan/10"
                      >
                        <GitBranch size={12} />
                        {ui.repo}
                      </a>
                    )}
                    {subMission.liveUrl && (
                      <a
                        href={subMission.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded border border-hud-border px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-hud-cyan/10"
                      >
                        <ExternalLink size={12} />
                        {ui.live}
                      </a>
                    )}
                  </div>

                  {!isRead && (
                    <button
                      type="button"
                      onClick={() => handleCompleteBrief(subMission, mission.id)}
                      className="w-full rounded border border-hud-cyan/40 bg-hud-cyan/10 py-2 font-mono text-sm font-bold tracking-widest text-hud-cyan transition-colors hover:bg-hud-cyan/20"
                    >
                      {ui.completeBrief}
                    </button>
                  )}
                  {isRead && (
                    <p className="flex items-center gap-1 font-mono text-sm text-hud-green">
                      <CheckCircle2 size={12} />
                      {ui.completed}
                    </p>
                  )}
                </>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed bottom-24 left-1/2 z-300 -translate-x-1/2 rounded border border-hud-green/40 bg-hud-bg/90 px-4 py-2 font-mono text-sm font-bold tracking-widest text-hud-green shadow-[0_0_20px_oklch(0.72_0.19_145/0.2)]"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
