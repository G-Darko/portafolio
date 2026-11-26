"use client";

/**
 * Era switcher (Ronda 7, pulido): the public control that lets any
 * visitor travel between eras. Driven entirely by the `ERAS` registry
 * (`lib/eras.ts`): it lists every era by NAME ONLY — no years anywhere
 * in the selector (the `years` data stays in the registry, it is just
 * never displayed) — marks "Estás aquí" on the current one, and fires
 * the Erebo wormhole transition via `useEraTravel()`; it never
 * navigates directly.
 *
 * The selector is no longer a dropdown menu: it is a circular DIAL,
 * like a clock, with Erebo (a black dot ringed in gold, the wormhole
 * that connects every point in time) at the center and the three eras
 * around it at 120 degrees. The active era is ringed in gold.
 *
 * Variants (same dial, adapted to each design):
 * - `topbar`: compact button next to the Exordia settings (clock icon);
 *   the dial opens in a centered modal (portal to body, so no ancestor
 *   transform can clip it) — usable on mobile.
 * - `card`: the dial lives inline, always visible, inside the Exordia
 *   welcome card (OverviewCard), at a smaller size.
 * - `hud`: a button in the restored HUD header; dial in a modal.
 * - `legacy`: a fixed corner chip on the LEGACY era (legacy palette);
 *   dial in a modal, centered — no more upward menu.
 */
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { History, X } from "lucide-react";
import { ERAS, type EraId } from "@/lib/eras";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useEraTravel } from "./EraTravel";
import { playHUDClick } from "@/lib/audio/audio";

/** Clock positions for the three eras: top, bottom-right, bottom-left. */
const DIAL_ANGLES = [-90, 30, 150];

function EraDial({
  currentEra,
  onPick,
  size,
}: {
  currentEra: EraId;
  onPick: (id: EraId) => void;
  size: "md" | "sm";
}) {
  const { t } = useTranslation();
  const { travelingTo } = useEraTravel();
  const dim = size === "md" ? 300 : 232;
  const node = size === "md" ? 76 : 58;
  const centerDot = size === "md" ? 48 : 38;

  return (
    <div
      role="group"
      aria-label={t.eras.title}
      className="relative shrink-0 rounded-full border border-[#ff8c1a]/40"
      style={{
        width: dim,
        height: dim,
        background:
          "radial-gradient(circle, #0b0b14 0%, #05070d 62%, #03040a 100%)",
        boxShadow:
          "0 0 48px rgba(255,140,26,0.18), 0 0 120px rgba(255,140,26,0.08), inset 0 0 40px rgba(255,140,26,0.06)",
      }}
    >
      {/* Clock ticks around the rim. */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        const r = 46.5;
        return (
          <span
            key={i}
            aria-hidden
            className="absolute h-1.5 w-1.5 rounded-full bg-[#ffb347]/40"
            style={{
              left: `${50 + r * Math.cos(a)}%`,
              top: `${50 + r * Math.sin(a)}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        );
      })}
      {/* Center: Erebo, the wormhole that connects every era. */}
      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5">
        <span
          aria-hidden
          className="rounded-full bg-black"
          style={{
            width: centerDot,
            height: centerDot,
            border: "2px solid #fff7d6",
            boxShadow:
              "0 0 18px 4px rgba(255,140,26,0.55), 0 0 44px 12px rgba(255,140,26,0.22)",
          }}
        />
        <span className="font-mono text-[9px] font-bold tracking-[0.35em] text-[#ffb347]">
          EREBO
        </span>
      </div>
      {/* Era nodes around the dial. */}
      {ERAS.map((era, i) => {
        const here = era.id === currentEra;
        const a = (DIAL_ANGLES[i] * Math.PI) / 180;
        const r = 36;
        return (
          <button
            key={era.id}
            type="button"
            disabled={here || Boolean(travelingTo) || !era.hasContent}
            onClick={() => onPick(era.id)}
            aria-current={here ? "page" : undefined}
            aria-label={
              here
                ? `${era.name}, ${t.eras.here}`
                : `${t.eras.travelTo} ${era.name}`
            }
            title={t.eras[era.taglineKey as keyof typeof t.eras]}
            className={`hud-focus-ring absolute flex items-center justify-center rounded-full border font-mono font-bold transition-all ${
              size === "md" ? "text-[11px] tracking-wider" : "text-[9px] tracking-wide"
            } ${
              here
                ? "border-[#fff7d6] bg-[#ff8c1a]/20 text-[#fff7d6] shadow-[0_0_20px_rgba(255,140,26,0.45)]"
                : "border-[#ffb347]/35 bg-[#05070d]/90 text-[#e2e8f0]/80 hover:border-[#fff7d6] hover:bg-[#ff8c1a]/10 hover:text-white"
            }`}
            style={{
              width: node,
              height: node,
              left: `${50 + r * Math.cos(a)}%`,
              top: `${50 + r * Math.sin(a)}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {era.name}
          </button>
        );
      })}
    </div>
  );
}

