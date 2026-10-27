import { buildMetadata } from "@/lib/seo";
import { getMissionById, getSubMissionBySlug } from "@/lib/data/missions";
import { notFound } from "next/navigation";
import { isMissionId, isMissionProjectSlug } from "@/lib/hud/routes";
import { listMissionProjectParams } from "@/lib/data/missions";



type PageProps = {
  params: Promise<{ missionId: string; projectId: string }>;
};

export function generateStaticParams() {
  return listMissionProjectParams();
}

export async function generateMetadata({ params }: PageProps) {
  const { missionId, projectId } = await params;
  const sm = getSubMissionBySlug(missionId, projectId);
  const title = sm ? `${sm.title.es} ? ${getMissionById(missionId)?.title.es ?? ""}`.replace(/ ? $/, "") : undefined;
  return buildMetadata({ title, description: sm?.description.es, path: `missions/${missionId}/${projectId}` });
}

/** `/missions/[missionId]/[projectId]/` — shell lives in layout. */
export default async function MissionProjectPage({ params }: PageProps) {
  const { missionId, projectId } = await params;
  if (!isMissionId(missionId) || !isMissionProjectSlug(missionId, projectId)) {
    notFound();
  }
  return null;
}
