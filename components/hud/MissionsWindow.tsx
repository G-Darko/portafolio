"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  GitBranch,
  CheckCircle2,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import {
  missions,
  type Mission,
  type MissionId,
  type SubMission,
} from "@/lib/data/missions";
import { useLocaleStore } from "@/lib/store/useLocaleStore";
import { useHUDStore } from "@/lib/store/useHUDStore";
import { useProgressStore } from "@/lib/store/useProgressStore";
import { getMissionCopy, getSubMissionCopy, getMissionsUI } from "@/lib/i18n/missionContent";
import { playHUDClick } from "@/lib/audio/audio";
import MissionMediaViewer from "@/components/missions/MissionMediaViewer";
import SheepIcon from "@/components/icons/SheepIcon";
import HudOutlineLink from "./HudOutlineLink";
import HudCyanButton from "./HudCyanButton";

const iconMap = {
  Sheep: SheepIcon,
  Briefcase,
  GraduationCap,
};

/** Triangular lattice anchors (percent of map stage). */
const NODE_POS: Record<MissionId, { x: number; y: number }> = {
  "black-sheep": { x: 28, y: 22 },
  freelance: { x: 72, y: 38 },
  academia: { x: 36, y: 72 },
};

const LATTICE_EDGES: [MissionId, MissionId][] = [
  ["black-sheep", "freelance"],
  ["freelance", "academia"],
  ["academia", "black-sheep"],
];

function SegmentCells({ total, lit, label }: { total: number; lit: number; label: string }) {
  return (
    <div
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`${label}: ${lit}/${total}`}
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`h-1.5 w-2 rounded-[1px] border transition-colors ${
            i < lit
              ? "border-hud-cyan/70 bg-hud-cyan/85 shadow-[0_0_6px_oklch(0.8_0.18_195/0.4)]"
              : "border-hud-border/55 bg-transparent opacity-45"
          }`}
        />
      ))}
    </div>
  );
}

function MissionExternalLinks({
  liveUrl,
  repoUrl,
  playStoreUrl,
  appStoreUrl,
  tenantUrl,
  liveLabel,
  repoLabel,
  playLabel,
  appLabel,
  tenantLabel,
  size = "sm",
  className,
}: {
  liveUrl?: string;
  repoUrl?: string;
  playStoreUrl?: string;
  appStoreUrl?: string;
  tenantUrl?: string;
  liveLabel: string;
  repoLabel: string;
  playLabel: string;
  appLabel: string;
  tenantLabel: string;
  size?: "sm" | "md";
  className?: string;
}) {
  if (!liveUrl && !repoUrl && !playStoreUrl && !appStoreUrl && !tenantUrl) return null;
  return (
    <div className={className ?? "flex flex-wrap gap-2"}>
      {repoUrl && (
        <HudOutlineLink href={repoUrl} external size={size}>
          <GitBranch size={12} />
          {repoLabel}
        </HudOutlineLink>
      )}
      {liveUrl && (
        <HudOutlineLink href={liveUrl} external size={size}>
          <ExternalLink size={12} />
          {liveLabel}
        </HudOutlineLink>
      )}
      {tenantUrl && (
        <HudOutlineLink href={tenantUrl} external size={size}>
          <ExternalLink size={12} />
          {tenantLabel}
        </HudOutlineLink>
      )}
      {playStoreUrl && (
        <HudOutlineLink href={playStoreUrl} external size={size}>
          <ExternalLink size={12} />
          {playLabel}
        </HudOutlineLink>
      )}
      {appStoreUrl && (
        <HudOutlineLink href={appStoreUrl} external size={size}>
          <ExternalLink size={12} />
          {appLabel}
        </HudOutlineLink>
      )}
    </div>
  );
}

function MissionBackButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-11 items-center gap-1 font-mono text-sm text-hud-cyan hover:underline"
    >
      <ArrowLeft size={12} />
      {label}
    </button>
  );
}

