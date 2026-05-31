"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useProgressStore } from "@/lib/store/useProgressStore";
import { useHUDStore } from "@/lib/store/useHUDStore";
import { playQTESuccess, playQTEMiss } from "@/lib/audio/audio";

/**
 * Knight's Slash – God of War style QTE timing bar.
 */
export default function KnightsSlash() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [message, setMessage] = useState("CLICK >> when cursor is inside the red zone");
  const [success, setSuccess] = useState<boolean | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const { soundEnabled } = useHUDStore();
  const { unlockSecret } = useProgressStore();

  // Game state refs (mutable across rAF without re-render)
  const cursor = useRef(0);          // 0 → 1 across the bar
  const dir = useRef(1);             // 1 right, -1 left
  const targetStart = useRef(0.35);  // normalized red zone start
  const targetLen = useRef(0.22);    // normalized red zone width
  const running = useRef(true);
  const speed = useRef(0.014);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Scale for hi-DPI
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    running.current = true;
    let raf = 0;

    const draw = () => {
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      // Background bar
      ctx.fillStyle = "rgba(102,204,255,0.08)";
      ctx.fillRect(0, h * 0.45, w, h * 0.1);

      // Target (red) zone
      const ts = targetStart.current * w;
      const tw = targetLen.current * w;
      ctx.fillStyle = "rgba(239, 68, 68, 0.6)";
      ctx.fillRect(ts, h * 0.42, tw, h * 0.16);
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.strokeRect(ts + 1, h * 0.42 + 1, tw - 2, h * 0.16 - 2);

      // Cursor arrow
      const cx = cursor.current * w;
      ctx.fillStyle = "#0df8f9";
      ctx.beginPath();
      ctx.moveTo(cx, h * 0.35);
      ctx.lineTo(cx - 8, h * 0.55);
      ctx.lineTo(cx + 8, h * 0.55);
      ctx.closePath();
      ctx.fill();

      // Cursor glow
      ctx.shadowColor = "#0df8f9";
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Border brackets
      ctx.strokeStyle = "rgba(102,204,255,0.3)";
      ctx.lineWidth = 2;
      const bh = h * 0.3;
      ctx.beginPath(); ctx.moveTo(0, bh); ctx.lineTo(0, bh + h * 0.2); ctx.lineTo(10, bh + h * 0.2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w, bh); ctx.lineTo(w, bh + h * 0.2); ctx.lineTo(w - 10, bh + h * 0.2); ctx.stroke();

      if (running.current) {
        cursor.current += speed.current * dir.current;
        if (cursor.current >= 1) { cursor.current = 1; dir.current = -1; }
        if (cursor.current <= 0) { cursor.current = 0; dir.current = 1; }
      }

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleSlash = () => {
    if (!running.current || gameOver) return;
    running.current = false;
    const c = cursor.current;
    const inside = c >= targetStart.current && c <= targetStart.current + targetLen.current;

    if (inside) {
      setSuccess(true);
      setMessage("PERFECT SLASH! Secret unlocked.");
      if (soundEnabled) playQTESuccess();
      unlockSecret("knights-slash");
    } else {
      setSuccess(false);
      setMessage("Missed... Try again.");
      if (soundEnabled) playQTEMiss();
      setTimeout(() => {
        cursor.current = 0;
        dir.current = 1;
        speed.current = 0.016;
        targetStart.current = 0.3 + Math.random() * 0.4;
        targetLen.current = 0.18 + Math.random() * 0.1;
        running.current = true;
        setSuccess(null);
        setMessage("CLICK >> when cursor is inside the red zone");
      }, 1000);
    }
    setGameOver(true);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <canvas
        ref={canvasRef}
        className="w-full rounded-lg border"
        style={{
          height: 120,
          borderColor: "var(--glass-border)",
          background: "rgba(8,12,18,0.6)",
          cursor: "pointer",
        }}
        onClick={handleSlash}
      />
      <p
        className="text-center text-xs font-mono"
        style={{
          color:
            success === true
              ? "var(--hud-green)"
              : success === false
                ? "var(--hud-red)"
                : "var(--accent)",
        }}
      >
        {message}
      </p>

      {gameOver && success && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded border px-3 py-1.5 text-center text-[10px] font-bold tracking-widest"
          style={{
            color: "var(--hud-green)",
            borderColor: "rgba(0,255,113,0.2)",
            background: "rgba(0,255,113,0.05)",
          }}
        >
          LOGRO DESBLOQUEADO
        </motion.div>
      )}
    </div>
  );
}
