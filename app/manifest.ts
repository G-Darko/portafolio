import type { MetadataRoute } from "next";
import { DEFAULT_DESCRIPTION, FULL_NAME, THEME_COLOR } from "@/lib/seo";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${FULL_NAME} | Portafolio`,
    short_name: "G-Darko",
    description: DEFAULT_DESCRIPTION,
    id: "/",
    start_url: "/",
    display: "standalone",
    lang: "es-MX",
    background_color: THEME_COLOR,
    theme_color: THEME_COLOR,
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    categories: ["portfolio", "technology"],
  };
}