"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useHUDStore } from "@/lib/store/useHUDStore";
import { playBootupChime, playHUDClick } from "@/lib/audio/audio";

const BOOT_LINE_COUNT = 6;
const LINE_INTERVAL_MS = 280;
const DONE_DELAY_MS = 320;
const COMPLETE_DELAY_MS = 280;

type Phase = "gate" | "typing" | "done";

export default function BootupSequence() {
  const [phase, setPhase] = useState<Phase>("gate");
  const [visibleLines, setVisibleLines] = useState(0);
  const { t } = useTranslation();
  const cancelledRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const lines = [
    t.bootup.initializing,
    t.bootup.loading,
    t.bootup.mounting,
    t.bootup.allocating,
    t.bootup.neural,
    t.bootup.granted,
  ];

  const clearTimers = useCallback(() => {
    cancelledRef.current = true;
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const enterNow = useCallback(() => {
    clearTimers();
    playHUDClick();
    useHUDStore.getState().completeBoot();
  }, [clearTimers]);

  const schedule = useCallback((fn: () => void, delay: number) => {
    const id = setTimeout(() => {
      if (!cancelledRef.current) fn();
    }, delay);
    timersRef.current.push(id);
  }, []);

  const startIntro = useCallback(() => {
    clearTimers();
    cancelledRef.current = false;
    playHUDClick();
    setVisibleLines(0);
    setPhase("typing");

    const { soundEnabled } = useHUDStore.getState();
    if (soundEnabled) playBootupChime();

    let i = 0;
    intervalRef.current = setInterval(() => {
      if (cancelledRef.current) return;
      i += 1;
      setVisibleLines(i);
      if (i >= BOOT_LINE_COUNT) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        schedule(() => {
          setPhase("done");
          schedule(() => useHUDStore.getState().completeBoot(), COMPLETE_DELAY_MS);
        }, DONE_DELAY_MS);
      }
    }, LINE_INTERVAL_MS);
  }, [clearTimers, schedule]);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      // Still show the gate so the user can enter consciously; do not auto-play theater.
      return;
    }
    return () => clearTimers();
  }, [clearTimers]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center bg-background">
      <button
        type="button"
        onClick={enterNow}
        className="absolute right-4 top-4 z-10 min-h-10 rounded px-3 font-mono text-sm tracking-widest text-muted-foreground transition-colors hover:text-hud-cyan focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hud-cyan"
      >
        {t.bootup.skip}
      </button>

      <div className="mx-4 w-full max-w-lg">
        <AnimatePresence mode="wait">
          {phase === "gate" && (
            <motion.div
              key="gate"
              initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-6 rounded-lg border border-hud-border/70 bg-hud-bg/55 p-8 text-center backdrop-blur-xl md:p-10"
              style={{
                boxShadow:
                  "0 0 40px oklch(0.65 0.18 255 / 0.1), inset 0 1px 0 oklch(1 0 0 / 0.05)",
              }}
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-hud-cyan text-3xl font-black text-hud-cyan shadow-[0_0_30px_oklch(0.65_0.18_255/0.15)]">
                G
              </div>
              <div className="space-y-2">
                <h1 className="font-mono text-sm tracking-[0.3em] text-muted-foreground">
                  {t.bootup.title}
                </h1>
                <p className="text-base text-foreground md:text-lg">{t.bootup.tagline}</p>
              </div>

              <div className="flex w-full max-w-xs flex-col gap-3 pt-2">
                <button
                  type="button"
                  onClick={enterNow}
                  className="min-h-12 w-full rounded border border-hud-cyan/50 bg-hud-cyan/10 px-4 py-3 font-mono text-sm font-bold tracking-[0.2em] text-hud-cyan uppercase transition-colors hover:bg-hud-cyan/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hud-cyan md:text-base"
                >
                  {t.bootup.enter}
                </button>
                <button
                  type="button"
                  onClick={startIntro}
                  className="min-h-11 w-full rounded px-4 py-2.5 font-mono text-sm tracking-widest text-muted-foreground transition-colors hover:text-hud-cyan focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hud-cyan"
                >
                  {t.bootup.watchIntro}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {(phase === "typing" || phase === "done") && (
            <motion.div
              key="term"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-lg border border-hud-border bg-hud-bg p-5 font-mono text-sm backdrop-blur-xl md:text-base"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="tracking-widest text-muted-foreground uppercase">
                  {t.bootup.title}
                </span>
                <button
                  type="button"
                  onClick={enterNow}
                  className="min-h-10 rounded border border-hud-border px-3 font-mono text-xs tracking-widest text-hud-cyan transition-colors hover:bg-hud-cyan/10"
                >
                  {t.bootup.enter}
                </button>
              </div>
              {lines.slice(0, visibleLines).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mb-1"
                >
                  {line === t.bootup.granted && <span className="text-hud-green">✔ </span>}
                  <span
                    className={
                      line === t.bootup.granted
                        ? "text-hud-green"
                        : line === t.bootup.neural
                          ? "text-hud-cyan"
                          : "text-muted-foreground"
                    }
                  >
                    {line}
                  </span>
                </motion.div>
              ))}
              {phase === "typing" && (
                <span className="inline-block h-3 w-1.5 animate-pulse bg-hud-cyan" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
