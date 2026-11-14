import { buildMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { listSinistraSkillParams } from "@/lib/nyxheim/routes";
import { buildSkills } from "@/lib/data/skills";

type PageProps = {
  params: Promise<{ skill: string }>;
};

/** `/sinistra/<skill>/` — a technology opens its star in the constellation. */
export function generateStaticParams() {
  return listSinistraSkillParams();
}

export async function generateMetadata({ params }: PageProps) {
  const { skill } = await params;
  const found = buildSkills.find((s) => s.id === skill);
  return buildMetadata({
    title: found ? `${found.name} — Sinistra` : "Sinistra",
    path: `sinistra/${skill}`,
  });
}

export default async function SinistraSkillPage({ params }: PageProps) {
  const { skill } = await params;
  if (!buildSkills.some((s) => s.id === skill)) {
    notFound();
  }
  return null;
}
