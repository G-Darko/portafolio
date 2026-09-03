"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useHUDStore } from "@/lib/store/useHUDStore";
import BootupSequence from "@/components/hud/BootupSequence";
import HUDShell from "@/components/hud/HUDShell";
import HudThemeProvider from "@/components/HudThemeProvider";
import EasterEggManager from "@/components/hud/EasterEggManager";
import { parseHudPath } from "@/lib/hud/routes";

export default function PortfolioApp() {
  const pathname = usePathname();
  const sessionActive = useHUDStore((s) => s.sessionActive);
  const bootupDone = useHUDStore((s) => s.bootupDone);
  const bootEpoch = useHUDStore((s) => s.bootEpoch);
  const completeBoot = useHUDStore((s) => s.completeBoot);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = useHUDStore.persist.onFinishHydration(() => setHydrated(true));
    if (useHUDStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);

  // Deep links skip the boot gate so shared URLs open the panel directly
  useEffect(() => {
    if (!hydrated) return;
    const { panel } = parseHudPath(pathname);
    if (panel && !sessionActive && !bootupDone) {
      completeBoot();
    }
  }, [hydrated, pathname, sessionActive, bootupDone, completeBoot]);

  const showHUD = sessionActive || bootupDone;

  return (
    <HudThemeProvider>
      <EasterEggManager />
      {!hydrated ? (
        <div className="fixed inset-0 bg-background" />
      ) : showHUD ? (
        <HUDShell />
      ) : (
        <BootupSequence key={bootEpoch} />
      )}
    </HudThemeProvider>
  );
}
