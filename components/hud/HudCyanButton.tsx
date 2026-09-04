import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const baseClass =
  "inline-flex min-h-11 items-center justify-center gap-1.5 rounded border border-hud-cyan/40 px-4 py-2.5 font-mono text-sm font-bold tracking-[0.14em] text-hud-cyan uppercase transition-colors hover:bg-hud-cyan/10 hud-focus-ring md:text-base";

type HudCyanButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  className?: string;
  href?: string;
};

export default function HudCyanButton({
  children,
  className,
  href,
  type = "button",
  ...props
}: HudCyanButtonProps) {
  if (href) {
    return (
      <Link href={href} className={cn(baseClass, className)}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={cn(baseClass, className)} {...props}>
      {children}
    </button>
  );
}
