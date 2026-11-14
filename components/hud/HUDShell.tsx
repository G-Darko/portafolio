"use client";

import TechIconsSprite from "@/components/TechIconsSprite";
import dynamic from "next/dynamic";

// Nyxheim is the whole experience now: the 3D world is the home, the
// sections live inside it, and there is no HUD header or HUD panel anymore.
// The old shell (orb, header, HologramPanel windows) is kept on disk but no
// longer wired; see the round-2 report for the cleanup list.
const NyxheimWorld = dynamic(() => import("@/components/nyxheim/NyxheimWorld"), { ssr: false });

export default function HUDShell() {
  return (
    <div className="hud-shell fixed inset-0 overflow-hidden bg-background text-foreground">
      <TechIconsSprite />
      <NyxheimWorld />
    </div>
  );
}
