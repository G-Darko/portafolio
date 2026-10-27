import { PANEL_TITLES, buildMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { PANEL_PATHS } from "@/lib/hud/routes";



type PageProps = {
  params: Promise<{ panel: string }>;
};

/** `missions` has its own folder; exclude it from this dynamic segment. */
const PANEL_SEGMENTS = Object.values(PANEL_PATHS).filter((p) => p !== "missions");
const VALID = new Set(PANEL_SEGMENTS);

export function generateStaticParams() {
  return PANEL_SEGMENTS.map((panel) => ({ panel }));
}

export async function generateMetadata({ params }: PageProps) {
  const { panel } = await params;
  return buildMetadata({ title: PANEL_TITLES[panel] ?? panel, path: panel });
}

/** Panel routes like `/profile/` — shell lives in layout. */
export default async function PanelPage({ params }: PageProps) {
  const { panel } = await params;
  if (!VALID.has(panel as (typeof PANEL_SEGMENTS)[number])) {
    notFound();
  }
  return null;
}
