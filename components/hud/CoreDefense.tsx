"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useProgressStore } from "@/lib/store/useProgressStore";
import { useHUDStore } from "@/lib/store/useHUDStore";
import { playQTESuccess, playQTEMiss, playWindowOpen } from "@/lib/audio/audio";
import { Shield } from "lucide-react";

interface Drone {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hp: number;
  angle: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export default function CoreDefense() {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<"menu" | "playing" | "gameover" | "victory">("menu");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const { soundEnabled } = useHUDStore();
  const { unlockSecret } = useProgressStore();

  const dronesRef = useRef<Drone[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const levelRef = useRef(1);
  const runningRef = useRef(false);
  const rafRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const lastSpawnRef = useRef(0);

  const startGame = useCallback(() => {
    dronesRef.current = [];
    particlesRef.current = [];
    scoreRef.current = 0;
    livesRef.current = 3;
    levelRef.current = 1;
    setScore(0);
    setLives(3);
    setLevel(1);
    setGameState("playing");
    runningRef.current = true;
    lastSpawnRef.current = 0;
    if (soundEnabled) playWindowOpen();
  }, [soundEnabled]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || gameState !== "playing") return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const reactorRadius = 30;

    const spawnDrone = () => {
      const side = Math.floor(Math.random() * 4);
      let x = 0;
      let y = 0;
      switch (side) {
        case 0:
          x = Math.random() * rect.width;
          y = -20;
          break;
        case 1:
          x = rect.width + 20;
          y = Math.random() * rect.height;
          break;
        case 2:
          x = Math.random() * rect.width;
          y = rect.height + 20;
          break;
        case 3:
          x = -20;
          y = Math.random() * rect.height;
          break;
      }
      const dx = cx - x;
      const dy = cy - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const speed = 0.5 + levelRef.current * 0.15;
      dronesRef.current.push({
        x,
        y,
        vx: (dx / dist) * speed,
        vy: (dy / dist) * speed,
        size: 6 + Math.random() * 4,
        hp: 1,
        angle: Math.atan2(dy, dx),
      });
    };

    const createExplosion = (x: number, y: number) => {
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8 + Math.random() * 0.5;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * (2 + Math.random() * 3),
          vy: Math.sin(angle) * (2 + Math.random() * 3),
          life: 30,
          maxLife: 30,
        });
      }
    };

    const drawReactor = () => {
      ctx.beginPath();
      ctx.arc(cx, cy, reactorRadius + 8, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(102, 204, 255, 0.3)";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, reactorRadius, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, reactorRadius);
      gradient.addColorStop(0, "rgba(13, 248, 249, 0.6)");
      gradient.addColorStop(0.5, "rgba(102, 204, 255, 0.3)");
      gradient.addColorStop(1, "rgba(102, 204, 255, 0.05)");
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.strokeStyle = "rgba(13, 248, 249, 0.5)";
      ctx.lineWidth = 1;
      ctx.stroke();

      const pulse = Math.sin(Date.now() / 200) * 4;
      ctx.beginPath();
      ctx.arc(cx, cy, reactorRadius + 8 + pulse, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(13, 248, 249, 0.15)";
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const drawDrone = (drone: Drone) => {
      ctx.save();
      ctx.translate(drone.x, drone.y);
      ctx.rotate(drone.angle);
      ctx.beginPath();
      ctx.moveTo(drone.size * 1.5, 0);
      ctx.lineTo(-drone.size, -drone.size * 0.6);
      ctx.lineTo(-drone.size * 0.5, 0);
      ctx.lineTo(-drone.size, drone.size * 0.6);
      ctx.closePath();
      ctx.fillStyle = "rgba(255, 82, 82, 0.8)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 82, 82, 1)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, drone.size * 2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 82, 82, 0.1)";
      ctx.fill();
      ctx.restore();
    };

    const drawParticle = (p: Particle) => {
      const alpha = p.life / p.maxLife;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2 * alpha, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(13, 248, 249, ${alpha})`;
      ctx.fill();
    };

    const drawCrosshair = () => {
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      ctx.beginPath();
      ctx.arc(mx, my, 10, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(13, 248, 249, 0.5)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(mx - 15, my);
      ctx.lineTo(mx + 15, my);
      ctx.moveTo(mx, my - 15);
      ctx.lineTo(mx, my + 15);
      ctx.strokeStyle = "rgba(13, 248, 249, 0.3)";
      ctx.stroke();
    };

    const gameLoop = (time: number) => {
      if (!runningRef.current) return;

      ctx.clearRect(0, 0, rect.width, rect.height);
      drawReactor();
      drawCrosshair();

      const spawnRate = Math.max(800, 2500 - levelRef.current * 200);
      if (time - lastSpawnRef.current > spawnRate) {
        spawnDrone();
        lastSpawnRef.current = time;
      }

      dronesRef.current = dronesRef.current.filter((drone) => {
        drone.x += drone.vx;
        drone.y += drone.vy;

        const dx = drone.x - cx;
        const dy = drone.y - cy;
        const distToReactor = Math.sqrt(dx * dx + dy * dy);

        if (distToReactor < reactorRadius + drone.size) {
          livesRef.current--;
          setLives(livesRef.current);
          createExplosion(drone.x, drone.y);
          if (soundEnabled) playQTEMiss();

          if (livesRef.current <= 0) {
            runningRef.current = false;
            setGameState("gameover");
          }
          return false;
        }

        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;
        const dClick = Math.sqrt((drone.x - mx) ** 2 + (drone.y - my) ** 2);
        if (dClick < drone.size * 3 && drone.hp > 0) {
          drone.hp--;
          if (drone.hp <= 0) {
            scoreRef.current += 10 * levelRef.current;
            setScore(scoreRef.current);
            createExplosion(drone.x, drone.y);
            if (soundEnabled) playQTESuccess();

            if (scoreRef.current > 0 && scoreRef.current % 100 === 0) {
              levelRef.current++;
              setLevel(levelRef.current);
            }

            if (scoreRef.current >= 200) {
              runningRef.current = false;
              setGameState("victory");
              unlockSecret("core-defense");
            }
            return false;
          }
        }

        drawDrone(drone);
        return true;
      });

      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.95;
        p.vy *= 0.95;
        p.life--;
        if (p.life > 0) {
          drawParticle(p);
          return true;
        }
        return false;
      });

      rafRef.current = requestAnimationFrame(gameLoop);
    };

    rafRef.current = requestAnimationFrame(gameLoop);

    const handleMouseMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const handleClick = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleClick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleClick);
    };
  }, [gameState, soundEnabled, unlockSecret]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-full">
        {gameState === "menu" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="text-center">
              <Shield size={44} className="mx-auto mb-2 text-hud-cyan" />
              <h3 className="font-mono text-base font-bold text-hud-cyan md:text-lg">
                {t.minigame.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.minigame.subtitle}</p>
            </div>
            <p className="max-w-xs text-center text-sm leading-relaxed text-muted-foreground">
              {t.minigame.instructions}
            </p>
            <button
              onClick={startGame}
              className="rounded border border-hud-cyan px-6 py-2.5 font-mono text-sm font-bold tracking-widest text-hud-cyan transition-colors hover:bg-hud-cyan/10"
            >
              {t.minigame.start}
            </button>
          </div>
        )}

        {gameState === "playing" && (
          <>
            <div className="mb-2 flex items-center justify-between font-mono text-sm">
              <span className="text-hud-red">❤ {lives}</span>
              <span className="text-hud-cyan">
                {t.minigame.score}: {score}
              </span>
              <span className="text-muted-foreground">
                {t.minigame.level} {level}
              </span>
            </div>
            <canvas
              ref={canvasRef}
              className="h-[280px] w-full cursor-crosshair rounded-lg border border-hud-border bg-hud-bg/60"
            />
          </>
        )}

        <AnimatePresence>
          {gameState === "gameover" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 py-4"
            >
              <h3 className="font-mono text-base font-bold text-hud-red">{t.minigame.gameOver}</h3>
              <p className="text-sm text-muted-foreground">
                {t.minigame.score}: {score}
              </p>
              <button
                onClick={startGame}
                className="rounded border border-hud-cyan px-4 py-2 text-sm font-bold tracking-widest text-hud-cyan transition-colors hover:bg-hud-cyan/10"
              >
                {t.minigame.retry}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {gameState === "victory" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 py-4"
            >
              <h3 className="font-mono text-base font-bold text-hud-green">{t.minigame.victory}</h3>
              <div className="rounded border border-hud-green/30 bg-hud-green/5 px-3 py-1.5 text-sm font-bold tracking-widest text-hud-green">
                LOGRO DESBLOQUEADO
              </div>
              <button
                onClick={startGame}
                className="rounded border border-hud-cyan px-4 py-2 text-sm font-bold tracking-widest text-hud-cyan transition-colors hover:bg-hud-cyan/10"
              >
                {t.minigame.retry}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
