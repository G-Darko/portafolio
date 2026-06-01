"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useProgressStore } from "@/lib/store/useProgressStore";
import HUDHeader from "./HUDHeader";
import DesktopBackground from "./DesktopBackground";
import FloatingWindow from "./FloatingWindow";
import dynamic from "next/dynamic";

const TechSphere = dynamic(() => import("@/components/three/TechSphere"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
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

const GAP = 8;
const HEADER_H = 48;
const MARGIN_X = 12;

const PREFERRED_W: Record<WindowId, number> = {
  profile: 340,
  experience: 340,
  projects: 340,
  skills: 360,
  certifications: 320,
  terminal: 340,
  minigame: 360,
  contact: 320,
};

type PWin = OpenWindow & { x: number; y: number; w: number; h: number };

const MIN_WINDOW_W = 300;

function computeLayout(windows: OpenWindow[], vw: number, vh: number): PWin[] {
  const count = windows.length;
  if (count === 0) return [];

  const availableW = vw - MARGIN_X * 2 - (count - 1) * GAP;
  const uniformW = Math.max(MIN_WINDOW_W, Math.min(340, Math.floor(availableW / count)));

  let x = MARGIN_X;
  const y = HEADER_H;
  const h = vh - HEADER_H;

  return windows.map((w, i) => {
    const pw = Math.min(uniformW, PREFERRED_W[w.id]);
    // If this window would overflow past the right edge, stack it slightly offset
    const wouldOverflow = x + pw > vw - MARGIN_X;
    const actualX = wouldOverflow ? vw - pw - MARGIN_X - (i % 3) * 24 : x;
    const actualY = wouldOverflow ? y + (i % 3) * 16 : y;
    const pos: PWin = { ...w, x: actualX, y: actualY, w: pw, h };
    x += pw + GAP;
    return pos;
  });
}

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
  const [vw, setVw] = useState(1200);
  const [vh, setVh] = useState(800);

  useEffect(() => {
    const update = () => {
      setVw(window.innerWidth);
      setVh(window.innerHeight);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const positioned = useMemo(
    () => computeLayout(openWindows, vw, vh),
    [openWindows, vw, vh]
  );

  const openWindow = useCallback(
    (id: WindowId) => {
      setOpenWindows((prev) => {
        if (prev.some((w) => w.id === id)) return prev;
        return [...prev, { id, zIndex: topZ + 1 }];
      });
      setTopZ((z) => z + 1);
    },
    [topZ]
  );

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

  const renderContent = (id: WindowId) => {
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
    <div className="fixed inset-0 overflow-hidden bg-background text-foreground">
      <DesktopBackground />
      <HUDHeader onOpenWindow={openWindow} totalPercent={totalPercent} />
      <div className="absolute inset-0 pt-12">
        <AnimatePresence>
          {positioned.map(({ id, zIndex, x, y, w, h }) => (
            <FloatingWindow
              key={id}
              id={id}
              title={getTitle(id)}
              subtitle={getSubtitle(id)}
              defaultX={x}
              defaultY={y}
              defaultWidth={w}
              defaultHeight={h}
              zIndex={zIndex}
              onClose={() => closeWindow(id)}
              onFocus={() => focusWindow(id)}
            >
              {renderContent(id)}
            </FloatingWindow>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
