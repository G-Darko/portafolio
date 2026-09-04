"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useHUDStore, type PanelId } from "@/lib/store/useHUDStore";
import {
  normalizePath,
  panelToHref,
  parseHudPath,
  projectSlugFromStore,
  resolveProjectId,
} from "@/lib/hud/routes";

function applyPathToStore(path: string) {
  const { panel, missionId, projectSlug, valid } = parseHudPath(path);
  if (!valid) return;

  const store = useHUDStore.getState();
  const currentSlug = projectSlugFromStore(store.activeMissionId, store.activeSubMissionId);
  const desired = normalizePath(panelToHref(panel, missionId, projectSlug));
  const current = normalizePath(
    panelToHref(store.activePanel, store.activeMissionId, currentSlug)
  );
  if (desired === current) return;

  if (panel === null) {
    store.closePanel();
    return;
  }

  if (panel === "missions" && missionId) {
    const subId = projectSlug ? resolveProjectId(missionId, projectSlug) : null;
    useHUDStore.setState({
      activePanel: "missions",
      activeMissionId: missionId,
      activeSubMissionId: subId,
    });
    return;
  }

  store.openPanel(panel);
  if (panel === "missions") store.selectMission(null);
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
  const activeSubMissionId = useHUDStore((s) => s.activeSubMissionId);
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

    const projectSlug = projectSlugFromStore(activeMissionId, activeSubMissionId);
    const href = panelToHref(activePanel, activeMissionId, projectSlug);
    const normalized = normalizePath(href);
    if (normalized === lastHref.current || normalized === path) {
      lastHref.current = normalized;
      return;
    }

    lastHref.current = normalized;
    router.push(href, { scroll: false });
  }, [
    activePanel,
    activeMissionId,
    activeSubMissionId,
    path,
    router,
    sessionActive,
    bootupDone,
  ]);

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
