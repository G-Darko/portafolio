import { create } from "zustand";

interface HUDState {
  bootupDone: boolean;
  activeMissionId: string | null;
  activeWindow: "terminal" | "minigame" | "sphere" | "mission" | null;
  soundEnabled: boolean;
  konamiActive: boolean;

  setBootupDone: (v: boolean) => void;
  openMission: (id: string) => void;
  closeMission: () => void;
  toggleWindow: (w: "terminal" | "minigame" | "sphere" | null) => void;
  toggleSound: () => void;
  setKonamiActive: (v: boolean) => void;
}

export const useHUDStore = create<HUDState>((set) => ({
  bootupDone: false,
  activeMissionId: null,
  activeWindow: null,
  soundEnabled: true,
  konamiActive: false,

  setBootupDone: (v) => set({ bootupDone: v }),
  openMission: (id) => set({ activeMissionId: id, activeWindow: "mission" }),
  closeMission: () => set({ activeMissionId: null, activeWindow: null }),
  toggleWindow: (w) => set({ activeWindow: w }),
  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
  setKonamiActive: (v) => set({ konamiActive: v }),
}));
