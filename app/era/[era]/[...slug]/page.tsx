import { buildMetadata, destinationDescription, metaDescription, skillDescription } from "@/lib/seo";
import { notFound } from "next/navigation";
import { getEra } from "@/lib/eras";
import { listEraNyxheimParams, listSinistraSkillParams, destinationTitle } from "@/lib/nyxheim/routes";
import { getProjectBodyBySlug } from "@/lib/nyxheim/bodies";
import { getSubMissionBySlug, getMissionById, listMissionParams, listMissionProjectParams } from "@/lib/data/missions";
import { getSubMissionCopy } from "@/lib/i18n/missionContent";
import { translations } from "@/lib/i18n/translations";
import { PANEL_PATHS, isMissionId, isMissionProjectSlug } from "@/lib/hud/routes";
import { buildSkills } from "@/lib/data/skills";

type PageProps = {
  params: Promise<{ era: string; slug: string[] }>;
};

/**
 * Deep links of an era (`/era/exordia/duplica`, `/era/hud/missions`,
 * `/era/hud/missions/<id>/<project>`, `/era/exordia/sinistra/<skill>`).
 * The shell lives in the era layout; these pages only validate + set
 * metadata. Canonicals (plan §2.5):
 * - `/era/exordia/<panel>` → its root twin (`/<panel>/`) while Exordia
 *   is the active era; `/era/exordia/cv` has no root twin (option B:
 *   `/cv` is the document), so its canonical is its own URL.
 * - `/era/hud/...` → always its own URL.
 */
export function generateStaticParams() {
  const params: { era: string; slug: string[] }[] = [];
  for (const panel of listEraNyxheimParams()) {
    params.push({ era: "exordia", slug: [panel.panel] });
  }
  for (const { skill } of listSinistraSkillParams()) {
    params.push({ era: "exordia", slug: ["sinistra", skill] });
  }
  for (const panel of Object.values(PANEL_PATHS)) {
    params.push({ era: "hud", slug: [panel] });
  }
  for (const { missionId } of listMissionParams()) {
    params.push({ era: "hud", slug: ["missions", missionId] });
  }
  for (const { missionId, projectId } of listMissionProjectParams()) {
    params.push({ era: "hud", slug: ["missions", missionId, projectId] });
  }
  return params;
}

function isValidSlug(era: string, slug: string[]): boolean {
  if (era === "exordia") {
    if (slug.length === 1) {
      return listEraNyxheimParams().some((p) => p.panel === slug[0]);
    }
    if (slug.length === 2 && slug[0] === "sinistra") {
      return buildSkills.some((s) => s.id === slug[1]);
    }
    return false;
  }
  if (era === "hud") {
    if (slug.length === 1) {
      return Object.values(PANEL_PATHS).includes(slug[0]);
    }
    if (slug.length === 2 && slug[0] === "missions") {
      return isMissionId(slug[1]);
    }
    if (slug.length === 3 && slug[0] === "missions") {
      return isMissionId(slug[1]) && isMissionProjectSlug(slug[1], slug[2]);
    }
    return false;
  }
  return false;
}

export async function generateMetadata({ params }: PageProps) {
  const { era, slug } = await params;
  if (!getEra(era) || !isValidSlug(era, slug)) return buildMetadata();

  if (era === "exordia") {
    const [first, second] = slug;
    if (first === "sinistra" && second) {
      const found = buildSkills.find((s) => s.id === second);
      return buildMetadata({
        title: found ? `${found.name} — Sinistra` : "Sinistra",
        description: found ? skillDescription(found) : undefined,
        path: `sinistra/${second}`,
      });
    }
    if (first === "cv") {
      // No root twin: /cv is the CV document (option B).
      return buildMetadata({
        title: "CV",
        description: destinationDescription("cv"),
        path: "era/exordia/cv",
      });
    }
    const project = getProjectBodyBySlug(first);
    if (project) {
      const copy = getSubMissionCopy("es", getSubMissionBySlug(project.missionId!, project.projectSlug!)!);
      return buildMetadata({
        title: copy.title,
        description: metaDescription(copy.description),
        path: first,
      });
    }
    const title = destinationTitle(first) ?? first;
    return buildMetadata({ title, description: destinationDescription(first), path: first });
  }

  // HUD era: canonical is always the era URL itself.
  const path = `era/hud/${slug.join("/")}`;
  const header = translations.es.header;
  if (slug[0] === "missions" && slug[1]) {
    const mission = getMissionById(slug[1]);
    if (slug[2]) {
      const sub = getSubMissionBySlug(slug[1], slug[2]);
      const title = sub
        ? `${sub.title.es} | ${mission?.title.es ?? ""}`.replace(/ \| $/, "")
        : undefined;
      return buildMetadata({ title, description: sub?.description.es, path });
    }
    return buildMetadata({ title: mission?.title.es, description: mission?.description.es, path });
  }
  const panelTitle =
    (header as Record<string, string>)[slug[0] === "minigame" ? "minigame" : slug[0]] ?? slug[0];
  return buildMetadata({ title: panelTitle, path });
}

/** Era deep links — the shell lives in the era layout. */
export default async function EraDeepPage({ params }: PageProps) {
  const { era, slug } = await params;
  if (!getEra(era) || !isValidSlug(era, slug)) {
    notFound();
  }
  return null;
}
