"use client";

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useProgressStore } from "@/lib/store/useProgressStore";
import { useHUDStore, type PanelId } from "@/lib/store/useHUDStore";
import { getMissionById, getSubMission } from "@/lib/data/missions";
import { aggregateMissionTechIds, techStackToIds } from "@/lib/data/techMap";
import HUDHeader from "./HUDHeader";
import DesktopBackground from "./DesktopBackground";
import HologramPanel from "./HologramPanel";
import WelcomeHologram from "./WelcomeHologram";
import MissionNavigator from "./MissionNavigator";
import TechIconsSprite from "@/components/TechIconsSprite";
import type { TechSphereHandle } from "@/components/three/TechSphere";
import dynamic from "next/dynamic";

const TechSphere = dynamic(() => import("@/components/three/TechSphere"), { ssr: false });

const CoreDefense = dynamic(() => import("./CoreDefense"), { ssr: false });
const TerminalPanel = dynamic(() => import("./TerminalPanel"), { ssr: false });
const ProfileWindow = dynamic(() => import("./ProfileWindow"), { ssr: false });
const MissionsWindow = dynamic(() => import("./MissionsWindow"), { ssr: false });
const SkillsWindow = dynamic(() => import("./SkillsWindow"), { ssr: false });
const CertificationsWindow = dynamic(() => import("./CertificationsWindow"), { ssr: false });
const ContactWindow = dynamic(() => import("./ContactWindow"), { ssr: false });

