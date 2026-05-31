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
    <div className="flex h-64 items-center justify-center text-xs text-muted-foreground">
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

/* Tony Stark workshop layout — distributed around a central workspace */
const WINDOW_CONFIG: Record<
  WindowId,
  { title: string; subtitle: string; x: number; y: number; w: number; h: number }
> = {
  profile: { title: "PROFILE", subtitle: "Identity", x: 30, y: 60, w: 320, h: 380 },
  experience: { title: "EXPERIENCE", subtitle: "Career", x: 420, y: 50, w: 360, h: 280 },
  projects: { title: "PROJECTS", subtitle: "Missions", x: 40, y: 460, w: 380, h: 350 },
  skills: { title: "TECH SPHERE", subtitle: "Stack", x: 850, y: 50, w: 380, h: 380 },
  certifications: { title: "CREDENTIALS", subtitle: "Certs", x: 880, y: 460, w: 320, h: 260 },
  terminal: { title: "TERMINAL", subtitle: "CLI", x: 440, y: 470, w: 360, h: 280 },
  minigame: { title: "JARVIS DEFENSE", subtitle: "Security", x: 820, y: 740, w: 400, h: 400 },
  contact: { title: "CONTACT", subtitle: "Comm", x: 60, y: 820, w: 320, h: 300 },
};

export default function HUDShell() {
  const { t } = useTranslation();
  const { totalPercent } = useProgressStore();
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([
    { id: "profile", zIndex: 10 },
    { id: "experience", zIndex: 9 },
    { id: "projects", zIndex: 8 },
    { id: "skills", zIndex: 7 },
    { id: "certifications", zIndex: 6 },
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
      case "profile": return <ProfileWindow />;
      case "experience": return <ExperienceWindow />;
      case "projects": return <ProjectsWindow />;
      case "skills": return <SkillsWindow />;
      case "certifications": return <CertificationsWindow />;
      case "terminal": return <TerminalPanel />;
      case "minigame": return <JarvisDefense />;
      case "contact": return <ContactWindow />;
      default: return null;
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background text-foreground">
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
