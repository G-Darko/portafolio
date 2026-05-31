"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useHUDStore } from "@/lib/store/useHUDStore";
import { useProgressStore } from "@/lib/store/useProgressStore";
import HUDHeader from "./HUDHeader";
import MissionNavigator from "./MissionNavigator";
import { MissionDetail } from "./MissionDetail";
import GlassWindow from "./GlassWindow";
import dynamic from "next/dynamic";
import TerminalPanel from "./TerminalPanel";

const TechSphere = dynamic(() => import("@/components/three/TechSphere"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-xs opacity-50" style={{ color: "var(--accent)" }}>
      Loading 3D engine...
    </div>
  ),
});

const KnightsSlash = dynamic(() => import("./KnightsSlash"), {
  ssr: false,
});

export default function HUDShell() {
  const { activeWindow, toggleWindow } = useHUDStore();
  const { totalPercent } = useProgressStore();

  return (
    <div className="relative min-h-screen overflow-hidden text-[var(--text)]" style={{ background: "var(--background)" }}>
      {/* Subtle radial glow behind everything */}
      <div
        className="pointer-events-none fixed inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0, rgba(13,130,249,0.08), transparent), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(13,248,249,0.04), transparent)",
        }}
      />

      <HUDHeader />
      <MissionNavigator />

      <main className="relative z-[10] mx-auto max-w-5xl px-4 pt-20">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mb-12"
        >
          <h1
            className="font-mono text-4xl font-black tracking-tighter md:text-6xl"
            style={{
              background: "linear-gradient(135deg, #102631 0%, #35647a 55%, #93d1eb 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            G-DARKO
          </h1>
          <p className="mt-3 max-w-xl text-sm font-light leading-relaxed" style={{ color: "var(--accent)" }}>
            Full-stack engineer specialized in scalable SaaS, mobile ecosystems, and interactive frontend architecture.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Next.js", "React Native", "Expo", "Laravel", "Tailwind", "Three.js"].map((t) => (
              <span
                key={t}
                className="rounded border px-2 py-0.5 text-[10px] tracking-widest"
                style={{
                  borderColor: "var(--glass-border)",
                  color: "var(--accent)",
                  background: "rgba(102,204,255,0.05)",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </motion.section>

        {/* Quick access cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <QuickCard label="CV" desc="View / download resume" href="/cv" />
          <QuickCard label="GitHub" desc="Source code & repos" href="https://github.com/G-Darko" external />
          <QuickCard label="LinkedIn" desc="Professional profile" href="https://linkedin.com" external />
        </div>

        {/* Progress ring */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-10 flex items-center justify-center"
        >
          <ProgressRing percent={totalPercent} />
        </motion.div>
      </main>

      {/* Mission detail modal */}
      <MissionDetail />

      {/* Floating windows */}
      <AnimatePresence>
        {activeWindow === "terminal" && (
          <WindowWrapper onClose={() => toggleWindow(null)} x={-100} y={40}>
            <GlassWindow title="TERMINAL" subtitle="HUD Command Interface" onClose={() => toggleWindow(null)} initialX={-60}>
              <div className="h-[60vh] max-h-[500px]">
                <TerminalPanel />
              </div>
            </GlassWindow>
          </WindowWrapper>
        )}

        {activeWindow === "sphere" && (
          <WindowWrapper onClose={() => toggleWindow(null)} x={0} y={30}>
            <GlassWindow title="STACK 3D" subtitle="Tech Sphere Visualization" onClose={() => toggleWindow(null)}>
              <div className="h-[55vh] max-h-[450px]">
                <TechSphere />
              </div>
            </GlassWindow>
          </WindowWrapper>
        )}

        {activeWindow === "minigame" && (
          <WindowWrapper onClose={() => toggleWindow(null)} x={80} y={50}>
            <GlassWindow title="KNIGHT'S SLASH" subtitle="Timing challenge" onClose={() => toggleWindow(null)} initialX={40}>
              <KnightsSlash />
            </GlassWindow>
          </WindowWrapper>
        )}
      </AnimatePresence>
    </div>
  );
}

function QuickCard({ label, desc, href, external }: { label: string; desc: string; href: string; external?: boolean }) {
  const Tag = external ? "a" : (Link as any);
  return (
    <motion.div whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Tag
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="block rounded-lg border p-4 transition-colors hover:border-[var(--c1)]/30"
        style={{
          borderColor: "var(--glass-border)",
          background: "rgba(102,204,255,0.03)",
        }}
      >
        <h3
          className="text-sm font-bold tracking-widest"
          style={{
            background: "linear-gradient(135deg, #102631 0%, #35647a 55%, #93d1eb 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {label}
        </h3>
        <p className="mt-1 text-[10px] opacity-60" style={{ color: "var(--accent)" }}>
          {desc}
        </p>
      </Tag>
    </motion.div>
  );
}

function WindowWrapper({ children, onClose, x, y }: { children: React.ReactNode; onClose: () => void; x: number; y: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[155] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} className="mx-4 w-full max-w-2xl">
        {children}
      </div>
    </motion.div>
  );
}

function ProgressRing({ percent }: { percent: number }) {
  const r = 40;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;

  return (
    <div className="relative flex h-28 w-28 items-center justify-center">
      <svg width="112" height="112" className="-rotate-90">
        <circle cx="56" cy="56" r={r} fill="none" stroke="rgba(102,204,255,0.08)" strokeWidth="4" />
        <motion.circle
          cx="56"
          cy="56"
          r={r}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth="4"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#66ccff" />
            <stop offset="100%" stopColor="#0df8f9" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <span className="block font-mono text-lg font-bold" style={{ color: "var(--c1)" }}>
          {percent}%
        </span>
        <span className="text-[9px] opacity-50" style={{ color: "var(--accent)" }}>
          COMPLETION
        </span>
      </div>
    </div>
  );
}
