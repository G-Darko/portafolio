import { notFound } from "next/navigation";
import { isMissionId, isMissionProjectSlug } from "@/lib/hud/routes";
import { listMissionProjectParams } from "@/lib/data/missions";

type PageProps = {
  params: Promise<{ missionId: string; projectId: string }>;
};

export function generateStaticParams() {
  return listMissionProjectParams();
}

/** `/missions/[missionId]/[projectId]/` — shell lives in layout. */
export default async function MissionProjectPage({ params }: PageProps) {
  const { missionId, projectId } = await params;
  if (!isMissionId(missionId) || !isMissionProjectSlug(missionId, projectId)) {
    notFound();
  }
  return null;
}
