"use client";

import { useEffect, useRef } from "react";

/** Ambient background: static grid + drifting particles.
    The grid is pre-rendered to an offscreen canvas on resize (it never
    moves); only the particles animate, and the loop pauses when the tab is
    hidden or when the user prefers reduced motion (one static frame). */
const PARTICLE_COUNT = 30;

export default function DesktopBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    // Static layer (grid + perspective lines), re-rendered only on
    // resize or theme change. In light mode the grid is fainter so it
    // doesn't read as a dirty vignette on white.
    const staticLayer = document.createElement("canvas");
    const drawStatic = () => {
      staticLayer.width = w;
      staticLayer.height = h;
      const sctx = staticLayer.getContext("2d");
      if (!sctx) return;
      const dark = document.documentElement.classList.contains("dark");
      const gridAlpha = dark ? 0.04 : 0.02;
      const lineAlpha = dark ? 0.06 : 0.03;

      sctx.clearRect(0, 0, w, h);
      sctx.strokeStyle = `oklch(0.65 0.18 255 / ${gridAlpha})`;
      sctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < w; x += gridSize) {
        sctx.beginPath(); sctx.moveTo(x, 0); sctx.lineTo(x, h); sctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        sctx.beginPath(); sctx.moveTo(0, y); sctx.lineTo(w, y); sctx.stroke();
      }

      // Perspective lines
      sctx.strokeStyle = `oklch(0.65 0.18 255 / ${lineAlpha})`;
      const cx = w / 2;
      const cy = h;
      for (let angle = -Math.PI / 3; angle <= Math.PI / 3; angle += Math.PI / 18) {
        sctx.beginPath();
        sctx.moveTo(cx, cy);
        sctx.lineTo(cx + Math.sin(angle) * h * 0.8, cy - Math.cos(angle) * h * 0.8);
        sctx.stroke();
      }
    };
    drawStatic();

    const renderFrame = (move: boolean) => {
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(staticLayer, 0, 0);
      particles.forEach((p) => {
        if (move) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
          if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `oklch(0.65 0.18 255 / ${p.alpha})`;
        ctx.fill();
      });
    };

    let raf = 0;
    let running = false;
    const tick = () => {
      renderFrame(true);
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running || reducedMotion || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    // One static frame immediately (also the reduced-motion frame).
    renderFrame(false);
    start();
    document.addEventListener("visibilitychange", onVisibility);

    const onResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      drawStatic();
      renderFrame(false);
    };
    window.addEventListener("resize", onResize);

    // Re-render the static layer when the theme flips (dark class changes).
    const themeObserver = new MutationObserver((mutations) => {
      if (mutations.some((m) => m.attributeName === "class")) {
        drawStatic();
        renderFrame(false);
      }
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
      themeObserver.disconnect();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 opacity-20"
        style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, oklch(0.65 0.18 255 / 0.03) 2px, oklch(0.65 0.18 255 / 0.03) 4px)" }}
      />
      <div className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 0%, transparent 60%, oklch(0 0 0 / 0.4) 100%)" }}
      />
    </div>
  );
}
