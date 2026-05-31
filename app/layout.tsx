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
      className={`${poppins.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh w-dvw overflow-x-hidden">{children}</body>
    </html>
  );
}
