"use client";

import Link from "next/link";
import { CV_PATH } from "@/lib/data/profile";
import { useTranslation } from "@/lib/i18n/useTranslation";

export default function NotFound() {
  const { t } = useTranslation();
  const copy = t.notFound;

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background px-4 text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(color-mix(in oklch, var(--hud-blue) 12%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklch, var(--hud-blue) 12%, transparent) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="relative w-full max-w-lg rounded-lg border border-hud-border/60 bg-hud-bg/85 p-8 shadow-[0_0_40px_color-mix(in_oklch,var(--hud-cyan)_14%,transparent)] backdrop-blur-xl md:p-10">
        <p className="font-mono text-xs font-bold tracking-[0.28em] text-hud-cyan uppercase">
          G-DARKO // ERR
        </p>
        <div className="mt-4 flex items-baseline gap-4">
          <span className="font-mono text-5xl font-bold text-foreground md:text-6xl">
            {copy.code}
          </span>
          <span className="h-10 w-px bg-hud-border md:h-12" aria-hidden />
          <h1 className="font-mono text-lg font-bold tracking-wide text-hud-cyan md:text-xl">
            {copy.title}
          </h1>
        </div>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">{copy.body}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded border border-hud-cyan/50 bg-foreground px-4 py-2 font-mono text-sm font-semibold tracking-widest text-background transition-opacity hover:opacity-90"
          >
            {copy.home}
          </Link>
          <Link
            href={CV_PATH}
            className="inline-flex min-h-11 items-center rounded border border-hud-border px-4 py-2 font-mono text-sm font-bold tracking-widest text-hud-cyan transition-colors hover:bg-hud-cyan/10"
          >
            {copy.cv}
          </Link>
        </div>
      </div>
    </div>
  );
}
