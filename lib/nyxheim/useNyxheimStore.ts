/**
 * Nyxheim world state. Deliberately NOT persisted. The focus IS synced to
 * the URL (see useNyxheimRouting): every body opens by route, with browser
 * history and shareable links — the HUD store owns the session/boot gate,
 * the URL owns the world focus.
 */
import { useEffect, useState } from "react";
import { create } from "zustand";
import {
  playNavigate,
  playPanelClose,
  playWindowOpen,
} from "@/lib/audio/audio";

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

  // Cues (Cuelume, via the audio facade — never on hover): opening a body
  // blooms, traveling between bodies pages, closing droplets. The router
  // also drives focus (deep links, back/forward), which is a navigation
  // too; before the first user gesture the AudioContext is suspended and
  // play() is a silent no-op, so a deep-link load stays quiet.
  focus: (id, skillId = null) => {
    const prev = get().focusedId;
    if (prev === id && get().focusedSkillId === skillId) {
      set({ focusedId: id, focusedSkillId: skillId, overviewOpen: false });
      return;
    }
    set({ focusedId: id, focusedSkillId: skillId, overviewOpen: false });
    if (prev === null) playWindowOpen();
    else playNavigate();
  },
  focusSkill: (skillId) => {
    const { focusedId, focusedSkillId } = get();
    set({ focusedId: "sinistra", focusedSkillId: skillId, overviewOpen: false });
    if (focusedId === null) playWindowOpen();
    else if (focusedId !== "sinistra" || focusedSkillId !== skillId) playNavigate();
  },
  goOverview: () => {
    if (get().focusedId !== null) playPanelClose();
    set({ focusedId: null, focusedSkillId: null, overviewOpen: false });
  },
  toggleOverview: () => {
    const { focusedId, overviewOpen } = get();
    if (focusedId) {
      // From a body: back to the overview and open the welcome card.
      playWindowOpen();
      set({ focusedId: null, focusedSkillId: null, overviewOpen: true });
      return;
    }
    if (overviewOpen) playPanelClose();
    else playWindowOpen();
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
