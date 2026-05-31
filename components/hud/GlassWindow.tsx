"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";

interface GlassWindowProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  onClose: () => void;
  initialX?: number;
  initialY?: number;
}

export default function GlassWindow({
  title,
  subtitle,
  children,
  onClose,
  initialX = 0,
  initialY = 0,
}: GlassWindowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotateY(x * 3);
    setRotateX(-y * 3);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, x: 40 + initialX, y: 20 + initialY, scale: 0.95 }}
      animate={{ opacity: 1, x: initialX, y: initialY, scale: 1 }}
      exit={{ opacity: 0, x: 20, y: 10, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        perspective: 800,
      }}
      className="pointer-events-auto relative z-[160] mx-2 max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-xl border md:mx-0"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Glass background */}
      <div
        className="absolute inset-0 rounded-xl backdrop-blur-xl"
        style={{
          background: "rgba(18, 18, 22, 0.85)",
          border: "1px solid var(--glass-border)",
          boxShadow: "var(--hud-glow), 0 25px 50px -12px rgba(0,0,0,0.5)",
        }}
      />

      {/* Edge glow */}
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          boxShadow: "inset 0 1px 1px rgba(255,255,255,0.05), inset 0 -1px 1px rgba(0,0,0,0.3)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col max-h-[85vh]">
        {/* Window header */}
        <div className="flex items-center justify-between border-b px-5 py-3" style={{ borderColor: "var(--glass-border)" }}>
          <div>
            <h3
              className="text-sm font-bold tracking-widest uppercase"
              style={{ color: "var(--c1)" }}
            >
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs opacity-60" style={{ color: "var(--text)" }}>
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded hover:bg-[rgba(255,82,82,0.15)] transition-colors"
            style={{ color: "var(--hud-red)" }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="scrollbar-thin overflow-y-auto px-5 py-4">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
