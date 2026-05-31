"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";
import dynamic from "next/dynamic";

const TechSphere = dynamic(() => import("@/components/three/TechSphere"), { ssr: false });

export default function SkillsWindow() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1">
        <TechSphere />
      </div>
    </div>
  );
}
