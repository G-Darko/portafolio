import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DEFAULT_PALETTE_ID,
  isHudPaletteId,
  type HudPaletteId,
} from "@/lib/theme/hud-color-presets";

interface ColorThemeState {
  paletteId: HudPaletteId;
  setPaletteId: (id: HudPaletteId) => void;
}

function applyPaletteAttribute(id: HudPaletteId) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.palette = id;
}

export const useColorThemeStore = create<ColorThemeState>()(
  persist(
    (set) => ({
      paletteId: DEFAULT_PALETTE_ID,
      setPaletteId: (id) => {
        set({ paletteId: id });
        applyPaletteAttribute(id);
      },
    }),
    {
      name: "gdarko-hud-palette",
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        // Migrate stored palettes: the old 'skool' id is now 'electrico';
        // anything unknown falls back to the violet default.
        const stored = state.paletteId === ("skool" as HudPaletteId) ? "electrico" : state.paletteId;
        const paletteId = isHudPaletteId(stored) ? stored : DEFAULT_PALETTE_ID;
        state.paletteId = paletteId;
        applyPaletteAttribute(paletteId);
      },
    }
  )
);
