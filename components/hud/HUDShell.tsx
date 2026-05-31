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

/* Tony Stark workshop — surround layout, all within viewport height */
const WINDOW_CONFIG: Record<
  WindowId,
  { x: number; y: number; w: number; h: number }
> = {
  profile: { x: 20, y: 60, w: 320, h: 380 },
  experience: { x: 370, y: 60, w: 360, h: 280 },
  projects: { x: 20, y: 460, w: 380, h: 300 },
  skills: { x: 750, y: 60, w: 380, h: 380 },
  certifications: { x: 750, y: 460, w: 320, h: 260 },
  terminal: { x: 370, y: 460, w: 360, h: 280 },
  minigame: { x: 1150, y: 60, w: 400, h: 400 },
  contact: { x: 1150, y: 460, w: 320, h: 300 },
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

  const getTitle = (id: WindowId) => {
    switch (id) {
      case "profile": return t.header.profile;
      case "experience": return t.header.experience;
      case "projects": return t.header.projects;
      case "skills": return t.header.skills;
      case "certifications": return t.header.certifications;
      case "terminal": return t.header.terminal;
      case "minigame": return t.header.minigame;
      case "contact": return t.header.contact;
    }
  };

  const getSubtitle = (id: WindowId) => {
    switch (id) {
      case "profile": return "Identity";
      case "experience": return "Career";
      case "projects": return "Missions";
      case "skills": return "Stack";
      case "certifications": return "Certs";
      case "terminal": return "CLI";
      case "minigame": return "Security";
      case "contact": return "Comm";
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-x-auto overflow-y-hidden bg-background text-foreground">
      <DesktopBackground />

      <HUDHeader
        onOpenWindow={openWindow}
        totalPercent={totalPercent}
      />

      {/* Wide desktop canvas for horizontal scroll */}
      <div className="relative h-full w-[1600px] pt-12">
        <AnimatePresence>
          {openWindows.map(({ id, zIndex }) => {
            const cfg = WINDOW_CONFIG[id];
            return (
              <FloatingWindow
                key={id}
                id={id}
                title={getTitle(id)}
                subtitle={getSubtitle(id)}
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
