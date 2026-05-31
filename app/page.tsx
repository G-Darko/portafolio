"use client";

import { useHUDStore } from "@/lib/store/useHUDStore";
import BootupSequence from "@/components/hud/BootupSequence";
import HUDShell from "@/components/hud/HUDShell";
import EasterEggManager from "@/components/hud/EasterEggManager";

export default function Home() {
  const { bootupDone } = useHUDStore();

  return (
    <>
      <EasterEggManager />
      {!bootupDone ? <BootupSequence /> : <HUDShell />}
    </>
  );
}
