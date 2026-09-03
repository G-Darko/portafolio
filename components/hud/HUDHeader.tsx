"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Globe, RotateCw } from "lucide-react";
import { useThemeStore } from "@/lib/store/useThemeStore";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import ThemePalettePicker from "./ThemePalettePicker";
import { useLocaleStore } from "@/lib/store/useLocaleStore";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useHUDStore, type PanelId } from "@/lib/store/useHUDStore";
import { playHUDClick, playWindowOpen } from "@/lib/audio/audio";
import HudConfirmDialog from "./HudConfirmDialog";

interface HUDHeaderProps {
  activePanel: PanelId | null;
  onTogglePanel: (id: PanelId) => void;
  onGoHome: () => void;
}

const PRIMARY_BUTTONS: { id: PanelId; labelKey: "profile" | "missions" | "contact" }[] = [
  { id: "profile", labelKey: "profile" },
  { id: "missions", labelKey: "missions" },
  { id: "contact", labelKey: "contact" },
];

const MORE_BUTTONS: {
  id: PanelId;
  labelKey: "skills" | "certifications" | "terminal" | "minigame";
}[] = [
  { id: "skills", labelKey: "skills" },
  { id: "certifications", labelKey: "certifications" },
  { id: "terminal", labelKey: "terminal" },
  { id: "minigame", labelKey: "minigame" },
];

