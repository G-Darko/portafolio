import { buildMetadata } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ACTIVE_ERA_ID, ERAS, getEra, type EraId } from "@/lib/eras";

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
  if (!def.hasContent) {
    // LEGACY placeholder until PR-2: own canonical, noindex.
    return buildMetadata({
      title: `${def.name} (en restauración)`,
      description: `La era ${def.name} del portafolio de Gael Uribe (${def.years}) está en restauración.`,
      path: `era/${era}`,
      noindex: true,
    });
  }
  return buildMetadata({
    title: def.name,
    description: `El portafolio de Gael Uribe en su era ${def.name} (${def.years}).`,
    path: `era/${era}`,
  });
}

/**
 * `/era/<era>/` — the era home. Exordia and HUD render their shell from
 * the era layout (this slot stays empty, like the root pages); LEGACY
 * renders an explicit placeholder until PR-2 restores it.
 */
export default async function EraHomePage({ params }: PageProps) {
  const { era } = await params;
  const def = getEra(era);
  if (!def) notFound();
  if (def.hasContent) return null;
  return <LegacyPlaceholder eraId={def.id} years={def.years} />;
}

/** LEGACY placeholder (PR-2 will replace this with the restored era). */
function LegacyPlaceholder({ eraId, years }: { eraId: EraId; years: string }) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-[#0a0a0a] px-6 text-center text-[#e2e8f0]">
      <p className="font-mono text-xs tracking-[0.5em] text-[#94a3b8] uppercase">Tultitlán</p>
      <h1 className="font-mono text-4xl font-bold tracking-[0.3em]">LEGACY</h1>
      <p className="font-mono text-sm tracking-[0.35em] text-[#22d3ee]">{years}</p>
      <p className="max-w-md text-base leading-relaxed text-[#94a3b8]">
        El primer portafolio: HTML, CSS y JavaScript, 2022–2026. En restauración: la era{" "}
        {eraId.toUpperCase()} vuelve en la Ronda 7 (PR-2).
      </p>
      <Link
        href="/"
        className="mt-2 rounded-full border border-[#22d3ee]/60 px-5 py-2.5 font-mono text-sm font-bold text-[#22d3ee] transition-colors hover:bg-[#22d3ee]/10"
      >
        ← Viajar a EXORDIA
      </Link>
    </main>
  );
}
