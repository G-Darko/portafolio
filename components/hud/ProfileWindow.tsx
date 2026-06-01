"use client";

import { motion } from "motion/react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { GitBranch, Mail } from "lucide-react";
import Image from "next/image";

export default function ProfileWindow() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative mx-auto h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-hud-cyan shadow-[0_0_20px_oklch(0.65_0.18_255/0.2)]"
      >
        <img src="img/DARKO.png" alt="Gael Uribe" className="h-full w-full object-cover" />
      </div>

      <h2 className="shrink-0 text-center font-mono text-base font-bold text-hud-cyan">
        {t.profile.name}
      </h2>
      <p className="text-center text-xs text-muted-foreground">
        {t.profile.role}
      </p>

      <div className="mt-2 w-full rounded border border-hud-border bg-hud-cyan/5 p-3 text-xs leading-relaxed text-foreground"
      >
        {t.profile.about}
      </div>

      <div className="mt-1 flex w-full gap-2">
        <a
          href="cv"
          className="flex flex-1 items-center justify-center gap-1 rounded border border-hud-border py-2 text-[10px] font-bold tracking-widest text-hud-cyan transition-colors hover:bg-hud-cyan/10"
        >
          {t.profile.viewCv}
        </a>
        <a
          href="https://github.com/G-Darko"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-8 w-8 items-center justify-center rounded border border-hud-border text-muted-foreground transition-colors hover:bg-hud-cyan/10 hover:text-hud-cyan"
        >
          <GitBranch size={14} />
        </a>
      </div>
    </div>
  );
}
