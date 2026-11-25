import { FULL_NAME, JOB_TITLE } from "@/lib/seo";
import PortfolioApp from "@/components/PortfolioApp";
import HudEraApp from "@/components/eras/hud/HudEraApp";

/**
 * Layout for the explicit era routes (`/era/<era>/...`, Ronda 7).
 * Each era renders its own shell; the page slot only exists so the
 * static export can emit shareable HTML (same pattern as the root
 * `(hud)/layout.tsx`). LEGACY has no shell yet (PR-2): its placeholder
 * page renders as the slot content.
 */
export default async function EraLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ era: string }>;
}) {
  const { era } = await params;

  if (era === "hud") {
    return (
      <>
        <h1 className="sr-only">
          {FULL_NAME} | {JOB_TITLE}
        </h1>
        <HudEraApp />
        <div hidden aria-hidden>
          {children}
        </div>
      </>
    );
  }

  if (era === "exordia") {
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

  return <>{children}</>;
}
