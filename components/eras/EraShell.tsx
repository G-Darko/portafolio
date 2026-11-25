"use client";

import { useParams } from "next/navigation";
import PortfolioApp from "@/components/PortfolioApp";
import HudEraApp from "@/components/eras/hud/HudEraApp";
import LegacyEraApp from "@/components/eras/legacy/LegacyEraApp";
import { isEraId, type EraId } from "@/lib/eras";

/**
 * Era shell (Ronda 7, fix del header legacy que se quedaba al viajar).
 *
 * Why this is a client component: the era layout
 * (`app/era/[era]/layout.tsx`) is a server component that branches on
 * `params.era`, but App Router layouts are preserved across client-side
 * navigations between routes that share the layout — the layout does
 * not re-render when only the dynamic param changes. Navigating
 * `/era/legacy/` → `/era/hud/` therefore kept the layout's cached
 * render (`<LegacyEraApp />`, with its sticky `z-[3000]` header)
 * mounted while only the page slot (which returns null) swapped.
 *
 * This shell reads the era from `useParams()` instead, which updates
 * on every client-side navigation, and renders the era app with a
 * `key={era}` so React unmounts the outgoing era completely (header,
 * fixed chip, listeners, intervals) and mounts the incoming one.
 * The server-rendered `era` prop is the fallback for the first render
 * (identical to what `useParams()` returns then, so no hydration
 * mismatch); after that, the live param wins.
 */
export default function EraShell({ era: serverEra }: { era: EraId }) {
  const params = useParams();
  const raw = params.era;
  const liveEra: EraId | null =
    typeof raw === "string" && isEraId(raw) ? raw : null;
  const era = liveEra ?? serverEra;

  if (era === "hud") {
    return <HudEraApp key="hud" />;
  }
  if (era === "legacy") {
    return <LegacyEraApp key="legacy" />;
  }
  return <PortfolioApp key="exordia" />;
}
