import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "dark" | "light" | "system";

interface ThemeState {
  theme: Theme;
  resolved: "dark" | "light";
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
}

function resolveTheme(theme: Theme): "dark" | "light" {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return theme;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "system",
      resolved: "dark",
      setTheme: (t) => {
        const resolved = typeof window !== "undefined" ? resolveTheme(t) : "dark";
        set({ theme: t, resolved });
        if (typeof document !== "undefined") {
          document.documentElement.classList.remove("dark", "light");
          document.documentElement.classList.add(resolved);
        }
      },
      toggleTheme: () => {
        const current = get().theme;
        const next = current === "dark" ? "light" : "dark";
        get().setTheme(next);
      },
    }),
    {
      name: "stark-hud-theme",
      onRehydrateStorage: () => (state) => {
        if (state && typeof window !== "undefined") {
          const resolved = resolveTheme(state.theme);
          state.resolved = resolved;
          document.documentElement.classList.remove("dark", "light");
          document.documentElement.classList.add(resolved);
        }
      },
    }
  )
);
