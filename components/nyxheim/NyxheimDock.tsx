"use client";

import { useCallback, useRef } from "react";
import { motion } from "motion/react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { getSubMissionCopy } from "@/lib/i18n/missionContent";
import { DOCK_BODIES, getBodyProject, type NyxheimBody } from "@/lib/nyxheim/bodies";
import { useNyxheimStore } from "@/lib/nyxheim/useNyxheimStore";

function useDockLabel(body: NyxheimBody): string {
  const { t, locale } = useTranslation();
  if (body.projectSlug && body.missionId) {
    const project = getBodyProject(body);
    if (project) return getSubMissionCopy(locale, project).title;
  }
  if (body.kind === "certs") return t.header.certifications;
  if (body.kind === "cv") return "CV";
  if (body.kind === "contact") return t.header.contact;
  if (body.kind === "constellation") return t.nyxheim.sinistra;
  if (body.labelKey === "sun") return t.nyxheim.sun;
  if (body.labelKey === "base") return t.nyxheim.base;
  return body.id;
}

function DockItem({ body }: { body: NyxheimBody }) {
  const label = useDockLabel(body);
  const focusedId = useNyxheimStore((s) => s.focusedId);
  const focus = useNyxheimStore((s) => s.focus);
  const setHovered = useNyxheimStore((s) => s.setHovered);
  const focused = focusedId === body.id || (body.id === "sol" && focusedId === null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const onClick = () => {
    focus(body.id);
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      data-dock-item={body.id}
      onClick={onClick}
      onPointerEnter={() => setHovered(body.id)}
      onPointerLeave={() => setHovered(null)}
      aria-label={label}
      aria-current={focused ? true : undefined}
      className="hud-focus-ring group relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border backdrop-blur-md transition-colors will-change-transform md:h-12 md:w-12"
      style={{
        borderColor: focused ? body.color : "oklch(0.65 0.18 255 / 0.25)",
        backgroundColor: focused ? `${body.color}33` : "oklch(0.08 0.02 240 / 0.7)",
        boxShadow: focused ? `0 0 18px ${body.color}66` : undefined,
      }}
    >
      {/* Shared element: this chip morphs into the detail panel header. */}
      <motion.span
        layoutId={`nyx-chip-${body.id}`}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="flex h-7 w-7 items-center justify-center rounded-full font-mono text-xs font-bold md:h-8 md:w-8"
        style={{ backgroundColor: `${body.color}22`, color: body.color }}
      >
        {label.charAt(0)}
      </motion.span>
      <span
        aria-hidden
        className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-full border border-hud-border/70 bg-hud-bg/95 px-2 py-0.5 font-mono text-xs whitespace-nowrap text-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        {label}
      </span>
      {focused && (
        <span
          aria-hidden
          className="absolute -bottom-1.5 h-1 w-1 rounded-full"
          style={{ backgroundColor: body.color }}
        />
      )}
    </button>
  );
}

/**
 * macOS-style magnification dock. The scale is applied directly to the DOM
 * (no React re-render per mousemove); it only runs with a fine pointer and
 * without reduced motion.
 */
export function NyxheimDock({ reduced }: { reduced: boolean }) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (reduced) return;
      if (typeof window !== "undefined" && !window.matchMedia("(pointer: fine)").matches) return;
      const container = containerRef.current;
      if (!container) return;
      const items = container.querySelectorAll<HTMLElement>("[data-dock-item]");
      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const center = rect.left + rect.width / 2;
        const dist = Math.abs(e.clientX - center);
        const scale = 1 + 0.5 * Math.max(0, 1 - dist / 110);
        item.style.transform = `scale(${scale.toFixed(3)}) translateY(${((scale - 1) * -14).toFixed(1)}px)`;
      });
    },
    [reduced]
  );

  const resetMagnification = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    container
      .querySelectorAll<HTMLElement>("[data-dock-item]")
      .forEach((item) => {
        item.style.transform = "";
      });
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetMagnification}
      role="navigation"
      aria-label={t.nyxheim.destinations}
      className="flex items-end gap-1.5 overflow-x-auto rounded-2xl border border-hud-border/60 bg-hud-bg/60 px-2 py-2 shadow-[0_0_30px_oklch(0.65_0.18_255/0.15)] backdrop-blur-xl md:gap-2 md:px-3"
      style={{ scrollbarWidth: "none" }}
    >
      {DOCK_BODIES.map((body) => (
        <DockItem key={body.id} body={body} />
      ))}
    </div>
  );
}
