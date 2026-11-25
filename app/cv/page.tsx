import { FULL_NAME, JOB_TITLE, buildMetadata } from "@/lib/seo";
import { CvView } from "@/components/cv/CvView";

export const metadata = buildMetadata({
  title: "CV",
  description: `CV de ${FULL_NAME}, ${JOB_TITLE}: experiencia, proyectos, habilidades y certificaciones.`,
  path: "cv",
});

/**
 * `/cv` — option B (Gael, Ronda 7): the CV document (`CvView`),
 * identical in every era, outside the era system. The Exordia CV
 * planet's deep link is `/era/exordia/cv/`; this page is the document
 * itself, not the planet.
 */
export default function CVPage() {
  return <CvView />;
}
