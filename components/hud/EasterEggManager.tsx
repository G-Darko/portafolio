"use client";

import { useState, useEffect } from "react";
import { useProgressStore } from "@/lib/store/useProgressStore";

/**
 * EasterEggManager
 * Wires Konami code and rapid logo clicks, then calls unlockSecret.
 */
export default function EasterEggManager() {
  const { unlockSecret } = useProgressStore();

  useEffect(() => {
    const konami = [
      "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
      "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
      "b", "a",
    ];
    let idx = 0;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === konami[idx]) {
        idx++;
        if (idx === konami.length) {
          unlockSecret("konami");
          idx = 0;
        }
      } else {
        idx = 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [unlockSecret]);

  useEffect(() => {
    let clicks = 0;
    let timer: any;
    const handler = () => {
      clicks++;
      if (clicks >= 5) {
        unlockSecret("logo-spam");
        clearTimeout(timer);
        return;
      }
      clearTimeout(timer);
      timer = setTimeout(() => {
        clicks = 0;
      }, 2000);
    };

    // data-hud-logo attribute on the header logo
    const listener = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-hud-logo]")) handler();
    };
    document.addEventListener("click", listener);
    return () => {
      document.removeEventListener("click", listener);
      clearTimeout(timer);
    };
  }, [unlockSecret]);

  return null;
}
