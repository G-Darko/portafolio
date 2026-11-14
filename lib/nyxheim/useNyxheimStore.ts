/**
 * Nyxheim world state. Deliberately NOT persisted. The focus IS synced to
 * the URL (see useNyxheimRouting): every body opens by route, with browser
 * history and shareable links — the HUD store owns the session/boot gate,
 * the URL owns the world focus.
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
  /** Skill the camera is flying to inside Sinistra (deep link / click). */
  focusedSkillId: string | null;
  /** The welcome card (Exordia) is born closed; it opens from the top bar. */
  overviewOpen: boolean;

  focus: (id: string, skillId?: string | null) => void;
  focusSkill: (skillId: string) => void;
  goOverview: () => void;
  toggleOverview: () => void;
  setHovered: (id: string | null) => void;
  setHoveredSkill: (id: string | null) => void;
}

export const useNyxheimStore = create<NyxheimState>()((set, get) => ({
  focusedId: null,
  hoveredId: null,
  hoveredSkillId: null,
  focusedSkillId: null,
  overviewOpen: false,

  focus: (id, skillId = null) =>
    set({ focusedId: id, focusedSkillId: skillId, overviewOpen: false }),
  focusSkill: (skillId) =>
    set({ focusedId: "sinistra", focusedSkillId: skillId, overviewOpen: false }),
  goOverview: () => set({ focusedId: null, focusedSkillId: null, overviewOpen: false }),
  toggleOverview: () => {
    const { focusedId, overviewOpen } = get();
    if (focusedId) {
      // From a body: back to the overview and open the welcome card.
      set({ focusedId: null, focusedSkillId: null, overviewOpen: true });
      return;
    }
    set({ overviewOpen: !overviewOpen });
  },
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
