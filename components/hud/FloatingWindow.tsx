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
        className="absolute flex flex-col overflow-hidden"
        style={{
          zIndex,
          width: defaultWidth,
          height: isMinimized ? 40 : defaultHeight,
          /* Stark hologram style */
          background: "rgba(8, 16, 32, 0.75)",
          border: "1px solid rgba(13, 248, 249, 0.3)",
          boxShadow: `
            0 0 20px rgba(13, 248, 249, 0.1),
            0 0 40px rgba(13, 248, 249, 0.05),
            inset 0 1px 0 rgba(255,255,255,0.05)
          `,
          backdropFilter: "blur(12px)",
          clipPath: "polygon(0 8px, 8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px))",
        }}
      >
        {/* Corner accents */}
        <div className="pointer-events-none absolute inset-0"
          style={{
            background: `
              linear-gradient(135deg, rgba(13,248,249,0.3) 0px, transparent 8px),
              linear-gradient(-135deg, rgba(13,248,249,0.3) 0px, transparent 8px),
              linear-gradient(45deg, rgba(13,248,249,0.3) 0px, transparent 8px),
              linear-gradient(-45deg, rgba(13,248,249,0.3) 0px, transparent 8px)
            `,
            backgroundRepeat: "no-repeat",
            backgroundSize: "20px 20px",
            backgroundPosition: "0 0, 100% 0, 0 100%, 100% 100%",
          }}
        />

        {/* Scanline overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(13,248,249,0.03) 2px, rgba(13,248,249,0.03) 4px)",
          }}
        />

        {/* Window header - hologram style */}
        <div
          className="hologram-header relative flex cursor-move items-center justify-between border-b px-3 py-2 select-none"
          style={{
            borderColor: "rgba(13, 248, 249, 0.2)",
            background: "linear-gradient(90deg, rgba(13,248,249,0.1) 0%, transparent 50%, rgba(13,248,249,0.05) 100%)",
          }}
        >
          <div className="flex items-center gap-2">
            {/* Status dot */}
            <div
              className="h-2 w-2 rounded-full"
              style={{
                background: "var(--c1)",
                boxShadow: "0 0 6px var(--c1)",
              }}
            />
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em]" style={{ color: "var(--c1)" }}>
                {title}
              </span>
              {subtitle && (
                <span className="ml-1.5 text-[9px] opacity-40 font-mono" style={{ color: "var(--accent)" }}>
                  // {subtitle}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized((p) => !p)}
              className="flex h-5 w-5 items-center justify-center text-[10px] font-mono transition-colors hover:text-[var(--c1)]"
              style={{ color: "var(--accent)" }}
            >
              {isMinimized ? "+" : "−"}
            </button>
            <button
              onClick={onClose}
              className="flex h-5 w-5 items-center justify-center text-[10px] transition-colors hover:text-[var(--hud-red)]"
              style={{ color: "var(--accent)" }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Window body */}
        {!isMinimized && (
          <div className="scrollbar-thin relative z-10 flex-1 overflow-auto p-3">
            {children}
          </div>
        )}
      </motion.div>
    </Draggable>
  );
}
