"use client";

import { useEffect, useState } from "react";
import { useHUDStore } from "@/lib/store/useHUDStore";
import BootupSequence from "@/components/hud/BootupSequence";
import HUDShell from "@/components/hud/HUDShell";
import EasterEggManager from "@/components/hud/EasterEggManager";

export default function Home() {
  const sessionActive = useHUDStore((s) => s.sessionActive);
  const bootupDone = useHUDStore((s) => s.bootupDone);
  const bootEpoch = useHUDStore((s) => s.bootEpoch);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = useHUDStore.persist.onFinishHydration(() => setHydrated(true));
    if (useHUDStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);

  const showHUD = sessionActive || bootupDone;

  return (
    <>
      <EasterEggManager />
      {!hydrated ? (
        <div className="fixed inset-0 bg-background" />
      ) : showHUD ? (
        <HUDShell />
      ) : (
        <BootupSequence key={bootEpoch} />
      )}
    </>
  );
}
