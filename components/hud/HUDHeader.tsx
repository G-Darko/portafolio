"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useHUDStore } from "@/lib/store/useHUDStore";
import { useProgressStore } from "@/lib/store/useProgressStore";
import { playHUDClick, playWindowOpen } from "@/lib/audio/audio";
import { useCallback } from "react";

export default function HUDHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { activeWindow, toggleWindow, soundEnabled } = useHUDStore();
  const { totalPercent, secretsFound } = useProgressStore();

  const toggle = useCallback(
    (w: "terminal" | "minigame" | "sphere") => {
      if (soundEnabled) {
        if (activeWindow === w) playHUDClick();
        else playWindowOpen();
      }
      toggleWindow(activeWindow === w ? null : w);
      setMobileOpen(false);
    },
    [activeWindow, soundEnabled, toggleWindow]
  );

  return (
    <>
      <motion.header
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="fixed left-0 right-0 top-0 z-[150] flex items-center justify-between border-b px-4 py-2 backdrop-blur-lg md:px-6"
        style={{
          borderColor: "var(--glass-border)",
          background: "rgba(8, 12, 18, 0.7)",
        }}
      >
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div
            data-hud-logo
            className="flex h-7 w-7 select-none items-center justify-center rounded font-mono text-xs font-bold"
            style={{
              background: "var(--card)",
              border: "1px solid var(--glass-border)",
              color: "var(--c1)",
              cursor: "pointer",
            }}
          >
            G
          </div>
          <div className="hidden sm:block">
            <h1 className="font-mono text-xs font-bold tracking-widest" style={{ color: "var(--text)" }}>
              G-DARKO
            </h1>
            <p className="font-mono text-[10px] opacity-50" style={{ color: "var(--accent)" }}>
              HUD SYSTEM v3.0
            </p>
          </div>

          {/* Desktop quick buttons */}
          <div className="ml-4 hidden items-center gap-1 md:flex">
            {(
              [
                { w: "terminal", label: ">_", tooltip: "Terminal" } as const,
                { w: "sphere", label: "⊙", tooltip: "Stack 3D" } as const,
                { w: "minigame", label: "⚔", tooltip: "Knight's Slash" } as const,
              ]
            ).map(({ w, label, tooltip }) => (
              <button
                key={w}
                onClick={() => toggle(w)}
                title={tooltip}
                className="rounded px-2.5 py-1 font-mono text-xs transition-colors hover:bg-accent/10"
                style={{
                  border: `1px solid ${activeWindow === w ? "var(--c1)" : "transparent"}`,
                  color: activeWindow === w ? "var(--c1)" : "var(--accent)",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex h-8 w-8 flex-col items-center justify-center gap-1 md:hidden"
          onClick={() => setMobileOpen((p) => !p)}
          aria-label="Menu"
        >
          <span className={`block h-0.5 w-5 transition-transform ${mobileOpen ? "translate-y-[3px] rotate-45" : ""}`} style={{ background: "var(--accent)" }} />
          <span className={`block h-0.5 w-5 transition-opacity ${mobileOpen ? "opacity-0" : "opacity-100"}`} style={{ background: "var(--accent)" }} />
          <span className={`block h-0.5 w-5 transition-transform ${mobileOpen ? "-translate-y-[3px] -rotate-45" : ""}`} style={{ background: "var(--accent)" }} />
        </button>

        {/* Progress */}
        <div className="hidden items-center gap-3 sm:flex">
          <div className="hidden items-center gap-2 sm:flex">
            <span className="font-mono text-[10px]" style={{ color: "var(--c1)" }}>
              {totalPercent}
            </span>
            <div className="h-1.5 w-20 overflow-hidden rounded-full" style={{ background: "var(--complement)" }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${totalPercent}%`,
                  background: "linear-gradient(90deg, var(--c1), var(--c2))",
                }}
              />
            </div>
          </div>
          <span
            className="font-mono text-[10px]"
            style={{ color: secretsFound.length > 0 ? "var(--hud-green)" : "var(--accent)" }}
          >
            {secretsFound.length > 0 ? `${secretsFound.length}/4 secrets` : "0%"}
          </span>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed left-0 right-0 top-12 z-[149] border-b p-4 md:hidden"
            style={{
              background: "rgba(8,12,18,0.95)",
              borderColor: "var(--glass-border)",
              backdropFilter: "blur(16px)",
            }}
          >
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { w: "terminal", label: "Terminal", icon: ">_" } as const,
                  { w: "sphere", label: "Stack 3D", icon: "⊙" } as const,
                  { w: "minigame", label: "Knight's Slash", icon: "⚔" } as const,
                ]
              ).map(({ w, label, icon }) => (
                <button
                  key={w}
                  onClick={() => toggle(w)}
                  className="flex items-center gap-2 rounded border px-3 py-2 text-left text-xs font-mono transition-colors hover:bg-accent/10"
                  style={{
                    borderColor: activeWindow === w ? "var(--c1)" : "var(--glass-border)",
                    color: activeWindow === w ? "var(--c1)" : "var(--accent)",
                  }}
                >
                  <span className="text-sm">{icon}</span>
                  {label}
                </button>
              ))}
              <Link
                href="/cv"
                className="flex items-center gap-2 rounded border px-3 py-2 text-left text-xs font-mono transition-colors hover:bg-accent/10"
                style={{ borderColor: "var(--glass-border)", color: "var(--accent)" }}
                onClick={() => setMobileOpen(false)}
              >
                <span className="text-sm">📄</span>
                CV
              </Link>
              <a
                href="https://github.com/G-Darko"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded border px-3 py-2 text-left text-xs font-mono transition-colors hover:bg-accent/10"
                style={{ borderColor: "var(--glass-border)", color: "var(--accent)" }}
                onClick={() => setMobileOpen(false)}
              >
                <span className="text-sm">🐙</span>
                GitHub
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
