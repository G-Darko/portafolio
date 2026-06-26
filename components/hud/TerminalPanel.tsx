"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "motion/react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useProgressStore } from "@/lib/store/useProgressStore";
import { useHUDStore } from "@/lib/store/useHUDStore";
import { useLocaleStore } from "@/lib/store/useLocaleStore";
import { useColorThemeStore } from "@/lib/store/useColorThemeStore";
import { playHUDClick } from "@/lib/audio/audio";
import {
  runTerminalCommand,
  getCommandSuggestions,
  type TerminalLine,
  type TerminalLineType,
} from "@/lib/game/terminalCommands";

const BOOT_DELAY_MS = 420;
const ASYNC_LINE_DELAY_MS = 180;
const SECRETS_TOTAL = 5;

function lineClass(type: TerminalLineType): string {
  switch (type) {
    case "system":
      return "text-hud-cyan";
    case "cmd":
      return "text-hud-cyan font-semibold";
    case "link":
      return "text-hud-blue underline decoration-hud-blue/40 underline-offset-2 hover:text-hud-cyan";
    case "error":
      return "text-hud-red";
    case "success":
      return "text-hud-green";
    case "warn":
      return "text-hud-amber";
    case "dim":
      return "text-muted-foreground/70";
    default:
      return "text-foreground/90";
  }
}

