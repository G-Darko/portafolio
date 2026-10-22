"use client";

import { useState } from "react";
import {
  Atom,
  Box,
  Braces,
  Cloud,
  CloudUpload,
  CodeXml,
  Coffee,
  Container,
  Database,
  FileCode,
  Flame,
  Gauge,
  GitBranch,
  GitPullRequest,
  Layers,
  LayoutTemplate,
  Leaf,
  Palette,
  Radio,
  Rocket,
  Server,
  ServerCog,
  Smartphone,
  SquareCode,
  TabletSmartphone,
  Terminal,
  Triangle,
  Wind,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { Skill } from "@/lib/data/skills";

/**
 * Closed map of the lucide names the API may send in `uiIcon` (readme-stats `src/data/profile.ts`).
 * Kept explicit so the bundle only ships these icons; add a name here when the API starts using it.
 */
export const LUCIDE_ICONS: Record<string, LucideIcon> = {
  atom: Atom,
  box: Box,
  braces: Braces,
  cloud: Cloud,
  "cloud-upload": CloudUpload,
  "code-xml": CodeXml,
  coffee: Coffee,
  container: Container,
  database: Database,
  "file-code": FileCode,
  flame: Flame,
  gauge: Gauge,
  "git-branch": GitBranch,
  "git-pull-request": GitPullRequest,
  layers: Layers,
  "layout-template": LayoutTemplate,
  leaf: Leaf,
  palette: Palette,
  radio: Radio,
  rocket: Rocket,
  server: Server,
  "server-cog": ServerCog,
  smartphone: Smartphone,
  "square-code": SquareCode,
  "tablet-smartphone": TabletSmartphone,
  terminal: Terminal,
  triangle: Triangle,
  wind: Wind,
  zap: Zap,
};

interface SkillIconProps {
  skill: Pick<Skill, "uiIcon" | "icon" | "sprite">;
  size?: number;
  className?: string;
}

/** Skill icon: lucide (`uiIcon`) → remote SVG logo (`icon`) → sprite symbol (`sprite`) → empty slot. */
export default function SkillIcon({ skill, size = 18, className = "" }: SkillIconProps) {
  const [failed, setFailed] = useState(false);
  const Lucide = skill.uiIcon ? LUCIDE_ICONS[skill.uiIcon] : undefined;

  if (Lucide) {
    return <Lucide aria-hidden size={size} className={`shrink-0 text-hud-cyan ${className}`} />;
  }

  if (skill.icon && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- remote SVG from the skills API in a static export
      <img
        src={skill.icon}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className={`shrink-0 rounded-sm ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  if (skill.sprite) {
    return (
      <svg aria-hidden width={size} height={size} className={`shrink-0 text-hud-cyan ${className}`} fill="currentColor">
        <use href={`#${skill.sprite}`} />
      </svg>
    );
  }

  return <span aria-hidden className={`shrink-0 ${className}`} style={{ width: size, height: size }} />;
}
