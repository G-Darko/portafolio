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
    if (typeof window === "undefined") return "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return theme;
}

function applyThemeClass(resolved: "dark" | "light") {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (resolved === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "system",
      resolved: "dark",
      setTheme: (t) => {
        const resolved = typeof window !== "undefined" ? resolveTheme(t) : "dark";
        set({ theme: t, resolved });
        applyThemeClass(resolved);
      },
      toggleTheme: () => {
        const current = get().resolved;
        const next = current === "dark" ? "light" : "dark";
        set({ theme: next, resolved: next });
        applyThemeClass(next);
      },
    }),
    {
      name: "stark-hud-theme",
      onRehydrateStorage: () => (state) => {
        if (state && typeof window !== "undefined") {
          const resolved = resolveTheme(state.theme);
          state.resolved = resolved;
          applyThemeClass(resolved);
        }
      },
    }
  )
);
