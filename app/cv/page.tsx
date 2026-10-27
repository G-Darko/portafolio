import { FULL_NAME, JOB_TITLE, buildMetadata } from "@/lib/seo";
import { CvView } from "@/components/cv/CvView";

export const metadata = buildMetadata({
  title: "CV",
  description: `CV de ${FULL_NAME}, ${JOB_TITLE}: experiencia, proyectos, habilidades y certificaciones.`,
  path: "cv",
});


export default function CVPage() {
  return <CvView />;
}
