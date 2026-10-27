"use client";

import { FULL_NAME, JOB_TITLE } from "@/lib/seo";
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
      <h1 className="sr-only">
        {FULL_NAME} | {JOB_TITLE}
      </h1>
      <PortfolioApp />
      <div hidden aria-hidden>
        {children}
      </div>
    </>
  );
}
