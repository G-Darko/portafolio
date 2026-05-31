"use client";

import { motion } from "motion/react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { GitBranch, Mail, ExternalLink } from "lucide-react";
import Image from "next/image";

export default function ProfileWindow() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-24 w-24 overflow-hidden rounded-full border-2"
        style={{ borderColor: "var(--c1)", boxShadow: "0 0 20px rgba(13,248,249,0.2)" }}
      >
        <Image
          src="/img/DARKO.png"
          alt="Gael Uribe"
          fill
          className="object-cover"
        />
      </div>

      <h2 className="text-center font-mono text-lg font-bold" style={{ color: "var(--c1)" }}>
        {t.profile.name}
      </h2>
      <p className="text-center text-xs opacity-70" style={{ color: "var(--accent)" }}>
        {t.profile.role}
      </p>

      <div className="mt-2 w-full rounded border p-3 text-xs leading-relaxed"
        style={{ borderColor: "var(--glass-border)", background: "rgba(102,204,255,0.03)" }}
      >
        {t.profile.about}
      </div>

      <div className="mt-1 flex w-full gap-2">
        <a
          href="/cv"
          className="flex flex-1 items-center justify-center gap-1 rounded border py-2 text-[10px] font-bold tracking-widest transition-colors hover:bg-accent/10"
          style={{ borderColor: "var(--glass-border)", color: "var(--c1)" }}
        >
          {t.profile.viewCv}
        </a>
        <a
          href="https://github.com/G-Darko"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-8 w-8 items-center justify-center rounded border transition-colors hover:bg-accent/10"
          style={{ borderColor: "var(--glass-border)", color: "var(--accent)" }}
        >
          <GitBranch size={14} />
        </a>
      </div>
    </div>
  );
}
