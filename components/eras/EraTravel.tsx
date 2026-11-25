"use client";

/**
 * DARK-style time travel between eras (Ronda 7).
 *
 * `EraTravelProvider` wraps the whole app (in `app/layout.tsx`) and
 * renders the tunnel overlay; any switcher calls `travelTo(era)` from
 * `useEraTravel()`. The transition ONLY fires from the switcher — initial
 * load, deep links and back/forward render directly, with no overlay.
 *
 * Sequence (~1.8 s, easing `[0.16, 1, 0.3, 1]`):
 *   exit 0–0.35 s — the view dims and a thin ring expands from center;
 *   tunnel 0.35–1.15 s — full-screen `#05070d` overlay, concentric rings
 *     scaling toward the viewer with stagger + a bright center point and
 *     a triquetra (inline SVG, stroke draws itself);
 *   date card 0.9–1.5 s — DARK-style card: TULTITLÁN / era name / years;
 *   arrival 1.15–1.8 s — `router.push(dest)` fires at ~1.0 s, at maximum
 *     coverage, so the route change is invisible; the new era emerges
 *     and the overlay dissolves.
 * Clicking during the trip skips to the end. With
 * `prefers-reduced-motion`: 300 ms crossfade + static date card.
 */
import { createContext, useCallback, useContext, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { ACTIVE_ERA_ID, ERAS, eraHref, getEra, type EraId } from "@/lib/eras";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { usePrefersReducedMotion } from "@/lib/nyxheim/useNyxheimStore";
import { playTimeTravel } from "@/lib/audio/audio";
import { noteAmbientGesture, stopAmbient } from "@/lib/audio/ambient";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface EraTravelApi {
  travelTo: (era: EraId) => void;
  travelingTo: EraId | null;
}

const EraTravelContext = createContext<EraTravelApi>({
  travelTo: () => {},
  travelingTo: null,
});

export function useEraTravel(): EraTravelApi {
  return useContext(EraTravelContext);
}

/** Era rendered at a pathname: `/era/<id>/...` → that era, else the active one. */
export function eraFromPathname(pathname: string): EraId {
  const match = pathname.match(/^\/era\/([^/]+)/);
  if (match) {
    const found = ERAS.find((e) => e.id === match[1]);
    if (found) return found.id;
  }
  return ACTIVE_ERA_ID;
}

/**
 * Stylized triquetra: three interlocking arcs (vesica piscis) around a
 * center point, drawn as SVG paths so the stroke can draw itself.
 */
function Triquetra({ className }: { className?: string }) {
  const arcs = [
    "M 50 18 A 26 26 0 0 1 72 62",
    "M 78 68 A 26 26 0 0 1 22 68",
    "M 28 62 A 26 26 0 0 1 50 18",
  ];
  return (
    <svg viewBox="0 0 100 86" className={className} aria-hidden fill="none">
      {arcs.map((d, i) => (
        <motion.path
          key={d}
          d={d}
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.35 + i * 0.12, ease: EASE }}
        />
      ))}
      <motion.circle
        cx={50}
        cy={50}
        r={3}
        fill="currentColor"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.3, ease: EASE }}
      />
    </svg>
  );
}

