"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useHUDStore } from "@/lib/store/useHUDStore";
import { playBootupChime } from "@/lib/audio/audio";

export default function BootupSequence() {
  const [phase, setPhase] = useState<"idle" | "typing" | "done">("idle");
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [showButton, setShowButton] = useState(false);
  const { t } = useTranslation();
  const { soundEnabled, setBootupDone } = useHUDStore();

  useEffect(() => {
    const t = setTimeout(() => setShowButton(true), 600);
    return () => clearTimeout(t);
  }, []);

  const start = () => {
    setShowButton(false);
    setPhase("typing");
    if (soundEnabled) playBootupChime();

    const lines = [
      t.bootup.initializing,
      t.bootup.loading,
      t.bootup.mounting,
      t.bootup.allocating,
      t.bootup.neural,
      t.bootup.granted,
    ];

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleLines(i);
      if (i >= lines.length) {
        clearInterval(interval);
        setTimeout(() => {
          setPhase("done");
          setTimeout(() => setBootupDone(true), 400);
        }, 400);
      }
    }, 350);
  };

  const lines = [
    t.bootup.initializing,
    t.bootup.loading,
    t.bootup.mounting,
    t.bootup.allocating,
    t.bootup.neural,
    t.bootup.granted,
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background">
      <div className="mx-4 w-full max-w-lg">
        <AnimatePresence>
          {phase === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-hud-cyan text-3xl font-black text-hud-cyan shadow-[0_0_30px_oklch(0.65_0.18_255/0.15)]"
              >
                G
              </div>
              <h1 className="text-center font-mono text-sm tracking-[0.3em] text-muted-foreground">
                {t.bootup.title}
              </h1>
              {showButton && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={start}
                  className="rounded border border-hud-cyan px-6 py-2 font-mono text-xs font-bold tracking-widest text-hud-cyan transition-colors hover:bg-hud-cyan/10"
                >
                  {t.bootup.start}
                </motion.button>
              )}
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
                  <span className={
                    line === t.bootup.granted ? "text-hud-green" :
                    line === t.bootup.neural ? "text-hud-cyan" :
                    "text-muted-foreground"
                  }>
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
