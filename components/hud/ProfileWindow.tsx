"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";
import { GitBranch } from "lucide-react";
import { getHudBasePath } from "@/lib/hud/routes";
import Image from "next/image";
import Link from "next/link";

export default function ProfileWindow() {
  const { t } = useTranslation();
  const base = getHudBasePath();
  const avatarSrc = `${base}/img/DARKO.png`;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative mx-auto h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-hud-cyan shadow-[0_0_20px_oklch(0.65_0.18_255/0.2)]">
        <Image src={avatarSrc} alt={t.profile.name} className="h-full w-full object-cover" width={80} height={80} />
      </div>

      <h2 className="shrink-0 text-center font-mono text-lg font-bold text-hud-cyan md:text-xl">
        {t.profile.name}
      </h2>
      <p className="text-center text-sm text-muted-foreground md:text-base">
        {t.profile.role}
      </p>

      <div className="mt-2 w-full rounded border border-hud-border bg-hud-cyan/5 p-4 text-sm leading-relaxed text-foreground md:text-base">
        {t.profile.about}
      </div>

      <div className="mt-1 flex w-full gap-2">
        <Link
          href={`${base}/cv/`}
          className="flex min-h-11 flex-1 items-center justify-center gap-1 rounded border border-hud-border px-3 py-2.5 text-sm font-bold tracking-widest text-hud-cyan transition-colors hover:bg-hud-cyan/10"
        >
          {t.profile.viewCv}
        </Link>
        <Link
          href="https://github.com/G-Darko"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded border border-hud-border px-3 text-sm text-muted-foreground transition-colors hover:bg-hud-cyan/10 hover:text-hud-cyan"
          aria-label={t.header.github}
        >
          <GitBranch size={16} />
          <span className="hidden font-mono tracking-wide sm:inline">GitHub</span>
        </Link>
      </div>
    </div>
  );
}