export default function HUDShell() {
  const { t } = useTranslation();
  const { totalPercent } = useProgressStore();
  const { activePanel, activeMissionId, activeSubMissionId, togglePanel, closePanel } =
    useHUDStore();
  const isIdle = activePanel === null;
  const [orbExpanded, setOrbExpanded] = useState(false);
  const [orbDragging, setOrbDragging] = useState(false);
  const [hoveredSkillId, setHoveredSkillId] = useState<string | null>(null);
  const techSphereRef = useRef<TechSphereHandle | null>(null);
  const dragListenersRef = useRef<{ move: (e: PointerEvent) => void; up: (e: PointerEvent) => void } | null>(
    null
  );
  const containerHoverRef = useRef(false);
  const techHoverRef = useRef(false);
  const dragHoverRef = useRef(false);
  const collapseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applyOrbExpanded = useCallback(() => {
    setOrbExpanded(containerHoverRef.current || techHoverRef.current || dragHoverRef.current);
  }, []);

  const clearCollapseTimer = useCallback(() => {
    if (collapseTimerRef.current !== null) {
      clearTimeout(collapseTimerRef.current);
      collapseTimerRef.current = null;
    }
  }, []);

  const scheduleCollapseCheck = useCallback(() => {
    clearCollapseTimer();
    collapseTimerRef.current = setTimeout(applyOrbExpanded, 32);
  }, [applyOrbExpanded, clearCollapseTimer]);

  const handleOrbPointerEnter = useCallback(() => {
    clearCollapseTimer();
    containerHoverRef.current = true;
    applyOrbExpanded();
  }, [applyOrbExpanded, clearCollapseTimer]);

  const handleOrbPointerLeave = useCallback(() => {
    containerHoverRef.current = false;
    scheduleCollapseCheck();
  }, [scheduleCollapseCheck]);

  const handleTechHoverActive = useCallback(
    (active: boolean) => {
      clearCollapseTimer();
      techHoverRef.current = active;
      if (active) {
        applyOrbExpanded();
      } else {
        scheduleCollapseCheck();
      }
    },
    [applyOrbExpanded, clearCollapseTimer, scheduleCollapseCheck]
  );

  const handleOrbDragActive = useCallback(
    (active: boolean) => {
      clearCollapseTimer();
      dragHoverRef.current = active;
      setOrbDragging(active);
      if (active) {
        applyOrbExpanded();
      } else {
        scheduleCollapseCheck();
      }
    },
    [applyOrbExpanded, clearCollapseTimer, scheduleCollapseCheck]
  );

  const stopOrbDrag = useCallback(() => {
    if (dragListenersRef.current) {
      window.removeEventListener("pointermove", dragListenersRef.current.move);
      window.removeEventListener("pointerup", dragListenersRef.current.up);
      window.removeEventListener("pointercancel", dragListenersRef.current.up);
      dragListenersRef.current = null;
    }
    handleOrbDragActive(false);
  }, [handleOrbDragActive]);

  const handleOrbDragStart = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0 || dragListenersRef.current) return;

      e.preventDefault();
      handleOrbDragActive(true);

      let lastX = e.clientX;
      let lastY = e.clientY;

      const onMove = (ev: PointerEvent) => {
        const dx = ev.clientX - lastX;
        const dy = ev.clientY - lastY;
        if (dx !== 0 || dy !== 0) {
          techSphereRef.current?.rotateBy(dx, dy);
        }
        lastX = ev.clientX;
        lastY = ev.clientY;
      };

      const onUp = () => {
        stopOrbDrag();
      };

      dragListenersRef.current = { move: onMove, up: onUp };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
    },
    [handleOrbDragActive, stopOrbDrag]
  );

  const handleRotateReady = useCallback((api: TechSphereHandle) => {
    techSphereRef.current = api;
  }, []);

  useEffect(() => () => stopOrbDrag(), [stopOrbDrag]);

  useEffect(() => () => clearCollapseTimer(), [clearCollapseTimer]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (activePanel !== "skills") setHoveredSkillId(null);
  }, [activePanel]);

  const highlightTechIds = useMemo(() => {
    if (activePanel !== "missions") return [];
    if (activeSubMissionId && activeMissionId) {
      const sm = getSubMission(activeMissionId, activeSubMissionId);
      return sm ? techStackToIds(sm.techStack) : [];
    }
    if (activeMissionId) {
      const mission = getMissionById(activeMissionId);
      return mission ? aggregateMissionTechIds(mission.subMissions) : [];
    }
    return [];
  }, [activePanel, activeMissionId, activeSubMissionId]);

  const orbMode = isIdle && highlightTechIds.length === 0 ? "idle" : "active";

  const renderContent = (id: PanelId) => {
    switch (id) {
      case "profile":
        return <ProfileWindow />;
      case "missions":
        return <MissionsWindow />;
      case "skills":
        return <SkillsWindow onHoverSkill={setHoveredSkillId} />;
      case "certifications":
        return <CertificationsWindow />;
      case "terminal":
        return <TerminalPanel />;
      case "minigame":
        return <CoreDefense />;
      case "contact":
        return <ContactWindow />;
      default:
        return null;
    }
  };

  const panelMeta = useMemo(
    () =>
      ({
        profile: { title: t.header.profile, subtitle: "Identity" },
        missions: { title: t.header.missions, subtitle: "Operations" },
        skills: { title: t.header.skills, subtitle: "Stack" },
        certifications: { title: t.header.certifications, subtitle: "Certs" },
        terminal: { title: t.header.terminal, subtitle: "shell" },
        minigame: { title: t.header.minigame, subtitle: "Security" },
        contact: { title: t.header.contact, subtitle: "Gael Uribe" },
      }) as Record<PanelId, { title: string; subtitle: string }>,
    [t]
  );

  return (
    <div className="hud-shell fixed inset-0 overflow-hidden bg-background text-foreground">
      <TechIconsSprite />
      <DesktopBackground />
      <HUDHeader
        activePanel={activePanel}
        onTogglePanel={togglePanel}
        totalPercent={totalPercent}
      />

      {activePanel === "missions" && <MissionNavigator />}

      <div
        className={`absolute inset-0 px-3 pt-14 pb-4 md:px-6 lg:pt-12 ${
          activePanel ? "overflow-x-hidden overflow-y-auto" : "overflow-y-auto lg:overflow-hidden"
        }`}
      >
        <div
          className={`mx-auto flex min-h-full w-full max-w-[1380px] ${
            activePanel
              ? "flex-col items-center gap-5 py-2 lg:grid lg:grid-cols-[minmax(12rem,16rem)_minmax(0,1fr)] lg:items-center lg:gap-8 lg:py-4 xl:gap-12"
              : "flex-col items-center justify-center gap-4 lg:flex-row lg:justify-center lg:gap-10"
          }`}
        >
        <AnimatePresence mode="popLayout">
          {isIdle && (
            <div key="welcome" className="order-2 w-full lg:order-1 lg:w-auto lg:max-w-lg lg:flex-1">
              <WelcomeHologram />
            </div>
          )}
        </AnimatePresence>

        <motion.div
          layout={!activePanel}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={`relative z-50 flex shrink-0 flex-col items-center overflow-visible ${
            activePanel
              ? "order-1 w-full lg:order-0 lg:w-auto lg:justify-self-center"
              : isIdle
                ? "order-1 lg:order-2"
                : "order-1"
          }`}
        >
          <span className="mb-1.5 text-xs font-bold tracking-[0.2em] text-hud-cyan/70 uppercase md:text-sm">
            Stack Orb
          </span>
          <motion.div
            onPointerEnter={handleOrbPointerEnter}
            onPointerLeave={handleOrbPointerLeave}
            onPointerDown={handleOrbDragStart}
            animate={{ scale: orbExpanded ? 1.09 : 1 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className={`select-none rounded-full border bg-hud-bg/20 backdrop-blur-md will-change-transform touch-none ${
              orbDragging ? "cursor-grabbing" : "cursor-grab"
            } ${orbExpanded ? "overflow-visible" : "overflow-hidden"} h-[clamp(10rem,50vw,22rem)] w-[clamp(10rem,50vw,22rem)] ${
              activePanel ? "lg:h-[clamp(9.5rem,16vw,15rem)] lg:w-[clamp(9.5rem,16vw,15rem)]" : ""
            }`}
            style={{
              borderColor: orbExpanded
                ? "oklch(0.65 0.18 255 / 0.45)"
                : "oklch(0.65 0.18 255 / 0.2)",
              boxShadow:
                highlightTechIds.length > 0
                  ? "0 0 70px oklch(0.65 0.18 255 / 0.18), inset 0 0 40px oklch(0.65 0.18 255 / 0.08)"
                  : orbExpanded
                    ? "0 0 80px oklch(0.65 0.18 255 / 0.22), inset 0 0 50px oklch(0.65 0.18 255 / 0.08)"
                    : isIdle
                      ? "0 0 60px oklch(0.65 0.18 255 / 0.12), inset 0 0 40px oklch(0.65 0.18 255 / 0.05)"
                      : "0 0 40px oklch(0.65 0.18 255 / 0.08), inset 0 0 30px oklch(0.65 0.18 255 / 0.03)",
              transition: "box-shadow 0.22s ease, border-color 0.22s ease",
            }}
          >
            <TechSphere
              mode={orbMode}
              highlightIds={highlightTechIds}
              dimAll={activePanel === "skills"}
              externalFocusId={activePanel === "skills" ? hoveredSkillId : null}
              expanded={orbExpanded}
              isDragging={orbDragging}
              onTechHoverActive={handleTechHoverActive}
              onOrbPointerDown={handleOrbDragStart}
              onRotateReady={handleRotateReady}
            />
          </motion.div>
        </motion.div>

        <AnimatePresence mode="wait">
          {activePanel && (
            <HologramPanel
              key={activePanel}
              title={panelMeta[activePanel].title}
              subtitle={panelMeta[activePanel].subtitle}
              onClose={closePanel}
              className={
                activePanel === "terminal"
                  ? "order-3 h-[min(28rem,calc(100vh-18rem))] min-h-0 w-full max-w-2xl flex-none lg:order-0 lg:h-[min(36rem,calc(100vh-5rem))] lg:justify-self-center"
                  : "order-3 max-h-[calc(100vh-18rem)] w-full min-w-0 max-w-2xl flex-none lg:order-0 lg:max-h-[calc(100vh-5rem)] lg:min-h-[420px] lg:justify-self-center"
              }
              contentClassName={
                activePanel === "terminal"
                  ? "flex min-h-0 flex-col overflow-hidden p-3 md:p-4"
                  : undefined
              }
            >
              {renderContent(activePanel)}
            </HologramPanel>
          )}
        </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
