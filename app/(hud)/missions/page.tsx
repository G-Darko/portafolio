import { PANEL_TITLES, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: PANEL_TITLES.missions, path: "missions" });

/** `/missions/` — shell lives in (hud)/layout.tsx */
export default function MissionsIndexPage() {
  return null;
}
