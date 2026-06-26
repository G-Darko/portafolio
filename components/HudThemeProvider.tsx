"use client";

import { useEffect } from "react";
import { useColorThemeStore } from "@/lib/store/useColorThemeStore";
import { useThemeStore } from "@/lib/store/useThemeStore";

export default function HudThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const paletteId = useColorThemeStore((s) => s.paletteId);
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    document.documentElement.dataset.palette = paletteId;
  }, [paletteId]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (theme === "system") setTheme("system");
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme, setTheme]);

  return children;
}
