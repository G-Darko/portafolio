import { cn } from "@/lib/utils";

type HudScanlinesProps = {
  className?: string;
  /** 0–1 opacity of the scanline overlay */
  opacity?: number;
  /** Use CSS variable tint (Contact/Terminal) vs fixed oklch (panels) */
  variant?: "fixed" | "token";
};

export default function HudScanlines({
  className,
  opacity = 0.2,
  variant = "fixed",
}: HudScanlinesProps) {
  const background =
    variant === "token"
      ? "repeating-linear-gradient(0deg, transparent, transparent 2px, color-mix(in oklch, var(--hud-cyan) 12%, transparent) 2px, color-mix(in oklch, var(--hud-cyan) 12%, transparent) 4px)"
      : "repeating-linear-gradient(0deg, transparent, transparent 2px, oklch(0.65 0.18 255 / 0.03) 2px, oklch(0.65 0.18 255 / 0.03) 4px)";

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{ opacity, background }}
    />
  );
}
