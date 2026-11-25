"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { useHUDStore } from "@/lib/store/useHUDStore";
import BootupSequence from "@/components/hud/BootupSequence";
import HudShellClassic from "@/components/hud/HudShellClassic";
import HudThemeProvider from "@/components/HudThemeProvider";
import EasterEggManager from "@/components/hud/EasterEggManager";
import { parseHudPath } from "@/lib/hud/routes";
import { initHudAudio, syncHudAudioEnabled } from "@/lib/audio/audio";

/**
 * The HUD era app (`/era/hud/...`, Ronda 7): the pre-Exordia
 * `PortfolioApp` (`1885501^`) with the classic shell restored. The boot
 * gate is shared with Exordia (same store), and deep links
 * (`/era/hud/missions/...`) skip it, exactly like the old HUD did.
 */
export default function HudEraApp() {
  const pathname = usePathname();
  const sessionActive = useHUDStore((s) => s.sessionActive);
  const bootupDone = useHUDStore((s) => s.bootupDone);
  const bootEpoch = useHUDStore((s) => s.bootEpoch);
  const completeBoot = useHUDStore((s) => s.completeBoot);
  const soundEnabled = useHUDStore((s) => s.soundEnabled);
  const hydrated = useSyncExternalStore(
    (onChange) => useHUDStore.persist.onFinishHydration(onChange),
    () => useHUDStore.persist.hasHydrated(),
    () => false
  );

  useEffect(() => {
    if (!hydrated) return;
    initHudAudio(useHUDStore.getState().soundEnabled);
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    syncHudAudioEnabled(soundEnabled);
  }, [hydrated, soundEnabled]);

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
        <HudShellClassic />
      ) : (
        <BootupSequence key={bootEpoch} />
      )}
    </HudThemeProvider>
  );
}
