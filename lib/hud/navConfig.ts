import type { PanelId } from "@/lib/store/useHUDStore";

export type PrimaryPanelLabelKey = "profile" | "missions" | "contact";
export type MorePanelLabelKey = "skills" | "certifications" | "terminal" | "minigame";

export const PRIMARY_PANELS: { id: PanelId; labelKey: PrimaryPanelLabelKey }[] = [
  { id: "profile", labelKey: "profile" },
  { id: "missions", labelKey: "missions" },
  { id: "contact", labelKey: "contact" },
];

export const MORE_PANELS: { id: PanelId; labelKey: MorePanelLabelKey }[] = [
  { id: "skills", labelKey: "skills" },
  { id: "certifications", labelKey: "certifications" },
  { id: "terminal", labelKey: "terminal" },
  { id: "minigame", labelKey: "minigame" },
];

/** Panels that terminal `open <id>` can launch. */
export const OPENABLE_PANELS: PanelId[] = [
  ...PRIMARY_PANELS.map((p) => p.id),
  ...MORE_PANELS.map((p) => p.id),
];
