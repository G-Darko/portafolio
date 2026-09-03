import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MissionId } from "@/lib/data/missions";

export type PanelId =
  | "profile"
  | "missions"
  | "skills"
  | "certifications"
  | "terminal"
  | "minigame"
  | "contact";

interface HUDState {
  sessionActive: boolean;
  bootupDone: boolean;
  bootEpoch: number;
  activePanel: PanelId | null;
  activeMissionId: MissionId | null;
  activeSubMissionId: string | null;
  soundEnabled: boolean;
  konamiActive: boolean;

  completeBoot: () => void;
  endSession: () => void;
  openPanel: (id: PanelId) => void;
  closePanel: () => void;
  togglePanel: (id: PanelId) => void;
  selectMission: (id: MissionId | null) => void;
  selectSubMission: (id: string | null) => void;
  openMissionPanel: (id: MissionId) => void;
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
      activeSubMissionId: null,
      soundEnabled: true,
      konamiActive: false,

      completeBoot: () => set({ sessionActive: true, bootupDone: true }),
      endSession: () =>
        set((s) => ({
          sessionActive: false,
          bootupDone: false,
          activePanel: null,
          activeMissionId: null,
          activeSubMissionId: null,
          bootEpoch: s.bootEpoch + 1,
        })),
      openPanel: (id) =>
        set({
          activePanel: id,
          ...(id !== "missions"
            ? { activeMissionId: null, activeSubMissionId: null }
            : {}),
        }),
      closePanel: () =>
        set({ activePanel: null, activeMissionId: null, activeSubMissionId: null }),
      togglePanel: (id) => {
        const current = get().activePanel;
        if (current === id) {
          set({ activePanel: null, activeMissionId: null, activeSubMissionId: null });
        } else {
          set({
            activePanel: id,
            ...(id !== "missions"
              ? { activeMissionId: null, activeSubMissionId: null }
              : {}),
          });
        }
      },
      selectMission: (id) => set({ activeMissionId: id, activeSubMissionId: null }),
      selectSubMission: (id) => set({ activeSubMissionId: id }),
      openMissionPanel: (id) =>
        set({ activePanel: "missions", activeMissionId: id, activeSubMissionId: null }),
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      setKonamiActive: (v) => set({ konamiActive: v }),
    }),
    {
      name: "gdarko-hud-session",
      // Panel/mission live in the URL; only persist session so return visits skip boot.
      partialize: (state) => ({
        sessionActive: state.sessionActive,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        // Clear legacy persisted panel keys from older builds
        state.activePanel = null;
        state.activeMissionId = null;
        state.activeSubMissionId = null;
      },
    }
  )
);
