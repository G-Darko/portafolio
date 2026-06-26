"use client";

import { useRef, useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useProgressStore } from "@/lib/store/useProgressStore";
import { useHUDStore } from "@/lib/store/useHUDStore";
import { playHUDClick } from "@/lib/audio/audio";

export default function TerminalPanel() {
  const { t } = useTranslation();
  const [lines, setLines] = useState<{ text: string; type: "system" | "cmd" | "out" | "link" | "error" }[]>([
    { text: "G-DARKO HUD Terminal v3.0", type: "system" },
    { text: t.terminal.help[0], type: "system" },
    { text: "", type: "out" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIndex, setHistIndex] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { soundEnabled, endSession } = useHUDStore();
  const { totalPercent, unlockSecret } = useProgressStore();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const push = (text: string, type: "out" | "link" | "error" = "out") => {
    setLines((prev) => [...prev, { text, type }, { text: "", type: "out" }]);
  };

  const handleCmd = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    setHistory((h) => [...h, raw]);
    setHistIndex(-1);
    setLines((prev) => [...prev, { text: `> ${raw}`, type: "cmd" }]);

    if (cmd === "clear") {
      setLines([{ text: "G-DARKO HUD Terminal v3.0", type: "system" }, { text: "", type: "out" }]);
      return;
    }

    if (cmd === "hack") {
      push(t.terminal.hack, "out");
      unlockSecret("terminal-hack");
      if (soundEnabled) playHUDClick();
      return;
    }

    if (cmd === "cv") {
      push(t.terminal.cv, "out");
      setTimeout(() => window.open("cv", "_blank"), 300);
      return;
    }

    if (cmd === "progress") {
      push(`${t.terminal.progress}: ${totalPercent}%`, "out");
      return;
    }

    if (cmd === "help") {
      t.terminal.help.forEach((line) => push(line, "out"));
      return;
    }

    if (cmd === "about") {
      push(t.terminal.about, "out");
      return;
    }

    if (cmd === "stack") {
      push(t.terminal.stack, "out");
      return;
    }

    if (cmd === "github") {
      push(t.terminal.github, "link");
      return;
    }

    if (cmd === "logout" || cmd === "exit" || cmd === "restart") {
      push(t.terminal.logout, "out");
      setTimeout(() => endSession(), 600);
      return;
    }

    push(t.terminal.notFound.replace("{cmd}", raw), "error");
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

  const lineColor = (type: string) => {
    switch (type) {
      case "system": return "text-hud-cyan";
      case "cmd": return "text-hud-cyan";
      case "link": return "text-hud-blue underline";
      case "error": return "text-hud-red";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="flex h-full flex-col rounded-lg border border-hud-border bg-hud-bg/70 p-3 backdrop-blur-xl"
    >
      <div ref={scrollRef} className="scrollbar-thin mb-2 flex-1 overflow-y-auto font-mono text-xs">
        {lines.map((line, i) => (
          <div key={i} className={`leading-relaxed ${lineColor(line.type)}`}>
            {line.type === "link" ? (
              <a href={line.text} target="_blank" rel="noopener noreferrer" className="underline">
                {line.text}
              </a>
            ) : (
              line.text
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 border-t border-hud-border pt-2 font-mono text-xs">
        <span className="text-hud-green">→</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          className="flex-1 bg-transparent text-foreground outline-none"
          autoFocus
          spellCheck={false}
        />
      </div>
    </div>
  );
}
