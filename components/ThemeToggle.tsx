"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (light) {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
  }, [light]);

  return (
    <button
      onClick={() => setLight((v) => !v)}
      className="ml-4 flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white shadow-md transition-all hover:scale-110 active:scale-95"
      aria-label="Toggle theme"
    >
      {light ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
