"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sun, Moon, Globe, Terminal, Box, Shield, User, Briefcase, FolderOpen, Award, Mail } from "lucide-react";
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

const WINDOW_BUTTONS: { id: WindowId; label: string; icon: typeof Terminal }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "skills", label: "Skills", icon: Box },
  { id: "certifications", label: "Certs", icon: Award },
  { id: "terminal", label: "Terminal", icon: Terminal },
  { id: "minigame", label: "Defense", icon: Shield },
  { id: "contact", label: "Contact", icon: Mail },
];

export default function HUDHeader({ onOpenWindow, totalPercent }: HUDHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useThemeStore();
  const { locale, toggleLocale } = useLocaleStore();
  const { t } = useTranslation();
  const { secretsFound } = useProgressStore();

  const handleOpen = useCallback(
    (id: WindowId) => {
      playWindowOpen();
      onOpenWindow(id);
      setMobileOpen(false);
    },
    [onOpenWindow]
  );

  return (
    <>
      <motion.header
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="fixed left-0 right-0 top-0 z-[200] flex items-center justify-between border-b px-3 py-2 backdrop-blur-lg"
        style={{
          borderColor: "var(--glass-border)",
          background: "rgba(8, 12, 18, 0.7)",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            data-hud-logo
            className="flex h-7 w-7 select-none items-center justify-center rounded font-mono text-xs font-bold"
            style={{
              background: "var(--card)",
              border: "1px solid var(--glass-border)",
              color: "var(--c1)",
              cursor: "pointer",
            }}
          >
            G
          </div>
          <div className="hidden sm:block">
            <h1 className="font-mono text-xs font-bold tracking-widest" style={{ color: "var(--text)" }}>
              {t.header.title}
            </h1>
            <p className="font-mono text-[10px] opacity-50" style={{ color: "var(--accent)" }}>
              {t.header.subtitle}
            </p>
          </div>

          {/* Desktop quick buttons */}
          <div className="ml-3 hidden items-center gap-0.5 md:flex">
            {WINDOW_BUTTONS.map(({ id, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handleOpen(id)}
                className="flex items-center gap-1 rounded px-2 py-1 text-[10px] font-mono transition-colors hover:bg-accent/10"
                style={{
                  color: "var(--accent)",
                }}
                title={id}
              >
                <Icon size={12} />
                <span className="hidden lg:inline">{id}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Progress */}
          <div className="hidden items-center gap-2 sm:flex">
            <span className="font-mono text-[10px]" style={{ color: "var(--c1)" }}>
              {totalPercent}%
            </span>
            <div className="h-1 w-16 overflow-hidden rounded-full" style={{ background: "var(--complement)" }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${totalPercent}%`,
                  background: "linear-gradient(90deg, var(--c1), var(--c2))",
                }}
              />
            </div>
            <span
              className="font-mono text-[10px]"
              style={{ color: secretsFound.length > 0 ? "var(--hud-green)" : "var(--accent)" }}
            >
              {secretsFound.length}/{t.header.secrets}
            </span>
          </div>

          {/* Theme toggle */}
          <button
            onClick={() => { playHUDClick(); toggleTheme(); }}
            className="flex h-7 w-7 items-center justify-center rounded transition-colors hover:bg-accent/10"
            style={{ color: "var(--accent)" }}
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {/* Locale toggle */}
          <button
            onClick={() => { playHUDClick(); toggleLocale(); }}
            className="flex h-7 items-center justify-center rounded px-1.5 font-mono text-[10px] transition-colors hover:bg-accent/10"
            style={{ color: "var(--accent)" }}
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
            <span className={`block h-0.5 w-5 transition-transform ${mobileOpen ? "translate-y-[3px] rotate-45" : ""}`} style={{ background: "var(--accent)" }} />
            <span className={`block h-0.5 w-5 transition-opacity ${mobileOpen ? "opacity-0" : "opacity-100"}`} style={{ background: "var(--accent)" }} />
            <span className={`block h-0.5 w-5 transition-transform ${mobileOpen ? "-translate-y-[3px] -rotate-45" : ""}`} style={{ background: "var(--accent)" }} />
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
            className="fixed left-0 right-0 top-12 z-[199] border-b p-4 md:hidden"
            style={{
              background: "rgba(8,12,18,0.95)",
              borderColor: "var(--glass-border)",
              backdropFilter: "blur(16px)",
            }}
          >
            <div className="grid grid-cols-3 gap-2">
              {WINDOW_BUTTONS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => handleOpen(id)}
                  className="flex flex-col items-center gap-1 rounded border px-2 py-3 text-[10px] font-mono transition-colors hover:bg-accent/10"
                  style={{
                    borderColor: "var(--glass-border)",
                    color: "var(--accent)",
                  }}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
