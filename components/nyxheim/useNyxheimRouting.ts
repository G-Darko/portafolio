"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useHUDStore } from "@/lib/store/useHUDStore";
import { useNyxheimStore } from "@/lib/nyxheim/useNyxheimStore";
import { bodyToHref, parseNyxheimPath } from "@/lib/nyxheim/routes";

/**
 * Syncs the Nyxheim world focus with Next.js routing, same guard pattern
 * as the old HUD routing: a `syncingFromUrl` flag so the URL → store pass
 * never echoes back as a store → URL push (no History API pushState loops,
 * no Turbopack panics).
 *
 * Every body opens by route (`/nyxheim`, `/duplica`, `/sinistra/typescript`,
 * `/erebo`, ...) with browser history and shareable deep links.
 */
export function useNyxheimRouting() {
  const router = useRouter();
  const pathname = usePathname();
  const focusedId = useNyxheimStore((s) => s.focusedId);
  const focusedSkillId = useNyxheimStore((s) => s.focusedSkillId);
  const sessionActive = useHUDStore((s) => s.sessionActive);
  const bootupDone = useHUDStore((s) => s.bootupDone);

  const syncingFromUrl = useRef(false);
  const lastHref = useRef(pathname);

  // URL → store (back/forward, deep links, soft nav, legacy redirects).
  useEffect(() => {
    if (!sessionActive && !bootupDone) return;
    const dest = parseNyxheimPath(pathname);
    if (!dest.valid) return;

    if (dest.legacyHref) {
      lastHref.current = dest.legacyHref;
      router.replace(dest.legacyHref, { scroll: false });
      return;
    }

    syncingFromUrl.current = true;
    const store = useNyxheimStore.getState();
    if (dest.bodyId) {
      if (store.focusedId !== dest.bodyId || store.focusedSkillId !== dest.skillId) {
        store.focus(dest.bodyId, dest.skillId);
      }
    } else if (store.focusedId !== null) {
      store.goOverview();
    }
    lastHref.current = pathname;
    queueMicrotask(() => {
      syncingFromUrl.current = false;
    });
  }, [pathname, sessionActive, bootupDone, router]);

  // Store → URL (click a body, dock, section nav, skill).
  useEffect(() => {
    if (!sessionActive && !bootupDone) return;
    if (syncingFromUrl.current) return;

    const href = focusedId ? bodyToHref(focusedId, focusedSkillId) : "/";
    if (href === lastHref.current || href === pathname) {
      lastHref.current = href;
      return;
    }

    lastHref.current = href;
    router.push(href, { scroll: false });
  }, [focusedId, focusedSkillId, pathname, router, sessionActive, bootupDone]);
}
