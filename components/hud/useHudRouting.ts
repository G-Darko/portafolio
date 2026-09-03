"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useHUDStore, type PanelId } from "@/lib/store/useHUDStore";
import { normalizePath, panelToHref, parseHudPath } from "@/lib/hud/routes";

function applyPathToStore(path: string) {
  const { panel, missionId, valid } = parseHudPath(path);
  if (!valid) return;

  const desired = normalizePath(panelToHref(panel, missionId));
  const current = normalizePath(
    panelToHref(
      useHUDStore.getState().activePanel,
      useHUDStore.getState().activeMissionId
    )
  );
  if (desired === current) return;

  if (panel === null) {
    useHUDStore.getState().closePanel();
  } else if (panel === "missions" && missionId) {
    useHUDStore.getState().openMissionPanel(missionId);
  } else {
    useHUDStore.getState().openPanel(panel);
    if (panel === "missions") useHUDStore.getState().selectMission(null);
  }
}

/**
 * Syncs HUD panels with Next.js routing. The shell lives in (hud)/layout so
 * soft navigations only swap empty page slots — no History API pushState
 * (Next patches it and that caused navigation loops + Turbopack panics).
 */
export function useHudRouting() {
  const router = useRouter();
  const pathname = usePathname();
  const path = normalizePath(pathname);
  const activePanel = useHUDStore((s) => s.activePanel);
  const activeMissionId = useHUDStore((s) => s.activeMissionId);
  const togglePanel = useHUDStore((s) => s.togglePanel);
  const closePanel = useHUDStore((s) => s.closePanel);
  const sessionActive = useHUDStore((s) => s.sessionActive);
  const bootupDone = useHUDStore((s) => s.bootupDone);

  const syncingFromUrl = useRef(false);
  const lastHref = useRef(path);

  // Restart → home
  useEffect(() => {
    if (sessionActive || bootupDone) return;
    if (path === "/" || path.startsWith("/cv")) return;
    lastHref.current = "/";
    router.replace("/", { scroll: false });
  }, [sessionActive, bootupDone, path, router]);

  // URL → store (back/forward, deep links, soft nav)
  useEffect(() => {
    if (!sessionActive && !bootupDone) return;
    syncingFromUrl.current = true;
    applyPathToStore(path);
    lastHref.current = path;
    queueMicrotask(() => {
      syncingFromUrl.current = false;
    });
  }, [path, sessionActive, bootupDone]);

  // Store → URL
  useEffect(() => {
    if (!sessionActive && !bootupDone) return;
    if (syncingFromUrl.current) return;

    const href = panelToHref(activePanel, activeMissionId);
    const normalized = normalizePath(href);
    if (normalized === lastHref.current || normalized === path) {
      lastHref.current = normalized;
      return;
    }

    lastHref.current = normalized;
    router.push(href, { scroll: false });
  }, [activePanel, activeMissionId, path, router, sessionActive, bootupDone]);

  const togglePanelNav = useCallback(
    (id: PanelId) => {
      togglePanel(id);
    },
    [togglePanel]
  );

  const goHome = useCallback(() => {
    closePanel();
  }, [closePanel]);

  return { togglePanelNav, goHome, pathname: path };
}