export default function TerminalPanel() {
  const { t, locale } = useTranslation();
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [booting, setBooting] = useState(true);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIndex, setHistIndex] = useState(-1);
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { soundEnabled, endSession, openMissionPanel, selectSubMission, openPanel } =
    useHUDStore();
  const { totalPercent, secretsFound, unlockSecret } = useProgressStore();
  const setLocale = useLocaleStore((s) => s.setLocale);
  const { paletteId, setPaletteId } = useColorThemeStore();

  const terminalStrings = useMemo(
    () => ({
      help: t.terminal.help,
      about: t.terminal.about,
      stack: t.terminal.stack,
      cv: t.terminal.cv,
      github: t.terminal.github,
      githubLabel: t.terminal.githubLabel,
      progress: t.terminal.progress,
      hack: t.terminal.hack,
      logout: t.terminal.logout,
      notFound: t.terminal.notFound,
      statusTitle: t.terminal.statusTitle,
      statusSession: t.terminal.statusSession,
      statusProgress: t.terminal.statusProgress,
      statusSecrets: t.terminal.statusSecrets,
      statusLocale: t.terminal.statusLocale,
      statusPalette: t.terminal.statusPalette,
      openUsage: t.terminal.openUsage,
      openOk: t.terminal.openOk,
      openUnknown: t.terminal.openUnknown,
      paletteUsage: t.terminal.paletteUsage,
      paletteOk: t.terminal.paletteOk,
      paletteUnknown: t.terminal.paletteUnknown,
      langUsage: t.terminal.langUsage,
      langOk: t.terminal.langOk,
      missionNotFound: t.terminal.missionNotFound,
      subNotFound: t.terminal.subNotFound,
      missionOpening: t.terminal.missionOpening,
      briefOpening: t.terminal.briefOpening,
      knightsStart: t.terminal.knightsStart,
      hackProgress: t.terminal.hackProgress,
      whoami: t.terminal.whoami,
      datePrefix: t.terminal.datePrefix,
    }),
    [t]
  );

  const appendLines = useCallback((next: TerminalLine[]) => {
    setLines((prev) => [...prev, ...next]);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines, booting]);

  useEffect(() => {
    let cancelled = false;
    const bootLines = t.terminal.boot;

    const runBoot = async () => {
      setLines([{ text: t.terminal.banner, type: "system" }]);
      for (const line of bootLines) {
        await new Promise((r) => setTimeout(r, BOOT_DELAY_MS));
        if (cancelled) return;
        appendLines([{ text: line, type: "dim" }]);
      }
      await new Promise((r) => setTimeout(r, BOOT_DELAY_MS));
      if (cancelled) return;
      appendLines([{ text: t.terminal.ready, type: "success" }, { text: "", type: "out" }]);
      setBooting(false);
      inputRef.current?.focus();
    };

    runBoot();
    return () => {
      cancelled = true;
    };
  }, [appendLines, t.terminal.banner, t.terminal.boot, t.terminal.ready]);

  const handleCmd = async (raw: string) => {
    const cmd = raw.trim();
    if (!cmd || busy) return;

    setHistory((h) => [...h, raw]);
    setHistIndex(-1);
    appendLines([{ text: cmd, type: "cmd" }]);

    const result = runTerminalCommand(raw, {
      locale,
      totalPercent,
      secretsFound: secretsFound.length,
      secretsTotal: SECRETS_TOTAL,
      paletteId,
      t: terminalStrings,
      actions: {
        endSession,
        openPanel,
        openMissionPanel,
        selectSubMission,
        unlockSecret,
        setLocale,
        setPaletteId,
      },
    });

    if (result.clear) {
      setLines([
        { text: t.terminal.banner, type: "system" },
        { text: t.terminal.ready, type: "success" },
        { text: "", type: "out" },
      ]);
      return;
    }

    if (result.asyncLines?.length) {
      setBusy(true);
      for (const batch of result.asyncLines) {
        await new Promise((r) => setTimeout(r, ASYNC_LINE_DELAY_MS));
        appendLines(batch);
      }
      appendLines([{ text: terminalStrings.hack, type: "success" }, { text: "", type: "out" }]);
      setBusy(false);
      return;
    }

    appendLines([...result.lines, { text: "", type: "out" }]);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCmd(input);
      setInput("");
      if (soundEnabled) playHUDClick();
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const suggestions = getCommandSuggestions(input.split(/\s+/)[0] ?? "");
      if (suggestions.length === 1) {
        const rest = input.includes(" ") ? input.slice(input.indexOf(" ")) : "";
        setInput(suggestions[0] + rest);
      } else if (suggestions.length > 1) {
        appendLines([
          { text: suggestions.join("  "), type: "dim" },
          { text: "", type: "out" },
        ]);
      }
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length) {
        const next = Math.min(histIndex + 1, history.length - 1);
        setHistIndex(next);
        setInput(history[history.length - 1 - next]);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIndex > 0) {
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
    <div className="hud-terminal flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-hud-border/80 bg-[oklch(0.06_0.02_240/0.95)] shadow-[inset_0_0_40px_oklch(0_0_0/0.45),0_0_24px_color-mix(in_oklch,var(--hud-cyan)_10%,transparent)]">
      <div className="flex shrink-0 items-center gap-2 border-b border-hud-border/50 bg-hud-cyan/5 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-hud-red/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-hud-amber/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-hud-green/80" />
        <span className="ml-2 truncate font-mono text-xs tracking-wide text-hud-cyan/90 md:text-sm">
          {t.terminal.windowTitle}
        </span>
        <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-hud-green/90 uppercase md:text-xs">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-hud-green shadow-[0_0_6px_var(--hud-green)]" />
          {booting ? t.terminal.connecting : t.terminal.online}
        </span>
      </div>

      <div
        ref={scrollRef}
        className="scrollbar-thin relative min-h-0 flex-1 overflow-y-auto px-3 py-3 font-mono text-sm leading-relaxed md:text-[0.925rem]"
        onClick={() => inputRef.current?.focus()}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, color-mix(in oklch, var(--hud-cyan) 15%, transparent) 2px, color-mix(in oklch, var(--hud-cyan) 15%, transparent) 4px)",
          }}
        />
        <div className="relative space-y-0.5">
          {lines.map((line, i) => (
            <motion.div
              key={`${i}-${line.text.slice(0, 12)}`}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.12 }}
              className={lineClass(line.type)}
            >
              {line.type === "cmd" ? (
                <span>
                  <span className="text-hud-green">g-darko@hud</span>
                  <span className="text-muted-foreground">:</span>
                  <span className="text-hud-blue">~</span>
                  <span className="text-muted-foreground">$ </span>
                  {line.text}
                </span>
              ) : line.href ? (
                <a href={line.href} target="_blank" rel="noopener noreferrer">
                  {line.text}
                </a>
              ) : (
                line.text || "\u00A0"
              )}
            </motion.div>
          ))}
          {booting && (
            <span className="inline-block h-4 w-2 animate-pulse bg-hud-cyan/80 align-middle" />
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-hud-border/50 bg-black/30 px-3 py-2.5">
        <div className="flex items-center gap-1 font-mono text-sm md:text-base">
          <span className="shrink-0 text-hud-green">g-darko@hud</span>
          <span className="text-muted-foreground">:</span>
          <span className="text-hud-blue">~</span>
          <span className="text-muted-foreground">$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={booting || busy}
            className="ml-1.5 min-w-0 flex-1 bg-transparent text-foreground caret-hud-cyan outline-none disabled:opacity-40"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-label="Terminal input"
          />
          {!booting && !busy && (
            <span className="h-4 w-2 shrink-0 animate-pulse bg-hud-cyan/90" />
          )}
        </div>
        <p className="mt-1.5 font-mono text-[10px] text-muted-foreground/60 md:text-xs">
          {t.terminal.hint}
        </p>
      </div>
    </div>
  );
}
