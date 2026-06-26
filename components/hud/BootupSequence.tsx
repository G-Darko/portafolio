"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useHUDStore } from "@/lib/store/useHUDStore";
import { playBootupChime } from "@/lib/audio/audio";

const BOOT_LINE_COUNT = 6;
const LOGO_DELAY_MS = 500;
const LINE_INTERVAL_MS = 350;
const DONE_DELAY_MS = 400;
const COMPLETE_DELAY_MS = 400;

export default function BootupSequence() {
  const [phase, setPhase] = useState<"logo" | "typing" | "done">("logo");
  const [visibleLines, setVisibleLines] = useState(0);
  const { t } = useTranslation();

  const lines = [
    t.bootup.initializing,
    t.bootup.loading,
    t.bootup.mounting,
    t.bootup.allocating,
    t.bootup.neural,
    t.bootup.granted,
  ];

  useEffect(() => {
    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    let lineInterval: ReturnType<typeof setInterval> | null = null;

    const schedule = (fn: () => void, delay: number) => {
      const id = setTimeout(() => {
        if (!cancelled) fn();
      }, delay);
      timeouts.push(id);
    };

    schedule(() => {
      setPhase("typing");
      const { soundEnabled, completeBoot } = useHUDStore.getState();
      if (soundEnabled) playBootupChime();

      let i = 0;
      lineInterval = setInterval(() => {
        if (cancelled) return;
        i += 1;
        setVisibleLines(i);
        if (i >= BOOT_LINE_COUNT) {
          if (lineInterval) clearInterval(lineInterval);
          lineInterval = null;
          schedule(() => {
            setPhase("done");
            schedule(() => completeBoot(), COMPLETE_DELAY_MS);
          }, DONE_DELAY_MS);
        }
      }, LINE_INTERVAL_MS);
    }, LOGO_DELAY_MS);

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
      if (lineInterval) clearInterval(lineInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center bg-background">
      <div className="mx-4 w-full max-w-lg">
        <AnimatePresence>
          {phase === "logo" && (
            <motion.div
              key="logo"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-hud-cyan text-3xl font-black text-hud-cyan shadow-[0_0_30px_oklch(0.65_0.18_255/0.15)]">
                G
              </div>
              <h1 className="text-center font-mono text-sm tracking-[0.3em] text-muted-foreground">
                {t.bootup.title}
              </h1>
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
              className="rounded-lg border border-hud-border bg-hud-bg p-5 font-mono text-xs backdrop-blur-xl"
            >
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
