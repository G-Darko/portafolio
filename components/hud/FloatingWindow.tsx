"use client";

import { useRef, useState, useCallback, type ReactNode } from "react";
import { motion } from "motion/react";
import Draggable from "react-draggable";

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
  defaultHeight,
  onClose,
  onFocus,
  zIndex,
}: FloatingWindowProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);

  const handleStart = useCallback(() => {
    onFocus(id);
  }, [id, onFocus]);

  return (
    <Draggable
      nodeRef={nodeRef as React.RefObject<HTMLElement>}
      defaultPosition={{ x: defaultX, y: defaultY }}
      bounds="body"
      handle=".hologram-header"
      onStart={handleStart}
    >
      <motion.div
        ref={nodeRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onMouseDown={handleStart}
        className="absolute flex flex-col overflow-hidden rounded-lg border border-hud-border bg-hud-bg shadow-[var(--hud-glow)] backdrop-blur-xl"
        style={{
          zIndex,
          width: defaultWidth,
          height: isMinimized ? 40 : defaultHeight,
        }}
      >
        {/* Hologram header */}
        <div
          className="hologram-header relative flex cursor-move items-center justify-between border-b border-hud-border px-3 py-2 select-none bg-gradient-to-r from-hud-cyan/10 via-transparent to-hud-cyan/5"
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

        {/* Body */}
        {!isMinimized && (
          <div className="scrollbar-thin relative z-10 flex-1 overflow-auto p-3">
            {children}
          </div>
        )}
      </motion.div>
    </Draggable>
  );
}
