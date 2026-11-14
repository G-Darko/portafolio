import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "dark" | "light" | "system";

interface ThemeState {
  theme: Theme;
  resolved: "dark" | "light";
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
}

// Dark only: light mode was removed in round 2. Whatever was stored, the
// site renders dark; the old theme toggle is gone.
function resolveTheme(): "dark" {
  return "dark";
}

function applyThemeClass() {
  if (typeof document === "undefined") return;
  // Always dark: never remove the class.
  document.documentElement.classList.add("dark");
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "dark",
      resolved: "dark",
      setTheme: (t) => {
        // The theme is always dark now; stored values are ignored.
        const resolved = "dark" as const;
        set({ theme: "dark", resolved });
        applyThemeClass();
      },
      toggleTheme: () => {
        // No-op: there is no light mode to switch to anymore.
      },
    }),
    {
      name: "gdarko-hud-theme",
      onRehydrateStorage: () => (state) => {
        if (state && typeof window !== "undefined") {
          const resolved = resolveTheme();
          state.resolved = resolved;
          applyThemeClass();
        }
      },
    }
  )
);
