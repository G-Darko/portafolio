import { create } from "zustand";
import { persist } from "zustand/middleware";

type Locale = "es" | "en";

interface LocaleState {
  locale: Locale;
  setLocale: (l: Locale) => void;
  toggleLocale: () => void;
}

function detectLocale(): Locale {
  if (typeof navigator === "undefined") return "es";
  const lang = navigator.language.toLowerCase();
  return lang.startsWith("es") ? "es" : "en";
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set, get) => ({
      locale: detectLocale(),
      setLocale: (l) => set({ locale: l }),
      toggleLocale: () =>
        set({ locale: get().locale === "es" ? "en" : "es" }),
    }),
    {
      name: "gdarko-hud-locale",
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const detected = detectLocale();
        if (!state.locale) state.locale = detected;
      },
    }
  )
);
