import { buildMetadata, destinationDescription, metaDescription } from "@/lib/seo";
import { notFound } from "next/navigation";
import { destinationTitle, listNyxheimParams } from "@/lib/nyxheim/routes";
import { getProjectBodyBySlug } from "@/lib/nyxheim/bodies";
import { getSubMissionBySlug } from "@/lib/data/missions";
import { getSubMissionCopy } from "@/lib/i18n/missionContent";

type PageProps = {
  params: Promise<{ panel: string }>;
};

/**
 * Every Nyxheim destination is a static route (`/nyxheim`, `/duplica`,
 * `/sinistra`, `/erebo`, ...). Legacy HUD paths (`/profile`,
 * `/missions/...`, `/skills`, ...) do not exist and do not redirect.
 */
const VALID = new Set<string>(listNyxheimParams().map((p) => p.panel));

export function generateStaticParams() {
  return [...VALID].map((panel) => ({ panel }));
}

export async function generateMetadata({ params }: PageProps) {
  const { panel } = await params;
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
  if (!VALID.has(panel)) {
    notFound();
  }
  return null;
}