function MockupPlaceholder({
  title,
  tags,
  label,
  hint,
}: {
  title: string;
  tags: string[];
  label: string;
  hint: string;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-3 rounded-lg border border-dashed border-hud-border/80 bg-hud-cyan/5 px-4 py-6 text-center">
      <div className="font-mono text-sm font-bold tracking-widest text-hud-cyan md:text-base">
        {label}
      </div>
      <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">{hint}</p>
      <p className="text-sm font-medium text-foreground">{title}</p>
      <div className="flex flex-wrap justify-center gap-1">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded border border-hud-border px-1.5 py-0.5 text-sm text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function OrgNode({
  mission,
  selected,
  lit,
  total,
  progressLabel,
  onSelect,
}: {
  mission: Mission;
  selected: boolean;
  lit: number;
  total: number;
  progressLabel: string;
  onSelect: () => void;
}) {
  const locale = useLocaleStore((s) => s.locale);
  const copy = getMissionCopy(locale, mission);
  const ui = getMissionsUI(locale);
  const Icon = iconMap[mission.icon];
  const pos = NODE_POS[mission.id];

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className="group absolute z-10 flex w-[min(11.5rem,42%)] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 text-center"
      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
    >
      <span
        className={`relative flex h-14 w-14 items-center justify-center rounded-full border transition-all ${
          selected
            ? "border-hud-cyan/70 bg-hud-cyan/15 text-hud-cyan shadow-[0_0_22px_oklch(0.8_0.18_195/0.28)]"
            : "border-hud-border/80 bg-hud-bg/70 text-muted-foreground group-hover:border-hud-cyan/40 group-hover:text-hud-cyan"
        }`}
      >
        {selected && (
          <>
            <span className="pointer-events-none absolute -inset-1 rounded-full border border-hud-cyan/25" />
            <span className="pointer-events-none absolute -left-1 -top-1 h-2 w-2 border-l border-t border-hud-cyan/70" />
            <span className="pointer-events-none absolute -right-1 -top-1 h-2 w-2 border-r border-t border-hud-cyan/70" />
            <span className="pointer-events-none absolute -bottom-1 -left-1 h-2 w-2 border-b border-l border-hud-cyan/70" />
            <span className="pointer-events-none absolute -bottom-1 -right-1 h-2 w-2 border-b border-r border-hud-cyan/70" />
          </>
        )}
        <Icon size={22} />
      </span>
      <span className="font-mono text-xs font-bold tracking-wider text-hud-cyan uppercase md:text-sm">
        {copy.title}
      </span>
      <span className="line-clamp-2 px-1 text-xs leading-snug text-muted-foreground">
        {copy.description}
      </span>
      <div className="flex items-center gap-2">
        <span className="rounded border border-hud-cyan/25 bg-hud-cyan/5 px-1 font-mono text-xs text-hud-cyan">
          {ui.rank} {mission.rank}
        </span>
        <SegmentCells total={total} lit={lit} label={progressLabel} />
      </div>
    </button>
  );
}

export default function MissionsWindow() {
  const locale = useLocaleStore((s) => s.locale);
  const ui = getMissionsUI(locale);
  const { activeMissionId, activeSubMissionId, selectMission, selectSubMission } = useHUDStore();
  const { readSubmissions, markRead, completedMissions, completeMission } = useProgressStore();

  const [toast, setToast] = useState<string | null>(null);

  const mission = useMemo(
    () => missions.find((m) => m.id === activeMissionId) ?? null,
    [activeMissionId]
  );

  const subMission = useMemo(() => {
    if (!mission || !activeSubMissionId) return null;
    return mission.subMissions.find((s) => s.id === activeSubMissionId) ?? null;
  }, [mission, activeSubMissionId]);

  const view = subMission ? "detail" : "map";

  const openMission = (id: MissionId) => {
    playHUDClick();
    selectMission(id);
    selectSubMission(null);
  };

  const openSubMission = (sm: SubMission) => {
    playHUDClick();
    selectSubMission(sm.id);
  };

  const backToBrief = () => {
    playHUDClick();
    selectSubMission(null);
  };

  const backToMap = () => {
    playHUDClick();
    selectMission(null);
    selectSubMission(null);
  };

  const handleCompleteBrief = (sm: SubMission, missionId: MissionId) => {
    playHUDClick();
    markRead(sm.id);
    const m = missions.find((x) => x.id === missionId)!;
    const allRead = m.subMissions.every(
      (s) => readSubmissions.includes(s.id) || s.id === sm.id
    );
    if (allRead && !completedMissions.includes(missionId)) {
      completeMission(missionId);
      setToast(ui.operationComplete);
      setTimeout(() => setToast(null), 2500);
    }
  };

  const missionProgress = (m: Mission) => {
    const read = m.subMissions.filter((s) => readSubmissions.includes(s.id)).length;
    return { read, total: m.subMissions.length };
  };

  return (
    <div className="relative min-h-80 space-y-3">
      <AnimatePresence mode="wait">
        {view === "map" && (
          <motion.div
            key="map"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.95fr)] lg:items-stretch lg:gap-5"
          >
            {/* OPERATIONS MAP */}
            <section className="flex min-w-0 flex-col">
              <p className="mb-2 shrink-0 font-mono text-sm tracking-widest text-muted-foreground uppercase">
                {ui.mapTitle}
              </p>
              <div className="relative h-88 shrink-0 overflow-hidden rounded-lg border border-hud-border/50 bg-hud-bg/25 sm:h-96 md:h-104">
                <svg
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  {LATTICE_EDGES.map(([a, b]) => {
                    const pa = NODE_POS[a];
                    const pb = NODE_POS[b];
                    const active =
                      activeMissionId === a || activeMissionId === b;
                    return (
                      <line
                        key={`${a}-${b}`}
                        x1={pa.x}
                        y1={pa.y}
                        x2={pb.x}
                        y2={pb.y}
                        stroke={
                          active
                            ? "oklch(0.8 0.18 195 / 0.45)"
                            : "oklch(0.65 0.18 255 / 0.22)"
                        }
                        strokeWidth={active ? 0.35 : 0.22}
                      />
                    );
                  })}
                </svg>
                {missions.map((m) => {
                  const prog = missionProgress(m);
                  return (
                    <OrgNode
                      key={m.id}
                      mission={m}
                      selected={activeMissionId === m.id}
                      lit={prog.read}
                      total={prog.total}
                      progressLabel={ui.progress}
                      onSelect={() => openMission(m.id)}
                    />
                  );
                })}
                <p className="absolute bottom-3 left-1/2 z-10 w-[90%] -translate-x-1/2 text-center font-mono text-xs text-muted-foreground md:text-sm">
                  {ui.selectMission}
                </p>
              </div>
            </section>

            {/* SIDE BRIEF — same fixed stage as map; projects scroll */}
            <section className="flex min-w-0 flex-col">
              <p
                className="mb-2 hidden shrink-0 font-mono text-sm tracking-widest text-transparent uppercase lg:block"
                aria-hidden
              >
                {ui.mapTitle}
              </p>
              <AnimatePresence mode="wait">
                {mission ? (
                  <motion.div
                    key={mission.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    className="flex h-88 flex-col overflow-hidden rounded-lg border border-hud-border/60 bg-hud-bg/30 p-3 sm:h-96 md:h-104 md:p-4"
                  >
                    {(() => {
                      const copy = getMissionCopy(locale, mission);
                      const Icon = iconMap[mission.icon];
                      const prog = missionProgress(mission);
                      return (
                        <>
                          <div className="mb-3 shrink-0 border-b border-hud-border/40 pb-3">
                            <div className="flex items-start gap-3">
                              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-hud-cyan/40 bg-hud-cyan/10 text-hud-cyan">
                                <Icon size={18} />
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="font-mono text-sm font-bold tracking-wide text-hud-cyan uppercase">
                                    {copy.title}
                                  </h3>
                                  <span className="rounded border border-hud-cyan/30 px-1.5 py-0.5 font-mono text-xs text-hud-cyan">
                                    {ui.rank} {mission.rank}
                                  </span>
                                </div>
                                <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">
                                  {copy.org}
                                </p>
                                {mission.period && (
                                  <p className="font-mono text-xs text-muted-foreground">
                                    {mission.period.start} — {mission.period.end}
                                  </p>
                                )}
                                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-foreground">
                                  {copy.description}
                                </p>
                                <div className="mt-2">
                                  <SegmentCells
                                    total={prog.total}
                                    lit={prog.read}
                                    label={ui.progress}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <p className="mb-2 shrink-0 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                            {ui.objectives}
                          </p>
                          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain pr-0.5">
                            {mission.subMissions.map((sm, i) => {
                              const smCopy = getSubMissionCopy(locale, sm);
                              const isRead = readSubmissions.includes(sm.id);
                              return (
                                <motion.button
                                  key={sm.id}
                                  type="button"
                                  initial={{ opacity: 0, y: 8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: i * 0.04 }}
                                  onClick={() => openSubMission(sm)}
                                  className="group flex w-full min-h-11 items-start gap-2 rounded-lg border border-hud-border/70 bg-hud-bg/20 px-3 py-2.5 text-left transition-colors hover:border-hud-cyan/40 hover:bg-hud-cyan/5"
                                >
                                  <HudStatusDotProxy read={isRead} />
                                  <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <h4 className="text-sm font-bold text-hud-cyan">
                                        {smCopy.title}
                                      </h4>
                                      {smCopy.contextTag && (
                                        <span className="rounded border border-hud-border px-1 text-xs text-muted-foreground">
                                          {smCopy.contextTag}
                                        </span>
                                      )}
                                    </div>
                                    <p className="mt-0.5 text-xs text-muted-foreground md:text-sm">
                                      {smCopy.tagline}
                                    </p>
                                    <div className="mt-1.5 flex flex-wrap gap-1">
                                      {sm.techStack.slice(0, 4).map((tag) => (
                                        <span
                                          key={tag}
                                          className="rounded border border-hud-border/80 px-1 py-0 text-xs text-muted-foreground"
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  <ChevronRight
                                    size={14}
                                    className="mt-1 shrink-0 text-muted-foreground transition-colors group-hover:text-hud-cyan"
                                  />
                                </motion.button>
                              );
                            })}
                          </div>
                          <div className="mt-2 shrink-0 border-t border-hud-border/30 pt-2">
                            <p className="font-mono text-xs text-muted-foreground">
                              {ui.selectProject}
                            </p>
                            <button
                              type="button"
                              onClick={backToMap}
                              className="mt-1 self-start font-mono text-xs text-muted-foreground hover:text-hud-cyan"
                            >
                              {ui.backToMap}
                            </button>
                          </div>
                        </>
                      );
                    })()}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty-brief"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-88 flex-col items-center justify-center rounded-lg border border-dashed border-hud-border/50 bg-hud-bg/15 px-4 py-8 text-center sm:h-96 md:h-104"
                  >
                    <p className="font-mono text-sm tracking-widest text-muted-foreground uppercase">
                      {ui.sideBrief}
                    </p>
                    <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                      {ui.selectMission}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
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
            <MissionBackButton label={ui.backToOrg} onClick={backToBrief} />

            {(() => {
              const smCopy = getSubMissionCopy(locale, subMission);
              const isRead = readSubmissions.includes(subMission.id);
              return (
                <>
                  <div>
                    <h3 className="text-base font-bold text-hud-cyan md:text-lg">
                      {smCopy.title}
                    </h3>
                    <p className="font-mono text-sm text-muted-foreground">
                      {smCopy.tagline}
                    </p>
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
                      hint={ui.mockupHint}
                    />
                  ) : (
                    <MissionMediaViewer
                      images={subMission.images}
                      video={subMission.video}
                      title={smCopy.title}
                    />
                  )}

                  <p className="text-sm leading-relaxed text-foreground">
                    {smCopy.description}
                  </p>

                  <MissionExternalLinks
                    liveUrl={subMission.liveUrl}
                    repoUrl={subMission.repoUrl}
                    playStoreUrl={subMission.playStoreUrl}
                    appStoreUrl={subMission.appStoreUrl}
                    tenantUrl={subMission.tenantUrl}
                    liveLabel={ui.live}
                    repoLabel={ui.repo}
                    playLabel={ui.playStore}
                    appLabel={ui.appStore}
                    tenantLabel={ui.tenant}
                  />

                  {!isRead && (
                    <HudCyanButton
                      className="w-full border-hud-cyan/40 bg-hud-cyan/10 hover:bg-hud-cyan/20"
                      onClick={() => handleCompleteBrief(subMission, mission.id)}
                    >
                      {ui.completeBrief}
                    </HudCyanButton>
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

function HudStatusDotProxy({ read }: { read: boolean }) {
  return (
    <span
      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
        read
          ? "bg-hud-green shadow-[0_0_8px_oklch(0.75_0.2_145/0.5)]"
          : "bg-hud-cyan/40"
      }`}
      aria-hidden
    />
  );
}
