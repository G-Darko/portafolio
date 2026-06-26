"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useProgressStore } from "@/lib/store/useProgressStore";
import { useHUDStore, type PanelId } from "@/lib/store/useHUDStore";
import HUDHeader from "./HUDHeader";
import DesktopBackground from "./DesktopBackground";
import HologramPanel from "./HologramPanel";
import WelcomeHologram from "./WelcomeHologram";
import TechIconsSprite from "@/components/TechIconsSprite";
import dynamic from "next/dynamic";

const TechSphere = dynamic(() => import("@/components/three/TechSphere"), { ssr: false });

const JarvisDefense = dynamic(() => import("./JarvisDefense"), { ssr: false });
const TerminalPanel = dynamic(() => import("./TerminalPanel"), { ssr: false });
const ProfileWindow = dynamic(() => import("./ProfileWindow"), { ssr: false });
const ExperienceWindow = dynamic(() => import("./ExperienceWindow"), { ssr: false });
const ProjectsWindow = dynamic(() => import("./ProjectsWindow"), { ssr: false });
const CertificationsWindow = dynamic(() => import("./CertificationsWindow"), { ssr: false });
const ContactWindow = dynamic(() => import("./ContactWindow"), { ssr: false });

export default function HUDShell() {
  const { t } = useTranslation();
  const { totalPercent } = useProgressStore();
  const { activePanel, togglePanel, closePanel } = useHUDStore();
  const isIdle = activePanel === null;

  const renderContent = (id: PanelId) => {
    switch (id) {
      case "profile":
        return <ProfileWindow />;
      case "experience":
        return <ExperienceWindow />;
      case "projects":
        return <ProjectsWindow />;
      case "certifications":
        return <CertificationsWindow />;
      case "terminal":
        return <TerminalPanel />;
      case "minigame":
        return <JarvisDefense />;
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
        experience: { title: t.header.experience, subtitle: "Career" },
        projects: { title: t.header.projects, subtitle: "Missions" },
        certifications: { title: t.header.certifications, subtitle: "Certs" },
        terminal: { title: t.header.terminal, subtitle: "CLI" },
        minigame: { title: t.header.minigame, subtitle: "Security" },
        contact: { title: t.header.contact, subtitle: "Comm" },
      }) as Record<PanelId, { title: string; subtitle: string }>,
    [t]
  );

  return (
    <div className="fixed inset-0 overflow-hidden bg-background text-foreground">
      <TechIconsSprite />
      <DesktopBackground />
      <HUDHeader
        activePanel={activePanel}
        onTogglePanel={togglePanel}
        totalPercent={totalPercent}
      />

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
          <span className="mb-1.5 text-[9px] font-bold tracking-[0.2em] text-hud-cyan/70 uppercase">
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
              boxShadow: isIdle
                ? "0 0 60px oklch(0.65 0.18 255 / 0.12), inset 0 0 40px oklch(0.65 0.18 255 / 0.05)"
                : "0 0 40px oklch(0.65 0.18 255 / 0.08), inset 0 0 30px oklch(0.65 0.18 255 / 0.03)",
            }}
          >
            <TechSphere mode={isIdle ? "idle" : "active"} />
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
