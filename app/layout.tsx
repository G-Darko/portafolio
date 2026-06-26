import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Gael Uribe | Portafolio",
  description:
    "Portafolio de Gael Uribe (G-Darko), desarrollador web e Ingeniero en Tecnologías de la Información.",
  keywords: [
    "Gael Uribe",
    "G-Darko",
    "G Darko",
    "portafolio",
    "desarrollador web",
    "Vue",
    "Laravel",
    "HTML",
    "CSS",
    "JavaScript",
  ],
  authors: [{ name: "Gael Uribe" }],
  icons: {
    icon: "/img/DARKO.png",
    shortcut: "/img/DARKO.png",
    apple: "/img/DARKO.png",
  },
  openGraph: {
    title: "Portafolio | G-Darko",
    description:
      "Mira el portafolio de Gael Uribe, desarrollador web con experiencia en Vue, Laravel y más.",
    images: "https://G-Darko.github.io/portafolio/img/DARKO.png",
    url: "https://G-Darko.github.io/portafolio/",
    type: "website",
  },
};

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
      </head>
      <body className="min-h-dvh w-dvw overflow-x-hidden">{children}</body>
    </html>
  );
}
