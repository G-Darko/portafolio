import { buildMetadata } from "@/lib/seo";
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
 * `/sinistra`, `/erebo`, ...) plus the legacy HUD paths, which stay emitted
 * so old shared links mount the shell and redirect to their new home.
 */
const LEGACY_SEGMENTS = [
  "profile",
  "missions",
  "skills",
  "certifications",
  "contact",
  "terminal",
  "minigame",
];

const VALID = new Set<string>([
  ...listNyxheimParams().map((p) => p.panel),
  ...LEGACY_SEGMENTS,
]);

export function generateStaticParams() {
  return [...VALID].map((panel) => ({ panel }));
}

export async function generateMetadata({ params }: PageProps) {
  const { panel } = await params;
  const project = getProjectBodyBySlug(panel);
  const title = project
    ? getSubMissionCopy("es", getSubMissionBySlug(project.missionId!, project.projectSlug!)!).title
    : (destinationTitle(panel) ?? panel);
  return buildMetadata({ title, path: panel });
}

/** Destination routes — the shell lives in (hud)/layout. */
export default async function PanelPage({ params }: PageProps) {
  const { panel } = await params;
  if (!VALID.has(panel)) {
    notFound();
  }
  return null;
}
