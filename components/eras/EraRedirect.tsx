"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Client-side redirect for a static export (no server redirects):
 * a URL that belongs to another era (e.g. `/missions` while Exordia is
 * active) lands here and is replaced with its era URL
 * (`/era/hud/missions/`). Rendered as a static page so the redirect
 * actually exists in the export.
 */
export function EraRedirect({ to }: { to: string }) {
  const router = useRouter();
  useEffect(() => {
    router.replace(to);
  }, [router, to]);
  return null;
}
