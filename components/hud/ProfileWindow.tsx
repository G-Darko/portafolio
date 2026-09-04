"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";
import { GitBranch } from "lucide-react";
import { asset } from "@/lib/asset";
import { CV_PATH, GITHUB_URL } from "@/lib/data/profile";
import { toBrowserHref } from "@/lib/hud/routes";
import Image from "next/image";
import HudOutlineLink from "./HudOutlineLink";

export default function ProfileWindow() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative mx-auto h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-hud-cyan shadow-[0_0_20px_oklch(0.65_0.18_255/0.2)]">
        <Image
          src={asset("img/DARKO.png")}
          alt={t.profile.name}
          className="h-full w-full object-cover"
          width={80}
          height={80}
        />
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
        <HudOutlineLink
          href={toBrowserHref(CV_PATH)}
          className="flex-1 font-bold tracking-widest"
          tone="cyan"
        >
          {t.profile.viewCv}
        </HudOutlineLink>
        <HudOutlineLink
          href={GITHUB_URL}
          external
          className="min-w-11"
          aria-label={t.header.github}
        >
          <GitBranch size={16} />
          <span className="hidden font-mono tracking-wide sm:inline">GitHub</span>
        </HudOutlineLink>
      </div>
    </div>
  );
}
