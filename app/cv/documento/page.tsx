import { FULL_NAME, JOB_TITLE, buildMetadata } from "@/lib/seo";
import { CvView } from "@/components/cv/CvView";

export const metadata = buildMetadata({
  title: "CV — Documento",
  description: `CV de ${FULL_NAME}, ${JOB_TITLE}: experiencia, proyectos, habilidades y certificaciones.`,
  // Alias of /cv (option B): same document, canonical to /cv.
  path: "cv",
});


export default function CVPage() {
  return <CvView />;
}