export default function HUDHeader({
  activePanel,
  onTogglePanel,
  onGoHome,
}: HUDHeaderProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [restartOpen, setRestartOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const mobileMoreRef = useRef<HTMLDivElement>(null);
  const { resolved, setTheme } = useThemeStore();
  const { locale, toggleLocale } = useLocaleStore();
  const { t } = useTranslation();
  const { endSession } = useHUDStore();

  const moreActive = MORE_BUTTONS.some(({ id }) => id === activePanel);

  useEffect(() => {
    if (!moreOpen && !mobileMoreOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (moreOpen && moreRef.current && !moreRef.current.contains(target)) {
        setMoreOpen(false);
      }
      if (mobileMoreOpen && mobileMoreRef.current && !mobileMoreRef.current.contains(target)) {
        setMobileMoreOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMoreOpen(false);
        setMobileMoreOpen(false);
      }
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [moreOpen, mobileMoreOpen]);

  const handleToggle = (id: PanelId) => {
    playWindowOpen();
    onTogglePanel(id);
    setMoreOpen(false);
    setMobileMoreOpen(false);
  };

  const handleLogout = () => {
    playHUDClick();
    setRestartOpen(true);
  };

  const confirmRestart = () => {
    setRestartOpen(false);
    endSession();
  };

  const navButtonClass = (isActive: boolean) =>
    `flex min-h-11 items-center gap-1.5 rounded px-2.5 py-2 text-sm font-mono transition-colors md:text-base ${
      isActive
        ? "bg-hud-cyan/15 text-hud-cyan shadow-[0_0_12px_oklch(0.65_0.18_255/0.15)]"
        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
    }`;

  const dockItemClass = (isActive: boolean) =>
    `flex min-h-12 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1.5 font-mono text-xs tracking-wide transition-colors ${
      isActive
        ? "bg-hud-cyan/15 text-hud-cyan"
        : "text-muted-foreground active:bg-accent active:text-accent-foreground"
    }`;

  return (
    <>
      <motion.header
        initial={false}
        className="fixed left-0 right-0 top-0 z-200 flex items-center justify-between border-b border-border bg-background/90 px-3 py-2 backdrop-blur-lg"
        style={{ paddingTop: "max(0.5rem, env(safe-area-inset-top))" }}
      >
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            data-hud-logo
            onClick={() => {
              playHUDClick();
              onGoHome();
            }}
            className="flex h-10 w-10 shrink-0 select-none items-center justify-center rounded border border-hud-border bg-card font-mono text-sm font-bold text-hud-cyan transition-colors hover:bg-hud-cyan/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hud-cyan"
            aria-label={t.header.title}
            title={t.header.title}
          >
            G
          </button>
          <button
            type="button"
            onClick={() => {
              playHUDClick();
              onGoHome();
            }}
            className="min-w-0 rounded px-1 py-1 text-left transition-colors hover:bg-accent/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hud-cyan"
            aria-label={t.header.title}
          >
            <h1 className="truncate font-mono text-sm font-bold tracking-widest text-foreground md:text-base">
              {t.header.title}
            </h1>
          </button>

          <nav className="ml-2 hidden items-center gap-0.5 md:flex" aria-label="Primary">
            {PRIMARY_BUTTONS.map(({ id, labelKey }) => {
              const isActive = activePanel === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleToggle(id)}
                  className={navButtonClass(isActive)}
                  aria-current={isActive ? "page" : undefined}
                >
                  {t.header[labelKey]}
                </button>
              );
            })}

            <div className="relative" ref={moreRef}>
              <button
                type="button"
                onClick={() => {
                  playHUDClick();
                  setMoreOpen((v) => !v);
                }}
                className={navButtonClass(moreActive || moreOpen)}
                aria-expanded={moreOpen}
                aria-haspopup="menu"
              >
                {t.header.more}
                <ChevronDown
                  size={14}
                  className={`transition-transform ${moreOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    role="menu"
                    className="absolute left-0 top-full z-300 mt-2 min-w-48 rounded-lg border border-hud-border bg-hud-bg/95 p-1.5 shadow-[0_0_24px_color-mix(in_oklch,var(--hud-cyan)_12%,transparent)] backdrop-blur-xl"
                  >
                    <p className="px-2.5 py-1.5 font-mono text-xs tracking-[0.18em] text-hud-cyan/70 uppercase">
                      {t.header.workshopTools}
                    </p>
                    {MORE_BUTTONS.map(({ id, labelKey }) => {
                      const isActive = activePanel === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          role="menuitem"
                          onClick={() => handleToggle(id)}
                          className={`flex w-full min-h-11 items-center rounded px-2.5 py-2 text-left font-mono text-sm transition-colors ${
                            isActive
                              ? "bg-hud-cyan/15 text-hud-cyan"
                              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          }`}
                        >
                          {t.header[labelKey]}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={handleLogout}
            className="flex h-11 w-11 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-hud-red/10 hover:text-hud-red"
            title={t.header.logout}
            aria-label={t.header.logout}
          >
            <RotateCw size={16} />
          </button>

          <ThemePalettePicker />

          <AnimatedThemeToggler
            variant="hexagon"
            duration={450}
            theme={resolved}
            onThemeChange={(next) => setTheme(next)}
            className="flex h-11 w-11 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            title={resolved === "dark" ? t.theme.light : t.theme.dark}
          />

          <button
            type="button"
            onClick={() => {
              playHUDClick();
              toggleLocale();
            }}
            className="flex h-11 items-center justify-center rounded px-2 font-mono text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:text-base"
            title="Toggle language"
          >
            <Globe size={14} className="mr-1" />
            {locale.toUpperCase()}
          </button>
        </div>
      </motion.header>

      {/* Mobile thumb-zone hire nav */}
      <nav
        className="fixed inset-x-0 bottom-0 z-200 border-t border-hud-border/80 bg-background/95 px-2 pt-1 backdrop-blur-xl md:hidden"
        style={{ paddingBottom: "max(0.35rem, env(safe-area-inset-bottom))" }}
        aria-label="Primary"
      >
        <div className="mx-auto flex max-w-lg items-stretch gap-1">
          {PRIMARY_BUTTONS.map(({ id, labelKey }) => {
            const isActive = activePanel === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleToggle(id)}
                className={dockItemClass(isActive)}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="text-sm font-bold tracking-wide">{t.header[labelKey]}</span>
              </button>
            );
          })}
          <div className="relative flex flex-1" ref={mobileMoreRef}>
            <button
              type="button"
              onClick={() => {
                playHUDClick();
                setMobileMoreOpen((v) => !v);
              }}
              className={dockItemClass(moreActive || mobileMoreOpen)}
              aria-expanded={mobileMoreOpen}
              aria-haspopup="menu"
            >
              <span className="text-sm font-bold tracking-wide">{t.header.more}</span>
            </button>

            <AnimatePresence>
              {mobileMoreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  role="menu"
                  className="absolute bottom-full right-0 mb-2 w-56 rounded-xl border border-hud-border bg-hud-bg/95 p-1.5 shadow-[0_0_24px_color-mix(in_oklch,var(--hud-cyan)_12%,transparent)] backdrop-blur-xl"
                >
                  <p className="px-2.5 py-1.5 font-mono text-xs tracking-[0.18em] text-hud-cyan/70 uppercase">
                    {t.header.workshopTools}
                  </p>
                  {MORE_BUTTONS.map(({ id, labelKey }) => {
                    const isActive = activePanel === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        role="menuitem"
                        onClick={() => handleToggle(id)}
                        className={`flex w-full min-h-12 items-center rounded-lg px-3 py-2.5 text-left font-mono text-sm transition-colors ${
                          isActive
                            ? "bg-hud-cyan/15 text-hud-cyan"
                            : "text-muted-foreground active:bg-accent active:text-accent-foreground"
                        }`}
                      >
                        {t.header[labelKey]}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      <HudConfirmDialog
        open={restartOpen}
        title={t.header.logoutConfirmTitle}
        description={t.header.logoutConfirm}
        confirmLabel={t.header.logoutConfirmAction}
        cancelLabel={t.header.logoutCancel}
        onConfirm={confirmRestart}
        onCancel={() => setRestartOpen(false)}
      />
    </>
  );
}
