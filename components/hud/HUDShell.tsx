"use client";

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslation } from "@/lib/i18n/useTranslation";
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
import { useHudRouting } from "./useHudRouting";

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
  const { activePanel, activeMissionId, activeSubMissionId } = useHUDStore();
  const { togglePanelNav, goHome } = useHudRouting();
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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activePanel) {
        goHome();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activePanel, goHome]);

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
        onTogglePanel={togglePanelNav}
        onGoHome={goHome}
      />

      <AnimatePresence>
        {activePanel === "missions" && (
          <motion.div
            key="mission-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <MissionNavigator />
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`absolute inset-0 px-3 pt-14 pb-4 md:px-6 lg:pt-14 ${
          activePanel === "missions"
            ? "overflow-x-hidden overflow-y-auto pb-36 md:pb-24 lg:pb-4"
            : activePanel
              ? "overflow-x-hidden overflow-y-auto pb-24 md:pb-4"
              : "overflow-y-auto pb-24 md:pb-4 lg:overflow-hidden lg:pb-4"
        }`}
        style={{
          paddingLeft: "max(0.75rem, env(safe-area-inset-left))",
          paddingRight: "max(0.75rem, env(safe-area-inset-right))",
        }}
      >
        <div
          className={`mx-auto flex min-h-full w-full max-w-6xl py-2 lg:items-center lg:py-4 ${
            isIdle
              ? "flex-col items-center justify-center gap-8 lg:flex-row lg:justify-between lg:gap-16"
              : "flex-col items-stretch gap-4 lg:flex-row lg:gap-10"
          }`}
        >
          <div
            className={`relative z-40 order-2 flex shrink-0 flex-col items-center overflow-visible lg:order-1 ${
              isIdle ? "hidden opacity-90 md:flex" : "hidden sm:flex"
            }`}
          >
            <span className="mb-1 font-mono text-xs tracking-[0.2em] text-muted-foreground/70 uppercase">
              {t.header.sphere}
            </span>
            <motion.div
              onPointerEnter={handleOrbPointerEnter}
              onPointerLeave={handleOrbPointerLeave}
              onPointerDown={handleOrbDragStart}
              animate={{ scale: orbExpanded ? 1.06 : 1 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className={`select-none rounded-full border bg-hud-bg/20 backdrop-blur-md will-change-transform touch-none ${
                orbDragging ? "cursor-grabbing" : "cursor-grab"
              } ${orbExpanded ? "overflow-visible" : "overflow-hidden"} ${
                isIdle
                  ? "h-[clamp(7rem,26vw,12rem)] w-[clamp(7rem,26vw,12rem)]"
                  : "h-[clamp(8.5rem,14vw,12.5rem)] w-[clamp(8.5rem,14vw,12.5rem)]"
              }`}
              style={{
                borderColor: orbExpanded
                  ? "oklch(0.65 0.18 255 / 0.45)"
                  : "oklch(0.65 0.18 255 / 0.18)",
                boxShadow:
                  highlightTechIds.length > 0
                    ? "0 0 70px oklch(0.65 0.18 255 / 0.18), inset 0 0 40px oklch(0.65 0.18 255 / 0.08)"
                    : orbExpanded
                      ? "0 0 80px oklch(0.65 0.18 255 / 0.22), inset 0 0 50px oklch(0.65 0.18 255 / 0.08)"
                      : isIdle
                        ? "0 0 36px oklch(0.65 0.18 255 / 0.08), inset 0 0 24px oklch(0.65 0.18 255 / 0.04)"
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
          </div>

          {/*
            Content column is always flex-1 full width. Welcome self-limits;
            panels never inherit the orb’s narrow column (that caused the width flash).
          */}
          <div
            className={`order-1 min-w-0 lg:order-2 ${
              isIdle ? "w-full max-w-xl lg:flex-1" : "w-full flex-1"
            }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isIdle ? (
                <WelcomeHologram key="welcome" />
              ) : activePanel ? (
                <HologramPanel
                  key={activePanel}
                  title={panelMeta[activePanel].title}
                  subtitle={panelMeta[activePanel].subtitle}
                  onClose={goHome}
                  className={
                    activePanel === "terminal"
                      ? "h-[min(32rem,calc(100vh-8rem))] min-h-0 w-full max-w-none lg:h-[min(36rem,calc(100vh-6rem))]"
                      : "max-h-[calc(100vh-7rem)] w-full min-w-0 max-w-none lg:max-h-[calc(100vh-6rem)] lg:min-h-112"
                  }
                  contentClassName={
                    activePanel === "terminal"
                      ? "flex min-h-0 flex-col overflow-hidden p-3 md:p-4"
                      : undefined
                  }
                >
                  {renderContent(activePanel)}
                </HologramPanel>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
