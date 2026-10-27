import type { MetadataRoute } from "next";
import { SITE_URL, listSitePaths } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return listSitePaths().map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : path === "/cv/" ? 0.8 : 0.6,
  }));
}