import { cn } from "@/lib/utils";

type HudStatusDotColor = "cyan" | "green" | "amber" | "red";

const COLOR_CLASS: Record<HudStatusDotColor, string> = {
  cyan: "bg-hud-cyan shadow-[0_0_8px_var(--hud-cyan)]",
  green: "bg-hud-green shadow-[0_0_8px_var(--hud-green)]",
  amber: "bg-hud-amber shadow-[0_0_8px_var(--hud-amber)]",
  red: "bg-hud-red shadow-[0_0_8px_var(--hud-red)]",
};

type HudStatusDotProps = {
  color?: HudStatusDotColor;
  className?: string;
};

export default function HudStatusDot({ color = "cyan", className }: HudStatusDotProps) {
  return (
    <span
      aria-hidden
      className={cn("h-2 w-2 shrink-0 rounded-full", COLOR_CLASS[color], className)}
    />
  );
}