export function EraTravelProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();
  const reduced = usePrefersReducedMotion();
  const [travel, setTravel] = useState<{ from: EraId; to: EraId } | null>(null);
  const timers = useRef<number[]>([]);
  const navigated = useRef(false);

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  const finish = useCallback(() => {
    clearTimers();
    setTravel(null);
    navigated.current = false;
  }, [clearTimers]);

  const travelTo = useCallback(
    (to: EraId) => {
      const from = eraFromPathname(pathname ?? "/");
      if (to === from || travel) return;
      const dest = eraHref(to);
      navigated.current = false;
      setTravel({ from, to });
      // The click that starts the travel is a real gesture, and the
      // Exordia drone must not follow the user into the next era: fade
      // it out under the tunnel (no-op when it never started).
      noteAmbientGesture();
      stopAmbient();
      playTimeTravel();
      if (reduced) {
        // Reduced motion: 300 ms crossfade + static date card.
        timers.current.push(
          window.setTimeout(() => {
            navigated.current = true;
            router.push(dest, { scroll: false });
          }, 150)
        );
        timers.current.push(window.setTimeout(finish, 320));
        return;
      }
      // Navigate at maximum coverage (~1.0 s); dissolve by ~1.8 s.
      timers.current.push(
        window.setTimeout(() => {
          navigated.current = true;
          router.push(dest, { scroll: false });
        }, 1000)
      );
      timers.current.push(window.setTimeout(finish, 1800));
    },
    [pathname, reduced, router, travel, finish]
  );

  // Click during the trip = skip to the end.
  const skip = useCallback(() => {
    if (!travel) return;
    if (!navigated.current) {
      navigated.current = true;
      router.push(eraHref(travel.to), { scroll: false });
    }
    finish();
  }, [travel, router, finish]);

  const target = travel ? getEra(travel.to) : undefined;

  return (
    <EraTravelContext.Provider value={{ travelTo, travelingTo: travel?.to ?? null }}>
      {children}
      <AnimatePresence>
        {travel && target && (
          <motion.div
            key="era-travel"
            role="dialog"
            aria-label={t.eras.title}
            onClick={skip}
            // Above the legacy header (z-3000) and its fixed travel chip
            // (z-3500): with z-999 the outgoing header stayed visible
            // on top of the tunnel for the whole trip from LEGACY.
            className="fixed inset-0 z-[4000] flex cursor-pointer flex-col items-center justify-center overflow-hidden bg-[#05070d] text-[#e2e8f0]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.3 : 0.35, ease: EASE }}
          >
            {/* Exit ring: expands from the center as the old view dims. */}
            {!reduced && (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#22d3ee]/70"
                initial={{ scale: 0.2, opacity: 0.9 }}
                animate={{ scale: 14, opacity: 0 }}
                transition={{ duration: 1.1, ease: EASE }}
              />
            )}
            {/* Tunnel: concentric rings scaling toward the viewer. */}
            {!reduced &&
              [0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  aria-hidden
                  className="pointer-events-none absolute top-1/2 left-1/2 rounded-full border border-[#22d3ee]/25"
                  style={{ width: 320 + i * 260, height: 320 + i * 260 }}
                  initial={{ scale: 0.15, opacity: 0, x: "-50%", y: "-50%" }}
                  animate={{ scale: [0.15, 1.6], opacity: [0, 0.7, 0] }}
                  transition={{ duration: 1.4, delay: 0.3 + i * 0.15, ease: EASE }}
                />
              ))}
            {/* Bright center point + triquetra. */}
            <div className="relative flex flex-col items-center">
              {!reduced && (
                <motion.div
                  aria-hidden
                  className="absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
                  style={{ boxShadow: "0 0 32px 10px rgba(255,255,255,0.55)" }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.4, 1], opacity: [0, 1, 0.9] }}
                  transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
                />
              )}
              <Triquetra className="h-24 w-28 text-[#22d3ee] md:h-28 md:w-32" />
            </div>
            {/* DARK-style date card. */}
            <motion.div
              className="mt-10 flex flex-col items-center gap-2 text-center"
              initial={{ opacity: 0, y: reduced ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduced ? 0 : 0.9, duration: 0.4, ease: EASE }}
            >
              <p className="font-mono text-xs tracking-[0.5em] text-[#94a3b8] uppercase">
                Tultitlán
              </p>
              <p className="font-mono text-2xl font-bold tracking-[0.3em] md:text-3xl">
                {target.name}
              </p>
              <p className="font-mono text-sm tracking-[0.35em] text-[#22d3ee]">
                {target.years}
              </p>
              <p className="mt-2 max-w-xs font-mono text-xs leading-relaxed text-[#94a3b8]">
                {t.eras[target.blurbKey as keyof typeof t.eras]}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </EraTravelContext.Provider>
  );
}
