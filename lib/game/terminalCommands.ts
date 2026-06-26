import { missions, getMissionById, type MissionId } from "@/lib/data/missions";
import { getMissionCopy } from "@/lib/i18n/missionContent";
import { HUD_PALETTES, type HudPaletteId } from "@/lib/theme/hud-color-presets";
import type { PanelId } from "@/lib/store/useHUDStore";
import type { Locale } from "@/lib/store/useLocaleStore";

export type TerminalLineType =
  | "system"
  | "cmd"
  | "out"
  | "link"
  | "error"
  | "success"
  | "dim"
  | "warn";

export interface TerminalLine {
  text: string;
  type: TerminalLineType;
  href?: string;
}

export interface TerminalStrings {
  help: readonly string[];
  about: string;
  stack: string;
  cv: string;
  github: string;
  githubLabel: string;
  progress: string;
  hack: string;
  logout: string;
  notFound: string;
  statusTitle: string;
  statusSession: string;
  statusProgress: string;
  statusSecrets: string;
  statusLocale: string;
  statusPalette: string;
  openUsage: string;
  openOk: string;
  openUnknown: string;
  paletteUsage: string;
  paletteOk: string;
  paletteUnknown: string;
  langUsage: string;
  langOk: string;
  missionNotFound: string;
  subNotFound: string;
  missionOpening: string;
  briefOpening: string;
  knightsStart: string;
  hackProgress: readonly string[];
  whoami: string;
  datePrefix: string;
}

export interface TerminalActions {
  endSession: () => void;
  openPanel: (id: PanelId) => void;
  openMissionPanel: (id: MissionId) => void;
  selectSubMission: (id: string | null) => void;
  unlockSecret: (id: string) => void;
  setLocale: (locale: Locale) => void;
  setPaletteId: (id: HudPaletteId) => void;
}

export interface TerminalContext {
  locale: Locale;
  totalPercent: number;
  secretsFound: number;
  secretsTotal: number;
  paletteId: HudPaletteId;
  t: TerminalStrings;
  actions: TerminalActions;
}

const OPEN_PANELS: PanelId[] = [
  "profile",
  "missions",
  "skills",
  "certifications",
  "contact",
  "minigame",
  "terminal",
];

const COMMAND_NAMES = [
  "help",
  "about",
  "stack",
  "cv",
  "github",
  "progress",
  "missions",
  "mission",
  "brief",
  "knights",
  "hack",
  "logout",
  "restart",
  "exit",
  "clear",
  "status",
  "open",
  "lang",
  "palette",
  "whoami",
  "date",
  "cls",
];

export function getCommandSuggestions(prefix: string): string[] {
  const p = prefix.trim().toLowerCase();
  if (!p) return COMMAND_NAMES;
  return COMMAND_NAMES.filter((c) => c.startsWith(p));
}

