import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { MotionConfig } from "motion/react";
import "./globals.css";
import { THEME_COLOR, buildJsonLd, rootMetadata } from "@/lib/seo";

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
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: THEME_COLOR },
    { media: "(prefers-color-scheme: light)", color: "#f7f7f7" },
  ],
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
      data-palette="default"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var paletteRaw = localStorage.getItem("gdarko-hud-palette");
                  if (paletteRaw) {
                    var paletteState = JSON.parse(paletteRaw).state;
                    if (paletteState && paletteState.paletteId) {
                      document.documentElement.dataset.palette = paletteState.paletteId;
                    }
                  }
                  var themeRaw = localStorage.getItem("gdarko-hud-theme");
                  if (themeRaw) {
                    var themeState = JSON.parse(themeRaw).state;
                    var theme = themeState && themeState.theme ? themeState.theme : "dark";
                    var dark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
                    document.documentElement.classList.toggle("dark", dark);
                    return;
                  }
                  document.documentElement.classList.add("dark");
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
