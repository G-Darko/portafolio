"use client";

import PortfolioApp from "@/components/PortfolioApp";

/**
 * Persistent HUD shell across /profile, /missions, etc.
 * The page slot only exists so static export can emit shareable HTML;
 * UI lives here so soft navigations never remount the orb/header.
 */
export default function HudLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PortfolioApp />
      <div hidden aria-hidden>
        {children}
      </div>
    </>
  );
}
