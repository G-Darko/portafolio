/**
 * Procedural planet textures, drawn on canvas at runtime. No new image
 * assets: each body reads as its project (Skool = ruled notebook paper,
 * KRKN = stacked containers, Duplica = teal seas, CRESER = green fields).
 */
import * as THREE from "three";
import type { PlanetTextureKind } from "./bodies";

function makeTexture(
  w: number,
  h: number,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Nyxheim: canvas 2d unavailable");
  draw(ctx, w, h);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  return tex;
}

function blotches(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  colors: string[],
  count: number,
  minR: number,
  maxR: number,
  alpha: number
) {
  for (let i = 0; i < count; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const r = minR + Math.random() * (maxR - minR);
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    const c = colors[Math.floor(Math.random() * colors.length)];
    g.addColorStop(0, c);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.globalAlpha = alpha;
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function speckle(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  color: string,
  count: number,
  maxR: number
) {
  ctx.fillStyle = color;
  for (let i = 0; i < count; i++) {
    ctx.globalAlpha = 0.15 + Math.random() * 0.4;
    ctx.beginPath();
    ctx.arc(Math.random() * w, Math.random() * h, 1 + Math.random() * maxR, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

const DRAWERS: Record<PlanetTextureKind, (ctx: CanvasRenderingContext2D, w: number, h: number) => void> = {
  sun: (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#ffd166");
    g.addColorStop(0.5, "#ff9f1c");
    g.addColorStop(1, "#f4842b");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    blotches(ctx, w, h, ["#ffe8a3", "#ffca3a", "#ff7b00"], 40, 20, 90, 0.5);
    speckle(ctx, w, h, "#fff3c4", 300, 3);
  },
  duplica: (ctx, w, h) => {
    ctx.fillStyle = "#0f766e";
    ctx.fillRect(0, 0, w, h);
    blotches(ctx, w, h, ["#14b8a6", "#2dd4bf", "#0d9488", "#5eead4"], 46, 30, 120, 0.55);
    // Sea lanes
    ctx.strokeStyle = "rgba(204, 251, 241, 0.35)";
    ctx.lineWidth = 3;
    for (let i = 0; i < 7; i++) {
      ctx.beginPath();
      const y = (i / 7) * h + 20;
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(w * 0.3, y - 40, w * 0.6, y + 40, w, y - 10);
      ctx.stroke();
    }
  },
  creser: (ctx, w, h) => {
    ctx.fillStyle = "#15803d";
    ctx.fillRect(0, 0, w, h);
    blotches(ctx, w, h, ["#22c55e", "#4ade80", "#166534", "#86efac"], 36, 24, 100, 0.5);
    speckle(ctx, w, h, "#dcfce7", 200, 3);
  },
  notebook: (ctx, w, h) => {
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, w, h);
    // Ruled lines
    ctx.strokeStyle = "rgba(59, 130, 246, 0.55)";
    ctx.lineWidth = 2;
    for (let y = 28; y < h; y += 28) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    // Red margin
    ctx.strokeStyle = "rgba(239, 68, 68, 0.7)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(w * 0.16, 0);
    ctx.lineTo(w * 0.16, h);
    ctx.stroke();
    speckle(ctx, w, h, "#cbd5e1", 120, 2);
  },
  containers: (ctx, w, h) => {
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, w, h);
    const palette = ["#f97316", "#eab308", "#38bdf8", "#94a3b8", "#ef4444", "#22c55e"];
    const cols = 8;
    const rows = 6;
    const cw = w / cols;
    const ch = h / rows;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const color = palette[(r * cols + c + ((r + c) % 3)) % palette.length];
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.75 + Math.random() * 0.25;
        ctx.fillRect(c * cw + 2, r * ch + 2, cw - 4, ch - 4);
        // Container ribs
        ctx.strokeStyle = "rgba(0,0,0,0.35)";
        ctx.lineWidth = 1;
        for (let k = 1; k < 4; k++) {
          ctx.beginPath();
          ctx.moveTo(c * cw + (cw / 4) * k, r * ch + 3);
          ctx.lineTo(c * cw + (cw / 4) * k, (r + 1) * ch - 3);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
  },
  aerial: (ctx, w, h) => {
    ctx.fillStyle = "#b45309";
    ctx.fillRect(0, 0, w, h);
    blotches(ctx, w, h, ["#d97706", "#f59e0b", "#92400e"], 30, 30, 110, 0.5);
    // Rack aisles
    ctx.strokeStyle = "rgba(255, 251, 235, 0.5)";
    ctx.lineWidth = 4;
    for (let x = 0; x < w; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    speckle(ctx, w, h, "#fef3c7", 160, 3);
  },
  yiza: (ctx, w, h) => {
    ctx.fillStyle = "#4d7c0f";
    ctx.fillRect(0, 0, w, h);
    blotches(ctx, w, h, ["#65a30d", "#84cc16", "#365314", "#a3e635"], 34, 26, 100, 0.5);
    // Shelf rows
    ctx.strokeStyle = "rgba(247, 254, 231, 0.4)";
    ctx.lineWidth = 2;
    for (let y = 20; y < h; y += 42) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  },
  rock: (ctx, w, h) => {
    ctx.fillStyle = "#57534e";
    ctx.fillRect(0, 0, w, h);
    blotches(ctx, w, h, ["#78716c", "#44403c", "#a8a29e"], 40, 20, 90, 0.5);
    speckle(ctx, w, h, "#d6d3d1", 320, 3);
  },
  paper: (ctx, w, h) => {
    ctx.fillStyle = "#f1f5f9";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(100, 116, 139, 0.4)";
    ctx.lineWidth = 2;
    for (let y = 24; y < h; y += 24) {
      ctx.beginPath();
      ctx.moveTo(w * 0.2, y);
      ctx.lineTo(w * 0.9, y);
      ctx.stroke();
    }
    speckle(ctx, w, h, "#94a3b8", 100, 2);
  },
  metal: (ctx, w, h) => {
    ctx.fillStyle = "#334155";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(148, 163, 184, 0.5)";
    ctx.lineWidth = 2;
    for (let x = 0; x < w; x += 86) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 86) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    speckle(ctx, w, h, "#e2e8f0", 140, 2);
  },
};

/** Memoize per kind: textures are shared by every body of that kind. */
const cache = new Map<PlanetTextureKind, THREE.CanvasTexture>();

export function getPlanetTexture(kind: PlanetTextureKind): THREE.CanvasTexture {
  const cached = cache.get(kind);
  if (cached) return cached;
  const tex = makeTexture(512, 256, DRAWERS[kind]);
  cache.set(kind, tex);
  return tex;
}
