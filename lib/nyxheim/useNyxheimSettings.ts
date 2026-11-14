/**
 * Nyxheim settings, persisted in localStorage (unlike the world focus,
 * which lives in the URL). Same pattern as the theme: the user picks once
 * and the world remembers.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";

/** How body labels behave in the scene. */
export type LabelMode =
  /** Only the label of the hovered body is shown (default). */
  | "hover"
  /** Every body label is always visible (round-2 behavior). */
  | "always";

interface NyxheimSettingsState {
  labelMode: LabelMode;
  setLabelMode: (mode: LabelMode) => void;
}

export const useNyxheimSettings = create<NyxheimSettingsState>()(
  persist(
    (set) => ({
      labelMode: "hover",
      setLabelMode: (labelMode) => set({ labelMode }),
    }),
    { name: "gdarko-nyxheim-settings" }
  )
);
