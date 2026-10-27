import { buildMetadata } from "@/lib/seo";
import { getMissionById } from "@/lib/data/missions";
import { notFound } from "next/navigation";
import { isMissionId } from "@/lib/hud/routes";
import { listMissionParams } from "@/lib/data/missions";



type PageProps = {
  params: Promise<{ missionId: string }>;
};

export function generateStaticParams() {
  return listMissionParams();
}

export async function generateMetadata({ params }: PageProps) {
  const { missionId } = await params;
  const m = getMissionById(missionId);
  return buildMetadata({ title: m?.title.es, description: m?.description.es, path: `missions/${missionId}` });
}

/** `/missions/[missionId]/` — shell lives in layout. */
export default async function MissionPage({ params }: PageProps) {
  const { missionId } = await params;
  if (!isMissionId(missionId)) notFound();
  return null;
}
