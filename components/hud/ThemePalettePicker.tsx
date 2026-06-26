"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Palette } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import {
  HUD_PALETTES,
  type HudPaletteId,
} from "@/lib/theme/hud-color-presets";
import { useColorThemeStore } from "@/lib/store/useColorThemeStore";
import { playHUDClick } from "@/lib/audio/audio";

export default function ThemePalettePicker() {
  const { t, locale } = useTranslation();
  const { paletteId, setPaletteId } = useColorThemeStore();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const handleSelect = (id: HudPaletteId) => {
    playHUDClick();
    setPaletteId(id);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => {
          playHUDClick();
          setOpen((v) => !v);
        }}
        className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        title={t.theme.palette}
        aria-label={t.theme.palette}
        aria-expanded={open}
      >
        <Palette size={15} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-full z-300 mt-2 w-64 rounded-lg border border-hud-border bg-hud-bg/95 p-3 shadow-[0_0_24px_color-mix(in_oklch,var(--hud-cyan)_12%,transparent)] backdrop-blur-xl"
          >
            <p className="mb-2 font-mono text-xs font-bold tracking-widest text-hud-cyan uppercase">
              {t.theme.palette}
            </p>
            <div className="scrollbar-thin grid max-h-64 grid-cols-2 gap-1.5 overflow-y-auto pr-0.5">
              {HUD_PALETTES.map((palette) => {
                const active = paletteId === palette.id;
                const label = locale === "es" ? palette.name : palette.nameEn;
                return (
                  <button
                    key={palette.id}
                    type="button"
                    onClick={() => handleSelect(palette.id)}
                    className={`flex items-center gap-2 rounded border px-2 py-2 text-left transition-colors ${
                      active
                        ? "border-hud-cyan/60 bg-hud-cyan/10 text-hud-cyan"
                        : "border-hud-border/60 text-muted-foreground hover:border-hud-border hover:bg-accent/50 hover:text-foreground"
                    }`}
                  >
                    <span
                      className="h-4 w-4 shrink-0 rounded-full border border-white/20 shadow-[0_0_8px_currentColor]"
                      style={{ backgroundColor: palette.swatch, color: palette.swatch }}
                    />
                    <span className="truncate font-mono text-xs">{label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
