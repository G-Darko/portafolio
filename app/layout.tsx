import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { MotionConfig } from "motion/react";
import "./globals.css";
import { THEME_COLOR, buildJsonLd, rootMetadata } from "@/lib/seo";
import { DEFAULT_PALETTE_ID, PALETTE_IDS } from "@/lib/theme/hud-color-presets";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  // Only weights actually used in the code (200/300/800 never appear).
  weight: ["400", "500", "600", "700", "900"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  // Dark only: the site has no light mode (round 2).
  themeColor: THEME_COLOR,
};

export const metadata: Metadata = rootMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${poppins.variable} antialiased dark`}
      data-palette={DEFAULT_PALETTE_ID}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  // Dark only: light mode was removed in round 2. The class is
                  // always on; stored values from the old light/dark toggle
                  // are ignored.
                  document.documentElement.classList.add("dark");
                  // Palette, restored from storage; the old 'skool' id
                  // migrates to 'electrico', anything unknown falls back to
                  // the violet default.
                  var allowed = ${JSON.stringify(PALETTE_IDS)};
                  var paletteRaw = localStorage.getItem("gdarko-hud-palette");
                  if (paletteRaw) {
                    var paletteState = JSON.parse(paletteRaw).state;
                    var paletteId = paletteState && paletteState.paletteId;
                    if (paletteId === "skool") paletteId = "electrico";
                    if (allowed.indexOf(paletteId) !== -1) {
                      document.documentElement.dataset.palette = paletteId;
                    }
                  }
                } catch (_) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()).replace(/</g, "\\u003c") }}
        />
      </head>
      <body className="min-h-dvh w-dvw overflow-x-hidden">
        {/* Reduced motion: motion/* animations collapse to opacity-only,
            instant fades instead of spatial movement. */}
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </body>
    </html>
  );
}
