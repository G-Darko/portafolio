"use client";

import { useRef, useState, useCallback, type ReactNode } from "react";
import { motion } from "motion/react";
import Draggable from "react-draggable";
import { Maximize2 } from "lucide-react";

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
      bounds="parent"
      handle=".window-header"
      onStart={handleStart}
    >
      <motion.div
        ref={nodeRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onMouseDown={handleStart}
        className="absolute flex flex-col overflow-hidden rounded-xl border backdrop-blur-xl"
        style={{
          zIndex,
          width: defaultWidth,
          height: isMinimized ? 44 : defaultHeight,
          borderColor: "var(--glass-border)",
          background: "rgba(12, 16, 24, 0.85)",
          boxShadow: "var(--hud-glow), 0 25px 50px -12px rgba(0,0,0,0.6)",
        }}
      >
        {/* Window header */}
        <div
          className="window-header flex cursor-move items-center justify-between border-b px-3 py-2.5 select-none"
          style={{ borderColor: "var(--glass-border)" }}
        >
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <button
                onClick={onClose}
                className="flex h-3 w-3 items-center justify-center rounded-full bg-[#ff5f57] hover:brightness-110"
              />
              <button
                onClick={() => setIsMinimized((p) => !p)}
                className="flex h-3 w-3 items-center justify-center rounded-full bg-[#febc2e] hover:brightness-110"
              />
              <div className="h-3 w-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="ml-2">
              <span className="text-[10px] font-bold tracking-widest" style={{ color: "var(--c1)" }}>
                {title}
              </span>
              {subtitle && (
                <span className="ml-1 text-[9px] opacity-50" style={{ color: "var(--text)" }}>
                  {subtitle}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsMinimized((p) => !p)}
            className="flex h-5 w-5 items-center justify-center rounded opacity-50 hover:opacity-100"
            style={{ color: "var(--accent)" }}
          >
            <Maximize2 size={10} />
          </button>
        </div>

        {/* Window body */}
        {!isMinimized && (
          <div className="scrollbar-thin flex-1 overflow-auto p-3">
            {children}
          </div>
        )}
      </motion.div>
    </Draggable>
  );
}
