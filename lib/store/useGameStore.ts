import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GameState {
  highScore: number;
  slashCount: number;
  perfectStreak: number;
  bestStreak: number;

  addScore: (points: number, perfect: boolean) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      highScore: 0,
      slashCount: 0,
      perfectStreak: 0,
      bestStreak: 0,

      addScore: (points: number, perfect: boolean) => {
        const current = get();
        const streak = perfect ? current.perfectStreak + 1 : 0;
        const score = current.slashCount + points;
        set({
          slashCount: score,
          perfectStreak: streak,
          bestStreak: Math.max(current.bestStreak, streak),
          highScore: Math.max(current.highScore, score),
        });
      },
      resetGame: () => set({ slashCount: 0, perfectStreak: 0 }),
    }),
    { name: "stark-hud-game" }
  )
);
