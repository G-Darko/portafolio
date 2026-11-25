import { buildMetadata, destinationDescription, metaDescription } from "@/lib/seo";
import { notFound } from "next/navigation";
import { destinationTitle, listNyxheimParams } from "@/lib/nyxheim/routes";
import { getProjectBodyBySlug } from "@/lib/nyxheim/bodies";
import { getSubMissionBySlug } from "@/lib/data/missions";
import { getSubMissionCopy } from "@/lib/i18n/missionContent";
import { ACTIVE_ERA_ID } from "@/lib/eras";
import { PANEL_PATHS, panelToHref } from "@/lib/hud/routes";
import type { PanelId } from "@/lib/store/useHUDStore";
import { EraRedirect } from "@/components/eras/EraRedirect";

type PageProps = {
  params: Promise<{ panel: string }>;
};

/**
 * Root destinations of the ACTIVE era (Ronda 7): the valid set derives
 * from `ACTIVE_ERA_ID` — today Exordia, so every Nyxheim destination is
 * a static route (`/nyxheim`, `/duplica`, `/sinistra`, `/erebo`, ...).
 * `/cv` is not here: since option B it is the CV document
 * (`app/cv/page.tsx`), which wins over this dynamic route.
 *
 * Segments that belong to another era (today: the HUD panels
 * `/missions`, `/profile`, ...) are also emitted as static pages, but
 * they render a client redirect to their era URL (`/era/hud/...`):
 * the static export has no server redirects, so the page itself has to
 * exist for the redirect to run. They are noindexed with canonical to
 * the era URL, and they never enter the sitemap.
 */
const VALID = new Set<string>(listNyxheimParams().map((p) => p.panel));

/** Root segments owned by a non-active era → their era URL. */
const FOREIGN: Record<string, string> =
  ACTIVE_ERA_ID === "hud"
    ? {}
    : Object.fromEntries(
        Object.values(PANEL_PATHS).map((panel) => [panel, panelToHref(panel as PanelId, null, null)])
      );

export function generateStaticParams() {
  return [...VALID, ...Object.keys(FOREIGN)].map((panel) => ({ panel }));
}

export async function generateMetadata({ params }: PageProps) {
  const { panel } = await params;
  if (FOREIGN[panel]) {
    // Noindex + canonical to the era URL (the page only redirects).
    return buildMetadata({ title: panel, path: FOREIGN[panel].replace(/^\/|\/$/g, ""), noindex: true });
  }
  const project = getProjectBodyBySlug(panel);
  if (project) {
    const copy = getSubMissionCopy("es", getSubMissionBySlug(project.missionId!, project.projectSlug!)!);
    return buildMetadata({ title: copy.title, description: metaDescription(copy.description), path: panel });
  }
  const title = destinationTitle(panel) ?? panel;
  return buildMetadata({ title, description: destinationDescription(panel), path: panel });
}

/** Destination routes — the shell lives in (hud)/layout. */
export default async function PanelPage({ params }: PageProps) {
  const { panel } = await params;
  if (FOREIGN[panel]) {
    return <EraRedirect to={FOREIGN[panel]} />;
  }
  if (!VALID.has(panel)) {
    notFound();
  }
  return null;
}
