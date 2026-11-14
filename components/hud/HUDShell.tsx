"use client";

import TechIconsSprite from "@/components/TechIconsSprite";
import dynamic from "next/dynamic";

// Nyxheim is the whole experience now: the 3D world is the home, the
// sections live inside it, and there is no HUD header or HUD panel anymore.
// The old shell files were deleted in the round-3 cleanup (they had zero
// uses left); ContactWindow stays: its form now lives in ContactForm.
const NyxheimWorld = dynamic(() => import("@/components/nyxheim/NyxheimWorld"), { ssr: false });

export default function HUDShell() {
  return (
    <div className="hud-shell fixed inset-0 overflow-hidden bg-background text-foreground">
      <TechIconsSprite />
      <NyxheimWorld />
    </div>
  );
}
