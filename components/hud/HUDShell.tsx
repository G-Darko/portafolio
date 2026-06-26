"use client";

import { useMemo } from "react";
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
        return <SkillsWindow />;
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
        terminal: { title: t.header.terminal, subtitle: "CLI" },
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

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 overflow-y-auto px-3 pt-14 pb-4 md:gap-6 md:px-6 lg:flex-row lg:items-center lg:justify-center lg:gap-10 lg:overflow-hidden lg:pt-12">
        <AnimatePresence mode="popLayout">
          {isIdle && (
            <div key="welcome" className="order-2 w-full lg:order-1 lg:w-auto lg:max-w-lg lg:flex-1">
              <WelcomeHologram />
            </div>
          )}
        </AnimatePresence>

        <motion.div
          layout
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={`relative z-50 flex shrink-0 flex-col items-center ${
            isIdle ? "order-1 lg:order-2" : "order-1 lg:order-0"
          }`}
        >
          <span className="mb-1.5 text-xs font-bold tracking-[0.2em] text-hud-cyan/70 uppercase md:text-sm">
            Stack Orb
          </span>
          <motion.div
            layout
            animate={{
              width: isIdle
                ? "clamp(10rem, 50vw, 22rem)"
                : "clamp(8rem, 35vw, 14rem)",
              height: isIdle
                ? "clamp(10rem, 50vw, 22rem)"
                : "clamp(8rem, 35vw, 14rem)",
            }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden rounded-full border bg-hud-bg/20 backdrop-blur-md"
            style={{
              borderColor: "oklch(0.65 0.18 255 / 0.2)",
              boxShadow:
                highlightTechIds.length > 0
                  ? "0 0 70px oklch(0.65 0.18 255 / 0.18), inset 0 0 40px oklch(0.65 0.18 255 / 0.08)"
                  : isIdle
                    ? "0 0 60px oklch(0.65 0.18 255 / 0.12), inset 0 0 40px oklch(0.65 0.18 255 / 0.05)"
                    : "0 0 40px oklch(0.65 0.18 255 / 0.08), inset 0 0 30px oklch(0.65 0.18 255 / 0.03)",
            }}
          >
            <TechSphere mode={orbMode} highlightIds={highlightTechIds} />
          </motion.div>
        </motion.div>

        <AnimatePresence mode="wait">
          {activePanel && (
            <HologramPanel
              key={activePanel}
              title={panelMeta[activePanel].title}
              subtitle={panelMeta[activePanel].subtitle}
              onClose={closePanel}
              className="order-3 max-h-[calc(100vh-18rem)] lg:max-h-[calc(100vh-5rem)] lg:flex-none"
            >
              {renderContent(activePanel)}
            </HologramPanel>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
