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

/**
 * On a touch device there is no hover, so the round-6 default ("hover")
 * leaves every planet anonymous in the overview. First visit on a
 * coarse pointer starts with labels always visible instead; an explicit
 * choice in Settings is persisted and always wins over this default.
 * Module scope, not render: the store is created once per session and
 * the pointer type does not change while the page is open.
 */
export function isCoarsePointer(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(pointer: coarse)").matches
  );
}

export const useNyxheimSettings = create<NyxheimSettingsState>()(
  persist(
    (set) => ({
      labelMode: isCoarsePointer() ? "always" : "hover",
      setLabelMode: (labelMode) => set({ labelMode }),
    }),
    { name: "gdarko-nyxheim-settings" }
  )
);
