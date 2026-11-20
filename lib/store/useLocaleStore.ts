import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Locale } from "@/lib/data/api";

export type { Locale };

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

/** Keep <html lang> in sync so screen readers and search engines see the
    active language (the attribute is also restored pre-hydration in
    app/layout.tsx). */
function applyHtmlLang(l: Locale) {
  if (typeof document !== "undefined") {
    document.documentElement.lang = l;
  }
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set, get) => ({
      locale: detectLocale(),
      setLocale: (l) => {
        applyHtmlLang(l);
        set({ locale: l });
      },
      toggleLocale: () => {
        const next = get().locale === "es" ? "en" : "es";
        applyHtmlLang(next);
        set({ locale: next });
      },
    }),
    {
      name: "gdarko-hud-locale",
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const detected = detectLocale();
        if (!state.locale) state.locale = detected;
        applyHtmlLang(state.locale);
      },
    }
  )
);
