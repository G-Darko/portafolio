import { buildMetadata } from "@/lib/seo";
import NotFoundView from "@/components/NotFoundView";

export const metadata = buildMetadata({ title: "Página no encontrada" });

export default function NotFound() {
  return <NotFoundView />;
}
