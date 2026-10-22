import { notFound } from "next/navigation";
import { isMissionId } from "@/lib/hud/routes";
import { listMissionParams } from "@/lib/data/missions";

type PageProps = {
  params: Promise<{ missionId: string }>;
};

export function generateStaticParams() {
  return listMissionParams();
}

/** `/missions/[missionId]/` — shell lives in layout. */
export default async function MissionPage({ params }: PageProps) {
  const { missionId } = await params;
  if (!isMissionId(missionId)) notFound();
  return null;
}
