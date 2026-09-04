"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import HudScanlines from "./HudScanlines";
import HudStatusDot from "./HudStatusDot";

interface HologramPanelProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  onClose: () => void;
  className?: string;
  contentClassName?: string;
}

export default function HologramPanel({
  title,
  subtitle,
  children,
  onClose,
  className = "",
  contentClassName = "",
}: HologramPanelProps) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) {
      return;
    }
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotateY(x * 2);
    setRotateX(-y * 2);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative z-60 flex w-full min-w-0 flex-col overflow-hidden rounded-lg border border-hud-border/80 bg-hud-bg/60 shadow-[0_0_30px_oklch(0.65_0.18_255/0.12),0_0_60px_oklch(0.65_0.18_255/0.06),inset_0_1px_0_oklch(1_0_0/0.05)] backdrop-blur-xl lg:max-h-[calc(100vh-5rem)] ${className}`}
      style={{
        transform: `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            linear-gradient(135deg, oklch(0.65 0.18 255 / 0.35) 0px, transparent 10px),
            linear-gradient(-135deg, oklch(0.65 0.18 255 / 0.35) 0px, transparent 10px),
            linear-gradient(45deg, oklch(0.65 0.18 255 / 0.35) 0px, transparent 10px),
            linear-gradient(-45deg, oklch(0.65 0.18 255 / 0.35) 0px, transparent 10px)
          `,
          backgroundRepeat: "no-repeat",
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 100% 0, 0 100%, 100% 100%",
        }}
      />
      <HudScanlines opacity={0.2} />

      <div className="relative flex items-center justify-between border-b border-hud-border/60 px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <HudStatusDot color="cyan" />
          <div className="min-w-0">
            <span className="block truncate text-sm font-bold tracking-[0.12em] text-hud-cyan md:text-base">
              {title}
            </span>
            {subtitle && (
              <span className="block truncate font-mono text-sm text-muted-foreground md:text-base">
                {"// "}
                {subtitle}
              </span>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="hud-focus-ring flex h-10 w-10 items-center justify-center rounded font-mono text-sm text-muted-foreground transition-colors hover:bg-hud-cyan/10 hover:text-hud-red"
          aria-label={t.header.closePanel}
        >
          ✕
        </button>
      </div>

      <div
        className={`relative z-10 min-h-0 flex-1 p-4 md:p-5 ${contentClassName || "scrollbar-thin overflow-auto"}`}
      >
        {children}
      </div>
    </motion.div>
  );
}
