"use client";

import { useRef, useState, useCallback, useEffect, type ReactNode } from "react";
import { motion } from "motion/react";

interface FloatingWindowProps {
  id: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  defaultX?: number;
  defaultY?: number;
  defaultWidth?: number;
  defaultHeight?: number;
  onClose: () => void;
  onFocus: (id: string) => void;
  zIndex: number;
}

export default function FloatingWindow({
  id,
  title,
  subtitle,
  children,
  defaultX = 50,
  defaultY = 80,
  defaultWidth = 380,
  defaultHeight = 400,
  onClose,
  onFocus,
  zIndex,
}: FloatingWindowProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [pos, setPos] = useState({ x: defaultX, y: defaultY });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const animatingRef = useRef(false);

  useEffect(() => {
    animatingRef.current = true;
    const t = setTimeout(() => { animatingRef.current = false; }, 500);
    return () => clearTimeout(t);
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (animatingRef.current) return;
      if (!(e.target as HTMLElement).closest(".hologram-header")) return;
      onFocus(id);
      setIsDragging(true);
      dragOffset.current = {
        x: e.clientX - pos.x,
        y: e.clientY - pos.y,
      };
      e.preventDefault();
    },
    [onFocus, id, pos]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      const newX = e.clientX - dragOffset.current.x;
      const newY = e.clientY - dragOffset.current.y;
      const maxX = 1600 - defaultWidth;
      const maxY = window.innerHeight - (defaultHeight || 300) - 48;
      setPos({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(48, Math.min(newY, maxY)),
      });
    },
    [isDragging, defaultWidth, defaultHeight]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1, x: pos.x, y: pos.y }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onMouseDown={() => !isDragging && onFocus(id)}
      className="absolute flex flex-col overflow-hidden rounded-lg border border-hud-border bg-hud-bg/80 shadow-[0_0_20px_oklch(0.65_0.18_255/0.1),0_0_40px_oklch(0.65_0.18_255/0.05),inset_0_1px_0_oklch(1_0_0/0.05)] backdrop-blur-xl"
      style={{
        zIndex,
        width: defaultWidth,
        height: isMinimized ? 40 : defaultHeight,
        cursor: isDragging ? "grabbing" : "default",
        left: 0,
        top: 0,
      }}
    >
      {/* Corner hologram accents */}
      <div className="pointer-events-none absolute inset-0"
        style={{
          background: `
            linear-gradient(135deg, oklch(0.65 0.18 255 / 0.3) 0px, transparent 8px),
            linear-gradient(-135deg, oklch(0.65 0.18 255 / 0.3) 0px, transparent 8px),
            linear-gradient(45deg, oklch(0.65 0.18 255 / 0.3) 0px, transparent 8px),
            linear-gradient(-45deg, oklch(0.65 0.18 255 / 0.3) 0px, transparent 8px)
          `,
          backgroundRepeat: "no-repeat",
          backgroundSize: "16px 16px",
          backgroundPosition: "0 0, 100% 0, 0 100%, 100% 100%",
        }}
      />

      {/* Scanlines */}
      <div className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, oklch(0.65 0.18 255 / 0.03) 2px, oklch(0.65 0.18 255 / 0.03) 4px)",
        }}
      />

      {/* Hologram header */}
      <div
        className="hologram-header relative flex cursor-grab items-center justify-between border-b border-hud-border px-3 py-2 select-none bg-gradient-to-r from-hud-cyan/10 via-transparent to-hud-cyan/5 active:cursor-grabbing"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-hud-cyan shadow-[0_0_6px_var(--hud-cyan)]" />
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-hud-cyan">
              {title}
            </span>
            {subtitle && (
              <span className="ml-1.5 text-[9px] font-mono text-muted-foreground">
                // {subtitle}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized((p) => !p)}
            className="flex h-5 w-5 items-center justify-center text-[10px] font-mono text-muted-foreground transition-colors hover:text-hud-cyan"
          >
            {isMinimized ? "+" : "−"}
          </button>
          <button
            onClick={onClose}
            className="flex h-5 w-5 items-center justify-center text-[10px] text-muted-foreground transition-colors hover:text-hud-red"
          >
            ✕
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="scrollbar-thin relative z-10 flex-1 overflow-auto p-3">
          {children}
        </div>
      )}
    </motion.div>
  );
}
