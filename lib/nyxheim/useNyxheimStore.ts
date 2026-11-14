/**
 * Nyxheim world state. Deliberately NOT persisted and NOT synced to the
 * URL: the world is the home view, and focusing a body must not unmount
 * it or push a history entry (the HUD store owns panels + routing).
 */
import { useEffect, useState } from "react";
import { create } from "zustand";

interface NyxheimState {
  /** Focused body id, or null for the overview. */
  focusedId: string | null;
  /** Hovered body id (labels, dock, constellation stars). */
  hoveredId: string | null;
  /** Skill id highlighted in the constellation (hovered in the panel). */
  hoveredSkillId: string | null;

  focus: (id: string) => void;
  goOverview: () => void;
  setHovered: (id: string | null) => void;
  setHoveredSkill: (id: string | null) => void;
}

export const useNyxheimStore = create<NyxheimState>()((set) => ({
  focusedId: null,
  hoveredId: null,
  hoveredSkillId: null,

  focus: (id) => set({ focusedId: id }),
  goOverview: () => set({ focusedId: null }),
  setHovered: (id) => set({ hoveredId: id }),
  setHoveredSkill: (id) => set({ hoveredSkillId: id }),
}));

/** Live `prefers-reduced-motion` flag, same pattern as TechSphere. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}
