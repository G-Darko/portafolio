import { create } from "zustand";
import { persist } from "zustand/middleware";
import { totalSubmissions } from "@/lib/data/missions";

interface ProgressState {
  readSubmissions: string[];
  completedMissions: string[];
  secretsFound: string[];
  realPercent: number;
  secretPercent: number;
  totalPercent: number;
  markRead: (id: string) => void;
  completeMission: (missionId: string) => void;
  unlockSecret: (id: string) => void;
  resetProgress: () => void;
}

function computePercentages(
  read: string[],
  secrets: string[]
): { real: number; secret: number; total: number } {
  const real = Math.min(100, (read.length / totalSubmissions) * 100);
  const secret = (secrets.length / 5) * 10;
  return {
    real: Math.round(real),
    secret: Math.round(secret),
    total: Math.round(Math.min(100, real + secret)),
  };
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      readSubmissions: [],
      completedMissions: [],
      secretsFound: [],
      realPercent: 0,
      secretPercent: 0,
      totalPercent: 0,

      markRead: (id: string) => {
        const current = get().readSubmissions;
        if (current.includes(id)) return;
        const next = [...current, id];
        const { real, secret, total } = computePercentages(next, get().secretsFound);
        set({
          readSubmissions: next,
          realPercent: real,
          secretPercent: secret,
          totalPercent: total,
        });
      },

      completeMission: (missionId: string) => {
        const current = get().completedMissions;
        if (current.includes(missionId)) return;
        set({ completedMissions: [...current, missionId] });
      },

      unlockSecret: (id: string) => {
        const current = get().secretsFound;
        if (current.includes(id)) return;
        const next = [...current, id];
        const { real, secret, total } = computePercentages(get().readSubmissions, next);
        set({
          secretsFound: next,
          realPercent: real,
          secretPercent: secret,
          totalPercent: total,
        });
      },

      resetProgress: () =>
        set({
          readSubmissions: [],
          completedMissions: [],
          secretsFound: [],
          realPercent: 0,
          secretPercent: 0,
          totalPercent: 0,
        }),
    }),
    { name: "gdarko-hud-progress" }
  )
);
