"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SlidersHorizontal, Volume2, VolumeX } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useHUDStore } from "@/lib/store/useHUDStore";
import { useNyxheimSettings, type LabelMode } from "@/lib/nyxheim/useNyxheimSettings";
import { playHUDClick } from "@/lib/audio/audio";
import { PaletteGrid } from "@/components/hud/ThemePalettePicker";

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="mb-2 font-mono text-xs font-bold tracking-widest text-hud-cyan uppercase">
      {children}
    </p>
  );
}

function SoundSwitch({
  label,
  enabled,
  onToggle,
}: {
  label: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={onToggle}
      className="hud-focus-ring flex w-full items-center gap-2.5 rounded-lg border border-hud-border/60 px-3 py-2 text-left text-sm text-foreground transition-colors hover:border-hud-cyan/50"
    >
      {enabled ? (
        <Volume2 size={16} aria-hidden className="shrink-0 text-hud-cyan" />
      ) : (
        <VolumeX size={16} aria-hidden className="shrink-0 text-muted-foreground" />
      )}
      <span className="min-w-0 flex-1">{label}</span>
      <span
        aria-hidden
        className={`flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors ${
          enabled ? "bg-hud-cyan/70" : "bg-hud-border/60"
        }`}
      >
        <span
          className={`h-4 w-4 rounded-full bg-white transition-transform ${
            enabled ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}

/**
 * The Nyxheim settings popover: palette, sound (background drone and
 * effect cues, two separate switches) and the label mode (hover-only by
 * default, or always visible). It replaces the standalone palette picker
 * in the top bar so every world setting lives in one place.
 */
export default function NyxheimSettings() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const backgroundSoundEnabled = useHUDStore((s) => s.backgroundSoundEnabled);
  const toggleBackgroundSound = useHUDStore((s) => s.toggleBackgroundSound);
  const effectsSoundEnabled = useHUDStore((s) => s.effectsSoundEnabled);
  const toggleEffectsSound = useHUDStore((s) => s.toggleEffectsSound);
  const labelMode = useNyxheimSettings((s) => s.labelMode);
  const setLabelMode = useNyxheimSettings((s) => s.setLabelMode);

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

  const pickLabelMode = (mode: LabelMode) => {
    playHUDClick();
    setLabelMode(mode);
  };

  const onToggleBackgroundSound = () => {
    // The drone fades out/in on its own; the tick is an effect cue, so it
    // only sounds when effects are enabled.
    toggleBackgroundSound();
    playHUDClick();
  };

  const onToggleEffectsSound = () => {
    // Toggle first (it silences Cuelume), then confirm with a tick — which
    // only sounds when the switch ends up enabled.
    toggleEffectsSound();
    playHUDClick();
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => {
          playHUDClick();
          setOpen((v) => !v);
        }}
        className="flex h-11 w-11 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        title={t.nyxheim.settings}
        aria-label={t.nyxheim.settings}
        aria-expanded={open}
      >
        <SlidersHorizontal size={15} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-full z-300 mt-2 w-72 rounded-lg border border-hud-border bg-hud-bg/95 p-3 shadow-[0_0_24px_color-mix(in_oklch,var(--hud-cyan)_12%,transparent)] backdrop-blur-xl"
          >
            <div className="space-y-4">
              <div>
                <SectionLabel>{t.theme.palette}</SectionLabel>
                <PaletteGrid />
              </div>

              <div>
                <SectionLabel>{t.nyxheim.sound}</SectionLabel>
                <div className="space-y-1.5">
                  <SoundSwitch
                    label={t.nyxheim.soundBackground}
                    enabled={backgroundSoundEnabled}
                    onToggle={onToggleBackgroundSound}
                  />
                  <SoundSwitch
                    label={t.nyxheim.soundEffects}
                    enabled={effectsSoundEnabled}
                    onToggle={onToggleEffectsSound}
                  />
                </div>
              </div>

              <div>
                <SectionLabel>{t.nyxheim.labels}</SectionLabel>
                <div
                  role="group"
                  aria-label={t.nyxheim.labels}
                  className="grid grid-cols-2 gap-1.5"
                >
                  {(
                    [
                      ["hover", t.nyxheim.labelsHover],
                      ["always", t.nyxheim.labelsAlways],
                    ] as const
                  ).map(([mode, label]) => {
                    const active = labelMode === mode;
                    return (
                      <button
                        key={mode}
                        type="button"
                        aria-pressed={active}
                        onClick={() => pickLabelMode(mode)}
                        className={`rounded-lg border px-2 py-2 font-mono text-xs transition-colors ${
                          active
                            ? "border-hud-cyan/60 bg-hud-cyan/10 text-hud-cyan"
                            : "border-hud-border/60 text-muted-foreground hover:border-hud-border hover:text-foreground"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
