"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useProgressStore } from "@/lib/store/useProgressStore";
import { useHUDStore } from "@/lib/store/useHUDStore";
import { playHUDClick } from "@/lib/audio/audio";

const COMMANDS: Record<string, string | string[]> = {
  help: [
    "Available commands:",
    "  about       — brief summary",
    "  stack       — tech stack list",
    "  cv          — link to CV",
    "  github      — open GitHub",
    "  linkedin    — open LinkedIn",
    "  progress    — current completion",
    "  hack        — ???",
    "  clear       — clear terminal",
  ],
  about: "G-Darko — Full-stack engineer. Next.js | React Native | Laravel | Linux. Building SaaS and mobile experiences.",
  stack: "Next.js, React Native, Expo, Astro, Vue, Laravel, Tailwind, Three.js, PostgreSQL, MySQL, Firebird, Linux, Docker.",
  cv: "Opening CV... ⌘",
  github: "https://github.com/G-Darko",
  linkedin: "https://linkedin.com",
  progress: "Calculating...",
  hack: "Access granted. Secret subsystem enabled.",
};

export default function TerminalPanel() {
  const [lines, setLines] = useState<string[]>([
    "G-DARKO HUD Terminal v3.0",
    "Type 'help' for available commands.",
    "",
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIndex, setHistIndex] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { soundEnabled } = useHUDStore();
  const { totalPercent, unlockSecret } = useProgressStore();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const push = (msg: string | string[]) => {
    setLines((prev) => [...prev, ...(Array.isArray(msg) ? msg : [msg]), ""]);
  };

  const handleCmd = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    setHistory((h) => [...h, raw]);
    setHistIndex(-1);

    setLines((prev) => [...prev, `> ${raw}`]);

    if (cmd === "clear") {
      setLines(["G-DARKO HUD Terminal v3.0", ""]);
      return;
    }

    if (cmd === "hack") {
      push(COMMANDS.hack);
      unlockSecret("terminal-hack");
      if (soundEnabled) playHUDClick();
      return;
    }

    if (cmd === "cv") {
      push(COMMANDS.cv);
      setTimeout(() => window.open("/cv", "_blank"), 300);
      return;
    }

    if (cmd === "progress") {
      push(`Portfolio completion: ${totalPercent}%`);
      return;
    }

    if (cmd.startsWith("http")) {
      window.open(cmd, "_blank");
      return;
    }

    if (COMMANDS[cmd]) {
      push(COMMANDS[cmd]);
    } else {
      push(`Command not found: "${raw}". Type 'help' for list.`);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCmd(input);
      setInput("");
      if (soundEnabled) playHUDClick();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length) {
        const next = Math.min(histIndex + 1, history.length - 1);
        setHistIndex(next);
        setInput(history[history.length - 1 - next]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIndex > 0 && history.length) {
        const next = histIndex - 1;
        setHistIndex(next);
        setInput(history[history.length - 1 - next]);
      } else {
        setHistIndex(-1);
        setInput("");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex h-full flex-col rounded-lg border p-3"
      style={{
        borderColor: "var(--glass-border)",
        background: "rgba(8,12,18,0.7)",
      }}
    >
      <div ref={scrollRef} className="scrollbar-thin mb-2 flex-1 overflow-y-auto font-mono text-xs">
        {lines.map((line, i) => (
          <div key={i} style={{ color: line.startsWith(">") ? "var(--c1)" : line.startsWith("https://") ? "#0df8f9" : "var(--accent)" }} className="leading-relaxed">
            {line.startsWith("https://") ? (
              <a href={line} target="_blank" rel="noopener noreferrer" className="underline">
                {line}
              </a>
            ) : (
              line
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 border-t pt-2 font-mono text-xs" style={{ borderColor: "var(--glass-border)" }}>
        <span style={{ color: "var(--hud-green)" }}>→</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          className="flex-1 bg-transparent outline-none"
          style={{ color: "var(--text)" }}
          autoFocus
          spellCheck={false}
        />
      </div>
    </motion.div>
  );
}
