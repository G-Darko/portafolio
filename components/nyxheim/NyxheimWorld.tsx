"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { AnimatePresence, motion } from "motion/react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { DOCK_BODIES, NYXHEIM_STATS } from "@/lib/nyxheim/bodies";
import { useNyxheimStore, usePrefersReducedMotion } from "@/lib/nyxheim/useNyxheimStore";
import { NyxheimScene } from "./NyxheimScene";
import { NyxheimDock } from "./NyxheimDock";
import { NyxheimDetailPanel } from "./NyxheimDetailPanel";
import { getNyxheimBody } from "@/lib/nyxheim/bodies";
import HudStatusDot from "@/components/hud/HudStatusDot";

function OverviewCard() {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-auto max-w-xs rounded-xl border border-hud-border/60 bg-hud-bg/60 p-4 backdrop-blur-xl md:max-w-sm md:p-5"
    >
      <p className="flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-hud-green uppercase">
        <HudStatusDot color="green" />
        {t.bootup.granted}
      </p>
      <h2 className="mt-2 font-mono text-2xl font-bold tracking-[0.18em] text-foreground md:text-3xl">
        {t.nyxheim.systemName}
      </h2>
      <p className="mt-1 font-mono text-sm text-hud-cyan">{t.nyxheim.systemSubtitle}</p>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground">{t.bootup.welcomeLead}</p>
      <p className="mt-2 font-mono text-xs text-muted-foreground md:text-sm">
        {t.nyxheim.location} — {t.nyxheim.coordinates}
      </p>
      <p className="mt-3 hidden font-mono text-xs text-muted-foreground md:block">
        {t.nyxheim.hintDrag} — {t.nyxheim.hintZoom}
      </p>
      <p className="mt-1 font-mono text-xs text-muted-foreground md:hidden">
        {t.nyxheim.focusHint}
      </p>
      <div className="mt-3 flex gap-4 font-mono text-xs text-muted-foreground md:text-sm">
        <span>
          <strong className="text-hud-cyan">{NYXHEIM_STATS.projects}</strong> {t.nyxheim.projects}
        </span>
        <span>
          <strong className="text-hud-cyan">{NYXHEIM_STATS.skills}</strong> {t.nyxheim.technologies}
        </span>
        <span>
          <strong className="text-hud-cyan">{NYXHEIM_STATS.certifications}</strong> {t.nyxheim.certs}
        </span>
      </div>
    </motion.div>
  );
}

export default function NyxheimWorld() {
  const reduced = usePrefersReducedMotion();
  const focusedId = useNyxheimStore((s) => s.focusedId);
  const focus = useNyxheimStore((s) => s.focus);
  const goOverview = useNyxheimStore((s) => s.goOverview);
  const { t } = useTranslation();
  const wrapperRef = useRef<HTMLDivElement>(null);
  // Pause the WebGL loop when the tab is hidden or the world is offscreen,
  // same pattern as TechSphere.
  const [frameloop, setFrameloop] = useState<"always" | "never">("always");

  useEffect(() => {
    const update = () => {
      const offscreen = wrapperRef.current
        ? !wrapperRef.current.getBoundingClientRect().width
        : false;
      setFrameloop(document.hidden || offscreen ? "never" : "always");
    };
    update();
    const onVisibility = () => update();
    document.addEventListener("visibilitychange", onVisibility);
    const observer = new IntersectionObserver(
      ([entry]) => setFrameloop(document.hidden || !entry.isIntersecting ? "never" : "always"),
      { threshold: 0 }
    );
    if (wrapperRef.current) observer.observe(wrapperRef.current);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      observer.disconnect();
    };
  }, []);

  // Keyboard travel: arrows cycle the dock, Esc returns to the overview.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (focusedId) goOverview();
        return;
      }
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const dir = e.key === "ArrowRight" ? 1 : -1;
      const current = focusedId ? DOCK_BODIES.findIndex((b) => b.id === focusedId) : -1;
      const next =
        DOCK_BODIES[(current + dir + DOCK_BODIES.length) % DOCK_BODIES.length];
      if (next) focus(next.id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focusedId, focus, goOverview]);

  const focusedBody = focusedId ? getNyxheimBody(focusedId) : undefined;

  return (
    <div ref={wrapperRef} className="absolute inset-0 overflow-hidden bg-[#05070d]">
      <Canvas
        camera={{ position: [0, 9, 34], fov: 50, near: 0.1, far: 400 }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
        frameloop={frameloop}
        className="touch-none"
      >
        <NyxheimScene reduced={reduced} />
      </Canvas>

      {/* HTML overlay: overview card, dock, detail panel. */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute top-[4.25rem] left-3 md:top-16 md:left-6">
          <AnimatePresence>
            {!focusedBody && <OverviewCard key="overview" />}
          </AnimatePresence>
        </div>

        <p className="absolute right-3 bottom-24 hidden font-mono text-xs text-muted-foreground md:right-6 md:bottom-8 md:block">
          {t.nyxheim.hintKeys}
        </p>

        <div
          className={`absolute bottom-[4.75rem] left-1/2 z-40 -translate-x-1/2 md:bottom-6 ${
            focusedBody ? "max-md:hidden" : ""
          }`}
        >
          <div className="pointer-events-auto">
            <NyxheimDock reduced={reduced} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {focusedBody && <NyxheimDetailPanel key={focusedBody.id} body={focusedBody} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
