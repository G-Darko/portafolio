"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "motion/react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useHUDStore } from "@/lib/store/useHUDStore";
import { useProgressStore } from "@/lib/store/useProgressStore";
import HUDHeader from "./HUDHeader";
import DesktopBackground from "./DesktopBackground";
import FloatingWindow from "./FloatingWindow";
import dynamic from "next/dynamic";

const TechSphere = dynamic(() => import("@/components/three/TechSphere"), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 items-center justify-center text-xs opacity-50" style={{ color: "var(--accent)" }}>
      Loading 3D engine...
    </div>
  ),
});

const JarvisDefense = dynamic(() => import("./JarvisDefense"), { ssr: false });
const TerminalPanel = dynamic(() => import("./TerminalPanel"), { ssr: false });
const ProfileWindow = dynamic(() => import("./ProfileWindow"), { ssr: false });
const ExperienceWindow = dynamic(() => import("./ExperienceWindow"), { ssr: false });
const ProjectsWindow = dynamic(() => import("./ProjectsWindow"), { ssr: false });
const SkillsWindow = dynamic(() => import("./SkillsWindow"), { ssr: false });
const CertificationsWindow = dynamic(() => import("./CertificationsWindow"), { ssr: false });
const ContactWindow = dynamic(() => import("./ContactWindow"), { ssr: false });

type WindowId =
  | "profile"
  | "experience"
  | "projects"
  | "skills"
  | "certifications"
  | "terminal"
  | "minigame"
  | "contact";

interface OpenWindow {
  id: WindowId;
  zIndex: number;
}

const WINDOW_CONFIG: Record<
  WindowId,
  { title: string; subtitle: string; x: number; y: number; w: number; h?: number }
> = {
  profile: { title: "PROFILE", subtitle: "Identity Module", x: 20, y: 60, w: 340, h: 420 },
  experience: { title: "EXPERIENCE", subtitle: "Career Timeline", x: 400, y: 60, w: 360, h: 320 },
  projects: { title: "PROJECTS", subtitle: "Mission Archives", x: 20, y: 320, w: 400, h: 400 },
  skills: { title: "TECH SPHERE", subtitle: "Stack Visualization", x: 450, y: 300, w: 380, h: 380 },
  certifications: { title: "CREDENTIALS", subtitle: "Certifications", x: 20, y: 520, w: 340, h: 280 },
  terminal: { title: "TERMINAL", subtitle: "Command Interface", x: 380, y: 500, w: 380, h: 300 },
  minigame: { title: "JARVIS DEFENSE", subtitle: "Security Protocol", x: 780, y: 60, w: 400, h: 420 },
  contact: { title: "CONTACT", subtitle: "Communication", x: 780, y: 400, w: 340, h: 320 },
};

export default function HUDShell() {
  const { t } = useTranslation();
  const { totalPercent } = useProgressStore();
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([
    { id: "profile", zIndex: 10 },
    { id: "experience", zIndex: 9 },
    { id: "projects", zIndex: 8 },
    { id: "skills", zIndex: 7 },
  ]);
  const [topZ, setTopZ] = useState(20);

  const openWindow = useCallback((id: WindowId) => {
    setOpenWindows((prev) => {
      if (prev.some((w) => w.id === id)) return prev;
      return [...prev, { id, zIndex: topZ + 1 }];
    });
    setTopZ((z) => z + 1);
  }, [topZ]);

  const closeWindow = useCallback((id: WindowId) => {
    setOpenWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const focusWindow = useCallback(
    (id: WindowId) => {
      setOpenWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, zIndex: topZ + 1 } : w))
      );
      setTopZ((z) => z + 1);
    },
    [topZ]
  );

  const renderWindowContent = (id: WindowId) => {
    switch (id) {
      case "profile":
        return <ProfileWindow />;
      case "experience":
        return <ExperienceWindow />;
      case "projects":
        return <ProjectsWindow />;
      case "skills":
        return <SkillsWindow />;
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

  return (
    <div className="relative h-screen w-screen overflow-hidden text-[var(--text)]">
      <DesktopBackground />

      <HUDHeader
        onOpenWindow={openWindow}
        totalPercent={totalPercent}
      />

      {/* Desktop area with floating windows */}
      <div className="absolute inset-0 pt-12">
        <AnimatePresence>
          {openWindows.map(({ id, zIndex }) => {
            const cfg = WINDOW_CONFIG[id];
            return (
              <FloatingWindow
                key={id}
                id={id}
                title={cfg.title}
                subtitle={cfg.subtitle}
                defaultX={cfg.x}
                defaultY={cfg.y}
                defaultWidth={cfg.w}
                defaultHeight={cfg.h}
                zIndex={zIndex}
                onClose={() => closeWindow(id)}
                onFocus={() => focusWindow(id)}
              >
                {renderWindowContent(id)}
              </FloatingWindow>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
