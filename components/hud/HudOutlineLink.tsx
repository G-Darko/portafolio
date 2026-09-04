import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

const SIZE_CLASS = {
  sm: "min-h-10 px-3 py-2 text-sm",
  md: "min-h-11 px-3 py-2.5 text-sm",
} as const;

type HudOutlineLinkProps = Omit<ComponentProps<typeof Link>, "className"> & {
  children: ReactNode;
  className?: string;
  size?: keyof typeof SIZE_CLASS;
  external?: boolean;
  tone?: "muted" | "cyan";
};

export default function HudOutlineLink({
  children,
  className,
  size = "md",
  external = false,
  tone = "muted",
  ...props
}: HudOutlineLinkProps) {
  return (
    <Link
      {...props}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded border border-hud-border font-mono transition-colors hover:bg-hud-cyan/10 hud-focus-ring",
        SIZE_CLASS[size],
        tone === "cyan"
          ? "text-hud-cyan"
          : "text-muted-foreground hover:text-hud-cyan",
        className
      )}
    >
      {children}
    </Link>
  );
}
