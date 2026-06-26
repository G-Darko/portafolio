import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PanelId =
  | "profile"
  | "experience"
  | "projects"
  | "certifications"
  | "terminal"
  | "minigame"
  | "contact";

interface HUDState {
  sessionActive: boolean;
  bootupDone: boolean;
  bootEpoch: number;
  activePanel: PanelId | null;
  activeMissionId: string | null;
  soundEnabled: boolean;
  konamiActive: boolean;

  completeBoot: () => void;
  endSession: () => void;
  openPanel: (id: PanelId) => void;
  closePanel: () => void;
  togglePanel: (id: PanelId) => void;
  openMission: (id: string) => void;
  closeMission: () => void;
  toggleSound: () => void;
  setKonamiActive: (v: boolean) => void;
}

export const useHUDStore = create<HUDState>()(
  persist(
    (set, get) => ({
      sessionActive: false,
      bootupDone: false,
      bootEpoch: 0,
      activePanel: null,
      activeMissionId: null,
      soundEnabled: true,
      konamiActive: false,

      completeBoot: () => set({ sessionActive: true, bootupDone: true }),
      endSession: () =>
        set((s) => ({
          sessionActive: false,
          bootupDone: false,
          activePanel: null,
          activeMissionId: null,
          bootEpoch: s.bootEpoch + 1,
        })),
      openPanel: (id) => set({ activePanel: id }),
      closePanel: () => set({ activePanel: null }),
      togglePanel: (id) => {
        const current = get().activePanel;
        set({ activePanel: current === id ? null : id });
      },
      openMission: (id) => set({ activeMissionId: id }),
      closeMission: () => set({ activeMissionId: null }),
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      setKonamiActive: (v) => set({ konamiActive: v }),
    }),
    {
      name: "stark-hud-session",
      partialize: (state) => ({
        sessionActive: state.sessionActive,
        activePanel: state.activePanel,
      }),
    }
  )
);