export function runTerminalCommand(
  raw: string,
  ctx: TerminalContext
): { lines: TerminalLine[]; clear?: boolean; asyncLines?: TerminalLine[][] } {
  const cmd = raw.trim();
  if (!cmd) return { lines: [] };

  const lower = cmd.toLowerCase();
  const parts = lower.split(/\s+/);
  const head = parts[0];

  if (head === "clear" || head === "cls") {
    return { lines: [], clear: true };
  }

  if (head === "help") {
    return {
      lines: ctx.t.help.map((line) => ({ text: line, type: "out" as const })),
    };
  }

  if (head === "about") {
    return { lines: [{ text: ctx.t.about, type: "out" }] };
  }

  if (head === "stack") {
    return { lines: [{ text: ctx.t.stack, type: "out" }] };
  }

  if (head === "whoami") {
    return { lines: [{ text: ctx.t.whoami, type: "success" }] };
  }

  if (head === "date") {
    const stamp = new Date().toLocaleString(ctx.locale === "es" ? "es-MX" : "en-US", {
      dateStyle: "full",
      timeStyle: "medium",
    });
    return { lines: [{ text: `${ctx.t.datePrefix} ${stamp}`, type: "out" }] };
  }

  if (head === "cv") {
    setTimeout(() => window.open("/cv", "_blank"), 300);
    return { lines: [{ text: ctx.t.cv, type: "success" }] };
  }

  if (head === "github") {
    return {
      lines: [
        { text: ctx.t.githubLabel, type: "link", href: ctx.t.github },
      ],
    };
  }

  if (head === "progress") {
    return {
      lines: [
        {
          text: `${ctx.t.progress}: ${ctx.totalPercent}%`,
          type: "success",
        },
      ],
    };
  }

  if (head === "status") {
    return {
      lines: [
        { text: ctx.t.statusTitle, type: "system" },
        { text: ctx.t.statusSession, type: "success" },
        { text: `${ctx.t.statusProgress}: ${ctx.totalPercent}%`, type: "out" },
        {
          text: `${ctx.t.statusSecrets}: ${ctx.secretsFound}/${ctx.secretsTotal}`,
          type: "out",
        },
        { text: `${ctx.t.statusLocale}: ${ctx.locale.toUpperCase()}`, type: "out" },
        { text: `${ctx.t.statusPalette}: ${ctx.paletteId}`, type: "out" },
      ],
    };
  }

  if (head === "logout" || head === "exit" || head === "restart") {
    setTimeout(() => ctx.actions.endSession(), 600);
    return { lines: [{ text: ctx.t.logout, type: "warn" }] };
  }

  if (head === "missions") {
    return {
      lines: missions.map((m) => {
        const copy = getMissionCopy(ctx.locale, m);
        return {
          text: `[${m.rank}] ${m.id} — ${copy.codename}`,
          type: "out" as const,
        };
      }),
    };
  }

  if (head === "mission" && parts[1]) {
    const id = parts[1] as MissionId;
    const mission = getMissionById(id);
    if (!mission) {
      return {
        lines: [{ text: `${ctx.t.missionNotFound}: ${id}`, type: "error" }],
      };
    }
    ctx.actions.openMissionPanel(id);
    return {
      lines: [
        {
          text: `${ctx.t.missionOpening} ${getMissionCopy(ctx.locale, mission).codename}...`,
          type: "success",
        },
      ],
    };
  }

  if (head === "brief" && parts[1]) {
    const subId = parts.slice(1).join(" ");
    for (const m of missions) {
      const sm = m.subMissions.find(
        (s) => s.id === subId || s.id.replace(/-/g, "") === subId.replace(/-/g, "")
      );
      if (sm) {
        ctx.actions.openMissionPanel(m.id);
        ctx.actions.selectSubMission(sm.id);
        return {
          lines: [{ text: `${ctx.t.briefOpening}: ${sm.id}`, type: "success" }],
        };
      }
    }
    return {
      lines: [{ text: `${ctx.t.subNotFound}: ${subId}`, type: "error" }],
    };
  }

  if (head === "knights") {
    ctx.actions.unlockSecret("knights-slash");
    ctx.actions.openPanel("minigame");
    return { lines: [{ text: ctx.t.knightsStart, type: "warn" }] };
  }

  if (head === "hack") {
    ctx.actions.unlockSecret("terminal-hack");
    return {
      lines: [],
      asyncLines: ctx.t.hackProgress.map((line, i) => [
        {
          text: line,
          type: (i === ctx.t.hackProgress.length - 1 ? "success" : "dim") as TerminalLineType,
        },
      ]),
    };
  }

  if (head === "open") {
    const target = parts[1] as PanelId | undefined;
    if (!target || !OPEN_PANELS.includes(target)) {
      return { lines: [{ text: ctx.t.openUsage, type: "warn" }] };
    }
    ctx.actions.openPanel(target);
    return {
      lines: [{ text: `${ctx.t.openOk}: ${target}`, type: "success" }],
    };
  }

  if (head === "lang" && parts[1]) {
    const next = parts[1] as Locale;
    if (next !== "es" && next !== "en") {
      return { lines: [{ text: ctx.t.langUsage, type: "warn" }] };
    }
    ctx.actions.setLocale(next);
    return {
      lines: [{ text: `${ctx.t.langOk}: ${next.toUpperCase()}`, type: "success" }],
    };
  }

  if (head === "palette") {
    if (!parts[1]) {
      const list = HUD_PALETTES.map((p) => p.id).join(", ");
      return {
        lines: [
          { text: ctx.t.paletteUsage, type: "warn" },
          { text: list, type: "dim" },
        ],
      };
    }
    const id = parts[1] as HudPaletteId;
    if (!HUD_PALETTES.some((p) => p.id === id)) {
      return { lines: [{ text: ctx.t.paletteUnknown, type: "error" }] };
    }
    ctx.actions.setPaletteId(id);
    return { lines: [{ text: `${ctx.t.paletteOk}: ${id}`, type: "success" }] };
  }

  return {
    lines: [{ text: ctx.t.notFound.replace("{cmd}", raw), type: "error" }],
  };
}
