"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useHUDStore } from "@/lib/store/useHUDStore";
import { playBootupChime } from "@/lib/audio/audio";

const BOOT_LINES = [
  "Initializing HUD kernel...",
  "Loading subsystems...",
  "Mounting mission modules...",
  "Allocating render buffers...",
  "Establishing neural link...",
  "Access granted.",
];

export default function BootupSequence() {
  const [phase, setPhase] = useState<"idle" | "typing" | "done">("idle");
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [showButton, setShowButton] = useState(false);
  const { soundEnabled, setBootupDone } = useHUDStore();

  useEffect(() => {
    // Show "Iniciar Sistema" button after a tiny delay
    const t = setTimeout(() => setShowButton(true), 600);
    return () => clearTimeout(t);
  }, []);

  const start = () => {
    setShowButton(false);
    setPhase("typing");
    if (soundEnabled) playBootupChime();

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleLines(i);
      if (i >= BOOT_LINES.length) {
        clearInterval(interval);
        setTimeout(() => {
          setPhase("done");
          setTimeout(() => setBootupDone(true), 400);
        }, 400);
      }
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ background: "var(--background)" }}>
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
              <div
                className="flex h-20 w-20 items-center justify-center rounded-full text-3xl font-black"
                style={{
                  border: "2px solid var(--c1)",
                  color: "var(--c1)",
                  boxShadow: "0 0 30px rgba(13,248,249,0.15)",
                }}
              >
                G
              </div>
              <h1
                className="text-center font-mono text-sm tracking-[0.3em] text-[var(--accent)]"
              >
                G-DARKO OS
              </h1>
              {showButton && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={start}
                  className="rounded border px-6 py-2 font-mono text-xs font-bold tracking-widest transition-colors hover:bg-accent/5"
                  style={{ borderColor: "var(--c1)", color: "var(--c1)" }}
                >
                  INICIAR SISTEMA
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
              className="rounded-lg border p-5 font-mono text-xs"
              style={{
                borderColor: "var(--glass-border)",
                background: "rgba(8,12,18,0.8)",
              }}
            >
              {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mb-1"
                  style={{
                    color:
                      line.startsWith("Access")
                        ? "var(--hud-green)"
                        : line.startsWith("Establishing")
                        ? "var(--c1)"
                        : "var(--accent)",
                  }}
                >
                  {line.startsWith("Access") && "✔ "}
                  {line}
                </motion.div>
              ))}
              {phase === "typing" && (
                <span className="inline-block h-3 w-1.5 animate-pulse bg-[var(--c1)]" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
