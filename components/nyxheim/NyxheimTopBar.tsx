"use client";

import { Globe } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useLocaleStore } from "@/lib/store/useLocaleStore";
import { useNyxheimStore } from "@/lib/nyxheim/useNyxheimStore";
import { playHUDClick } from "@/lib/audio/audio";
import ThemePalettePicker from "@/components/hud/ThemePalettePicker";

/**
 * The only chrome above the world: the system name (Exordia, a button that
 * opens the welcome card), the section navigator for the important
 * destinations (Nyxheim, Sinistra, CV, Contacto, Certificaciones), and the
 * compact settings cluster (palette, language). There is no HUD header
 * anymore: every destination already lives inside the system.
 */
const SECTIONS = [
  { id: "base", labelKey: "base" },
  { id: "sinistra", labelKey: "sinistra" },
  { id: "cv", labelKey: "cv" },
  { id: "contacto", labelKey: "contacto" },
  { id: "certificaciones", labelKey: "certificaciones" },
] as const;

export function NyxheimTopBar() {
  const { t } = useTranslation();
  const { locale, toggleLocale } = useLocaleStore();
  const focus = useNyxheimStore((s) => s.focus);
  const focusedId = useNyxheimStore((s) => s.focusedId);
  const overviewOpen = useNyxheimStore((s) => s.overviewOpen);
  const toggleOverview = useNyxheimStore((s) => s.toggleOverview);

  const sectionLabel = (id: string): string => {
    switch (id) {
      case "base":
        return t.nyxheim.base;
      case "sinistra":
        return t.nyxheim.sinistra;
      case "cv":
        return "CV";
      case "contacto":
        return t.header.contact;
      case "certificaciones":
        return t.header.certifications;
      default:
        return id;
    }
  };

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-20 px-3 pt-3 md:px-6"
      style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
    >
      <div className="flex flex-wrap items-center gap-2">
        {/* System name: the welcome card is born closed and opens here. */}
        <button
          type="button"
          onClick={() => {
            playHUDClick();
            toggleOverview();
          }}
          aria-expanded={overviewOpen}
          aria-label={overviewOpen ? t.nyxheim.closeWelcome : t.nyxheim.openWelcome}
          title={t.nyxheim.systemSubtitle}
          className="hud-focus-ring pointer-events-auto flex min-h-11 items-center gap-2 rounded-xl border border-hud-border/60 bg-hud-bg/60 px-3 py-2 backdrop-blur-xl transition-colors hover:border-hud-cyan/50"
        >
          <span
            aria-hidden
            className="h-2.5 w-2.5 rounded-full bg-[#ffb347]"
            style={{ boxShadow: "0 0 10px #ffb347" }}
          />
          <span className="font-mono text-sm font-bold tracking-[0.22em] text-foreground md:text-base">
            {t.nyxheim.systemName}
          </span>
          <span className="hidden font-mono text-xs text-muted-foreground sm:block">
            {t.nyxheim.systemSubtitle}
          </span>
        </button>

        {/* Section navigator: the important destinations, always visible. */}
        <nav
          aria-label={t.nyxheim.sections}
          className="order-3 flex w-full gap-1.5 overflow-x-auto pb-1 md:order-2 md:w-auto md:flex-1 md:justify-center md:overflow-visible md:pb-0"
          style={{ scrollbarWidth: "none" }}
        >
          {SECTIONS.map(({ id }) => {
            const active = focusedId === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  playHUDClick();
                  focus(id);
                }}
                aria-current={active ? "page" : undefined}
                className={`hud-focus-ring pointer-events-auto shrink-0 rounded-full border px-3 py-2 font-mono text-xs font-bold tracking-wide whitespace-nowrap backdrop-blur-xl transition-colors md:text-sm ${
                  active
                    ? "border-hud-cyan/70 bg-hud-cyan/15 text-hud-cyan"
                    : "border-hud-border/60 bg-hud-bg/60 text-muted-foreground hover:border-hud-cyan/50 hover:text-foreground"
                }`}
              >
                {sectionLabel(id)}
              </button>
            );
          })}
        </nav>

        {/* Settings: palette + language. No theme toggle: dark is the only mode. */}
        <div className="pointer-events-auto order-2 ml-auto flex items-center gap-1 md:order-3 md:ml-0">
          <ThemePalettePicker />
          <button
            type="button"
            onClick={() => {
              playHUDClick();
              toggleLocale();
            }}
            className="flex h-11 items-center justify-center rounded px-2 font-mono text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:text-base"
            title="Toggle language"
            aria-label="Toggle language"
          >
            <Globe size={14} className="mr-1" aria-hidden />
            {locale.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
}
