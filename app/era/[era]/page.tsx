import { buildMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { ACTIVE_ERA_ID, ERAS, getEra } from "@/lib/eras";

type PageProps = {
  params: Promise<{ era: string }>;
};

export function generateStaticParams() {
  return ERAS.map((era) => ({ era: era.id }));
}

export async function generateMetadata({ params }: PageProps) {
  const { era } = await params;
  const def = getEra(era);
  if (!def) return buildMetadata();
  if (era === ACTIVE_ERA_ID) {
    // Explicit URL of the active era: same content as `/` — noindex,
    // canonical to the root.
    return buildMetadata({ title: def.name, path: "/", noindex: true });
  }
  return buildMetadata({
    title: def.name,
    description: `El portafolio de Gael Uribe en su era ${def.name} (${def.years}).`,
    path: `era/${era}`,
  });
}

/**
 * `/era/<era>/` — the era home. Every era renders its shell from the
 * era layout; this slot stays empty (like the root pages).
 */
export default async function EraHomePage({ params }: PageProps) {
  const { era } = await params;
  const def = getEra(era);
  if (!def) notFound();
  return null;
}
