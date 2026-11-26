import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MissionId } from "@/lib/data/missions";
import { syncHudAudioEnabled } from "@/lib/audio/audio";
import { setAmbientEnabled } from "@/lib/audio/ambient";

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
  /** Exordia ambient drone (lib/audio/ambient.ts). */
  backgroundSoundEnabled: boolean;
  /** Cuelume cues + HUD audio + travel sound (lib/audio/audio.ts). */
  effectsSoundEnabled: boolean;
  konamiActive: boolean;

  completeBoot: () => void;
  endSession: () => void;
  openPanel: (id: PanelId) => void;
  closePanel: () => void;
  togglePanel: (id: PanelId) => void;
  selectMission: (id: MissionId | null) => void;
  selectSubMission: (id: string | null) => void;
  openMissionPanel: (id: MissionId) => void;
  toggleBackgroundSound: () => void;
  toggleEffectsSound: () => void;
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
      backgroundSoundEnabled: true,
      effectsSoundEnabled: true,
      konamiActive: false,

      completeBoot: () => set({ sessionActive: true, bootupDone: true }),
      // Back to the boot gate (used by the classic HUD header + terminal).
      // Restored with the HUD era (Ronda 7); `bootEpoch` remounts BootupSequence.
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
      // The background switch only pilots the ambient drone: the call is
      // synchronous so the drone fades out/in immediately, and
      // NyxheimWorld's effect (subscribed to the same flag) keeps the
      // world in sync when the flag changes from anywhere else.
      toggleBackgroundSound: () =>
        set((s) => {
          const backgroundSoundEnabled = !s.backgroundSoundEnabled;
          setAmbientEnabled(backgroundSoundEnabled);
          return { backgroundSoundEnabled };
        }),
      // The effects switch pilots every cue + the HUD audio (and the
      // travel sound, which is an effect). The call is synchronous so a
      // confirmation tick played right after the toggle only sounds when
      // the switch ends up enabled.
      toggleEffectsSound: () =>
        set((s) => {
          const effectsSoundEnabled = !s.effectsSoundEnabled;
          syncHudAudioEnabled(effectsSoundEnabled);
          return { effectsSoundEnabled };
        }),
      setKonamiActive: (v) => set({ konamiActive: v }),
    }),
    {
      name: "gdarko-hud-session",
      // Panel/mission live in the URL; only persist session + the sound
      // preferences so return visits keep the mute the user chose.
      partialize: (state) => ({
        sessionActive: state.sessionActive,
        backgroundSoundEnabled: state.backgroundSoundEnabled,
        effectsSoundEnabled: state.effectsSoundEnabled,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        // Clear legacy persisted panel keys from older builds
        state.activePanel = null;
        state.activeMissionId = null;
        state.activeSubMissionId = null;
        // One-time migration from the single `soundEnabled` flag (Ronda 7
        // polish): a stored `soundEnabled: false` mutes both channels, a
        // stored `true` (or nothing stored) leaves both on. The old key
        // is dropped by `partialize` on the next persist, so this only
        // ever runs once per browser.
        const legacy = (state as unknown as { soundEnabled?: unknown }).soundEnabled;
        if (typeof legacy === "boolean") {
          state.backgroundSoundEnabled = legacy;
          state.effectsSoundEnabled = legacy;
        }
      },
    }
  )
);
