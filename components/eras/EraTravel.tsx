"use client";

/**
 * Erebo wormhole travel between eras (Ronda 7, pulido).
 *
 * Erebo is not just an absorption effect: Erebo IS the connection
 * between every point in time, an Interstellar-style wormhole. The
 * trip goes through Erebo's throat (a ring of light, like Gargantua's
 * photon ring in the scene) and emerges in the other era. The overlay
 * reuses Erebo's own palette from `NyxheimBodies.tsx`: a black event
 * horizon, a warm amber accretion glow (#ff8c1a) and a bright photon
 * ring (#fff7d6). It does NOT reuse the real 3D Erebo as an anchor:
 * the overlay has to cover the whole screen (including the LEGACY
 * header, z-3000, and its fixed chip, z-3500) during the trip, and the
 * scene unmounts mid-trip, so the throat is drawn as a 2D photon ring
 * with the same colors and proportions as the 3D one.
 *
 * `EraTravelProvider` wraps the whole app (in `app/layout.tsx`) and
 * renders the overlay; any switcher calls `travelTo(era)` from
 * `useEraTravel()`. The transition ONLY fires from the switcher —
 * initial load, deep links and back/forward render directly, with no
 * overlay.
 *
 * Sequence (~2.1 s, easing `[0.16, 1, 0.3, 1]`):
 *   pull 0–0.55 s — the view dims and a spiral of amber streaks
 *     (repeating conic gradient) rotates and grows from the center,
 *     dragging the eye inward;
 *   throat 0.4–1.15 s — the photon ring collapses toward a point of
 *     light: the crossing of Erebo's throat;
 *   darkness 1.05–1.6 s — total black; `router.push(dest)` fires at
 *     ~1.05 s, at maximum coverage, so the route change is invisible;
 *     the only text in the dark is the destination era's NAME — no
 *     years — under a small "a través de Erebo" caption;
 *   emergence 1.6–2.1 s — a ring of light expands from the center and
 *     the overlay dissolves into the new era.
 * Clicking during the trip skips to the end. With
 * `prefers-reduced-motion`: 300 ms crossfade + static name card.
 *
 * The triquetra from the old tunnel is gone: the singularity point is
 * Erebo's photon ring itself, and a DARK sigil does not fit a
 * wormhole crossing.
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

/** Erebo's palette, shared with the 3D black hole in NyxheimBodies. */
const PHOTON = "#fff7d6";
const ACCRETION = "#ff8c1a";

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
      // it out under the overlay (no-op when it never started).
      noteAmbientGesture();
      stopAmbient();
      playTimeTravel();
      if (reduced) {
        // Reduced motion: 300 ms crossfade + static name card.
        timers.current.push(
          window.setTimeout(() => {
            navigated.current = true;
            router.push(dest, { scroll: false });
          }, 150)
        );
        timers.current.push(window.setTimeout(finish, 320));
        return;
      }
      // Navigate at maximum darkness (~1.05 s); dissolve by ~2.1 s.
      timers.current.push(
        window.setTimeout(() => {
          navigated.current = true;
          router.push(dest, { scroll: false });
        }, 1050)
      );
      timers.current.push(window.setTimeout(finish, 2100));
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
            className="fixed inset-0 z-[4000] flex cursor-pointer flex-col items-center justify-center overflow-hidden bg-black text-[#e2e8f0]"
            initial={{ opacity: 0 }}
            animate={{ opacity: reduced ? 1 : [0, 1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={
              reduced
                ? { duration: 0.3, ease: EASE }
                : { duration: 2.1, times: [0, 0.26, 0.79, 1], ease: "easeInOut" }
            }
          >
            {!reduced && (
              <>
                {/* Pull: amber spiral, rotating and growing from center. */}
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute top-1/2 left-1/2 h-[90vmin] w-[90vmin]"
                  style={{
                    background: `repeating-conic-gradient(from 0deg, ${ACCRETION} 0deg 5deg, transparent 5deg 18deg, rgba(255,247,214,0.55) 18deg 21deg, transparent 21deg 42deg)`,
                    maskImage:
                      "radial-gradient(circle, black 0%, black 30%, transparent 68%)",
                    WebkitMaskImage:
                      "radial-gradient(circle, black 0%, black 30%, transparent 68%)",
                  }}
                  initial={{ scale: 0.15, opacity: 0, x: "-50%", y: "-50%", rotate: 0 }}
                  animate={{ scale: 2.4, opacity: [0, 0.9, 0], rotate: 600 }}
                  transition={{ duration: 1.05, ease: EASE }}
                />
                {/* Accretion rings expanding outward as the spiral pulls in. */}
                {[0, 1].map((i) => (
                  <motion.div
                    key={i}
                    aria-hidden
                    className="pointer-events-none absolute top-1/2 left-1/2 rounded-full border"
                    style={{
                      width: 260 + i * 220,
                      height: 260 + i * 220,
                      borderColor: `${ACCRETION}55`,
                    }}
                    initial={{ scale: 0.2, opacity: 0, x: "-50%", y: "-50%" }}
                    animate={{ scale: [0.2, 1.5], opacity: [0, 0.6, 0] }}
                    transition={{ duration: 1.0, delay: 0.1 + i * 0.18, ease: EASE }}
                  />
                ))}
                {/* Throat: Erebo's photon ring collapsing to a point. */}
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    border: `2px solid ${PHOTON}`,
                    boxShadow: `0 0 42px 12px rgba(255,140,26,0.55), 0 0 90px 30px rgba(255,140,26,0.25), inset 0 0 24px rgba(255,247,214,0.6)`,
                  }}
                  initial={{ scale: 2.4, opacity: 0 }}
                  animate={{ scale: [2.4, 0.06], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 0.8, delay: 0.4, times: [0, 0.5, 0.85, 1], ease: EASE }}
                />
                {/* Singularity point: the last light before total dark. */}
                <motion.div
                  aria-hidden
                  className="absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
                  style={{ boxShadow: "0 0 36px 14px rgba(255,247,214,0.8)" }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 0.55, delay: 0.85, ease: EASE }}
                />
                {/* Emergence: a ring of light expands from the throat. */}
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    border: `2px solid ${PHOTON}`,
                    boxShadow: `0 0 42px 12px rgba(255,140,26,0.55), 0 0 90px 30px rgba(255,140,26,0.25)`,
                  }}
                  initial={{ scale: 0.05, opacity: 0 }}
                  animate={{ scale: [0.05, 2.6], opacity: [0, 1, 0] }}
                  transition={{ duration: 0.5, delay: 1.6, ease: EASE }}
                />
              </>
            )}
            {/* Darkness beat: only the destination era's name, no years. */}
            <motion.div
              className="relative flex flex-col items-center gap-3 text-center"
              initial={{ opacity: 0, y: reduced ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduced ? 0 : 1.15, duration: 0.4, ease: EASE }}
            >
              <p className="font-mono text-xs tracking-[0.5em] text-[#ffb347] uppercase">
                {t.eras.throughErebo}
              </p>
              <p className="font-mono text-3xl font-bold tracking-[0.3em] md:text-4xl">
                {target.name}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </EraTravelContext.Provider>
  );
}