/** Centered modal shell for the dial (topbar / hud / legacy variants). */
function DialModal({
  currentEra,
  onPick,
  onClose,
}: {
  currentEra: EraId;
  onPick: (id: EraId) => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.eras.title}
      className="fixed inset-0 z-[5000] flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label={t.eras.close}
        onClick={onClose}
        className="absolute inset-0 cursor-pointer bg-black/70 backdrop-blur-sm"
      />
      <div className="relative flex max-h-full flex-col items-center gap-4 overflow-y-auto rounded-2xl border border-[#ff8c1a]/25 bg-[#05070d]/95 p-6 shadow-[0_0_60px_rgba(255,140,26,0.2)]">
        <button
          type="button"
          onClick={onClose}
          aria-label={t.eras.close}
          className="hud-focus-ring absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full text-[#94a3b8] transition-colors hover:bg-white/10 hover:text-white"
        >
          <X size={16} aria-hidden />
        </button>
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="font-mono text-xs font-bold tracking-[0.3em] text-[#ffb347] uppercase">
            {t.eras.title}
          </p>
          <p className="max-w-[260px] font-mono text-xs text-[#94a3b8]">
            {t.eras.subtitle}
          </p>
        </div>
        <EraDial currentEra={currentEra} onPick={onPick} size="md" />
        <p className="font-mono text-xs text-[#94a3b8]">
          {t.eras.here}:{" "}
          <span className="font-bold text-[#fff7d6]">
            {ERAS.find((e) => e.id === currentEra)?.name}
          </span>
        </p>
      </div>
    </div>,
    document.body
  );
}

export function EraSwitcher({
  currentEra,
  variant,
}: {
  currentEra: EraId;
  variant: "topbar" | "card" | "hud" | "legacy";
}) {
  const { t } = useTranslation();
  const { travelTo, travelingTo } = useEraTravel();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
        <div className="mt-3 flex justify-center">
          <EraDial currentEra={currentEra} onPick={go} size="sm" />
        </div>
        <p className="mt-3 text-center font-mono text-xs text-muted-foreground">
          {t.eras.here}:{" "}
          <span className="font-bold text-hud-cyan">
            {ERAS.find((e) => e.id === currentEra)?.name}
          </span>
        </p>
      </div>
    );
  }

  if (variant === "legacy") {
    return (
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => {
            playHUDClick();
            setOpen((v) => !v);
          }}
          aria-expanded={open}
          aria-haspopup="dialog"
          title={t.eras.title}
          className="flex min-h-11 items-center gap-2 rounded-[10px] border border-[#66ccff]/60 bg-[#1e1e1e]/95 px-4 py-2.5 text-sm font-bold tracking-wide text-[#f0f0f0] shadow-[0_4px_16px_rgba(0,0,0,0.5)] transition-colors hover:border-[#66ccff] hover:text-[#66ccff]"
        >
          <History size={16} aria-hidden />
          {t.eras.title}
        </button>
        {open && (
          <DialModal
            currentEra={currentEra}
            onPick={go}
            onClose={() => setOpen(false)}
          />
        )}
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
        aria-haspopup="dialog"
        title={t.eras.title}
        className={buttonClass}
      >
        <History size={16} aria-hidden />
        <span className={variant === "hud" ? "" : "hidden sm:inline"}>{t.eras.era}</span>
      </button>
      {open && (
        <DialModal
          currentEra={currentEra}
          onPick={go}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
