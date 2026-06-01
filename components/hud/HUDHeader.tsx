"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sun, Moon, Globe } from "lucide-react";
import { useThemeStore } from "@/lib/store/useThemeStore";
import { useLocaleStore } from "@/lib/store/useLocaleStore";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useProgressStore } from "@/lib/store/useProgressStore";
import { playHUDClick, playWindowOpen } from "@/lib/audio/audio";

type WindowId = "profile" | "experience" | "projects" | "skills" | "certifications" | "terminal" | "minigame" | "contact";

interface HUDHeaderProps {
  onOpenWindow: (id: WindowId) => void;
  totalPercent: number;
}

const WINDOW_BUTTONS: { id: WindowId; labelKey: string; icon: string }[] = [
  { id: "profile", labelKey: "profile", icon: "&#9673;" },
  { id: "experience", labelKey: "experience", icon: "&#9642;" },
  { id: "projects", labelKey: "projects", icon: "&#9646;" },
  { id: "skills", labelKey: "skills", icon: "&#9670;" },
  { id: "certifications", labelKey: "certifications", icon: "&#9671;" },
  { id: "terminal", labelKey: "terminal", icon: "&#9654;" },
  { id: "minigame", labelKey: "minigame", icon: "&#9889;" },
  { id: "contact", labelKey: "contact", icon: "&#64;" },
];

export default function HUDHeader({ onOpenWindow, totalPercent }: HUDHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { resolved, toggleTheme } = useThemeStore();
  const { locale, toggleLocale } = useLocaleStore();
  const { t } = useTranslation();
  const { secretsFound } = useProgressStore();

  const handleOpen = (id: WindowId) => {
    playWindowOpen();
    onOpenWindow(id);
    setMobileOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="fixed left-0 right-0 top-0 z-[200] flex items-center justify-between border-b border-border bg-background/90 px-3 py-2 backdrop-blur-lg"
      >
        <div className="flex items-center gap-2">
          <div
            data-hud-logo
            className="flex h-7 w-7 cursor-pointer select-none items-center justify-center rounded border border-hud-border bg-card font-mono text-xs font-bold text-hud-cyan"
          >
            G
          </div>
          <div className="hidden sm:block">
            <h1 className="font-mono text-xs font-bold tracking-widest text-foreground">
              {t.header.title}
            </h1>
            <p className="font-mono text-[10px] text-muted-foreground">
              {t.header.subtitle}
            </p>
          </div>

          {/* Desktop buttons */}
          <div className="ml-3 hidden items-center gap-0.5 md:flex">
            {WINDOW_BUTTONS.map(({ id, labelKey, icon }) => (
              <button
                key={id}
                onClick={() => handleOpen(id)}
                className="flex items-center gap-1 rounded px-2 py-1 text-[10px] font-mono text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                title={id}
              >
                <span dangerouslySetInnerHTML={{ __html: icon }} />
                <span className="hidden lg:inline">{t.header[labelKey as keyof typeof t.header]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Progress */}
          <div className="hidden items-center gap-2 sm:flex">
            <span className="font-mono text-[10px] text-hud-cyan">{totalPercent}%</span>
            <div className="h-1 w-16 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-hud-cyan to-hud-blue transition-all duration-700"
                style={{ width: `${totalPercent}%` }}
              />
            </div>
            <span className="font-mono text-[10px] text-muted-foreground">
              {secretsFound.length}/{t.header.secrets}
            </span>
          </div>

          {/* Theme toggle */}
          <button
            onClick={() => { playHUDClick(); toggleTheme(); }}
            className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            title={resolved === "dark" ? "Light mode" : "Dark mode"}
          >
            {resolved === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {/* Locale toggle */}
          <button
            onClick={() => { playHUDClick(); toggleLocale(); }}
            className="flex h-7 items-center justify-center rounded px-1.5 font-mono text-[10px] text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            title="Toggle language"
          >
            <Globe size={12} className="mr-1" />
            {locale.toUpperCase()}
          </button>

          {/* Mobile hamburger */}
          <button
            className="flex h-8 w-8 flex-col items-center justify-center gap-1 md:hidden"
            onClick={() => setMobileOpen((p) => !p)}
            aria-label="Menu"
          >
            <span className={`block h-0.5 w-5 bg-muted-foreground transition-transform ${mobileOpen ? "translate-y-[3px] rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-muted-foreground transition-opacity ${mobileOpen ? "opacity-0" : "opacity-100"}`} />
            <span className={`block h-0.5 w-5 bg-muted-foreground transition-transform ${mobileOpen ? "-translate-y-[3px] -rotate-45" : ""}`} />
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed left-0 right-0 top-12 z-[199] border-b border-hud-border bg-hud-bg p-4 backdrop-blur-xl md:hidden"
          >
            <div className="grid grid-cols-3 gap-2">
              {WINDOW_BUTTONS.map(({ id, labelKey, icon }) => (
                <button
                  key={id}
                  onClick={() => handleOpen(id)}
                  className="flex flex-col items-center gap-1 rounded border border-hud-border px-2 py-3 text-[10px] font-mono text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <span dangerouslySetInnerHTML={{ __html: icon }} />
                  {t.header[labelKey as keyof typeof t.header]}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
