"use client";

/**
 * Era switcher (Ronda 7): the public control that lets any visitor travel
 * between eras. Driven entirely by the `ERAS` registry (`lib/eras.ts`):
 * it lists every era with name + years, marks "Estás aquí" on the
 * current one, and fires the DARK transition via `useEraTravel()` —
 * it never navigates directly.
 *
 * Variants (same idea, adapted to each design):
 * - `topbar`: compact button next to the Exordia settings (clock icon).
 * - `card`: a row inside the Exordia welcome card (OverviewCard).
 * - `hud`: a button in the restored HUD header.
 */
import { useEffect, useRef, useState } from "react";
import { History } from "lucide-react";
import { ERAS, type EraId } from "@/lib/eras";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useEraTravel } from "./EraTravel";
import { playHUDClick } from "@/lib/audio/audio";

export function EraSwitcher({
  currentEra,
  variant,
}: {
  currentEra: EraId;
  variant: "topbar" | "card" | "hud";
}) {
  const { t } = useTranslation();
  const { travelTo, travelingTo } = useEraTravel();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open ]);

  const go = (id: EraId) => {
    if (id === currentEra || travelingTo) return;
    setOpen(false);
    travelTo(id);
  };

  if (variant === "card") {
    return (
      <div className="mt-4 border-t border-hud-border/60 pt-3">
        <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
          {t.eras.title}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {ERAS.map((era) => {
            const here = era.id === currentEra;
            return (
              <button
                key={era.id}
                type="button"
                disabled={here || Boolean(travelingTo)}
                onClick={() => {
                  playHUDClick();
                  go(era.id);
                }}
                aria-current={here ? "page" : undefined}
                title={t.eras[era.taglineKey as keyof typeof t.eras]}
                className={`hud-focus-ring rounded-full border px-2.5 py-1.5 font-mono text-xs font-bold tracking-wide transition-colors ${
                  here
                    ? "border-hud-cyan/70 bg-hud-cyan/15 text-hud-cyan"
                    : "border-hud-border/60 bg-hud-bg/60 text-muted-foreground hover:border-hud-cyan/50 hover:text-foreground"
                }`}
              >
                {era.name} {era.years}
                {here ? ` — ${t.eras.here}` : ""}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const buttonClass =
    variant === "hud"
      ? "flex min-h-11 items-center gap-1.5 rounded px-2.5 py-2 text-sm font-mono transition-colors text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      : "hud-focus-ring pointer-events-auto flex h-11 items-center gap-1.5 rounded px-2.5 font-mono text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => {
          playHUDClick();
          setOpen((v) => !v);
        }}
        aria-expanded={open}
        aria-haspopup="menu"
        title={t.eras.title}
        className={buttonClass}
      >
        <History size={16} aria-hidden />
        <span className={variant === "hud" ? "" : "hidden sm:inline"}>{t.eras.era}</span>
      </button>
      {open && (
        <div
          role="menu"
          className={`absolute right-0 z-[300] mt-2 w-72 rounded-xl border border-hud-border bg-hud-bg/95 p-2 shadow-[0_0_24px_color-mix(in_oklch,var(--hud-cyan)_12%,transparent)] backdrop-blur-xl ${
            variant === "hud" ? "top-full" : "top-full"
          }`}
        >
          <p className="px-2 py-1.5 font-mono text-xs tracking-[0.18em] text-hud-cyan uppercase">
            {t.eras.title}
          </p>
          <p className="px-2 pb-2 font-mono text-xs text-muted-foreground">{t.eras.subtitle}</p>
          {ERAS.map((era) => {
            const here = era.id === currentEra;
            return (
              <button
                key={era.id}
                type="button"
                role="menuitem"
                disabled={here || Boolean(travelingTo)}
                onClick={() => go(era.id)}
                className={`flex w-full min-h-11 flex-col items-start rounded px-2.5 py-2 text-left font-mono text-sm transition-colors ${
                  here
                    ? "bg-hud-cyan/15 text-hud-cyan"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <span className="flex w-full items-center justify-between gap-2 font-bold tracking-wide">
                  <span className="whitespace-nowrap">
                    {era.name} <span className="font-normal opacity-70">{era.years}</span>
                  </span>
                  {here ? (
                    <span className="shrink-0 text-xs font-normal whitespace-nowrap">{t.eras.here}</span>
                  ) : !era.hasContent ? (
                    <span className="shrink-0 text-xs font-normal whitespace-nowrap opacity-70">{t.eras.comingSoon}</span>
                  ) : (
                    <span className="shrink-0 text-xs font-normal whitespace-nowrap opacity-70">{t.eras.travelTo} →</span>
                  )}
                </span>
                <span className="mt-0.5 text-xs opacity-80">
                  {t.eras[era.taglineKey as keyof typeof t.eras]}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
