"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  CONSTELLATION_STARS,
  SINISTRA_CENTER,
  getNyxheimBody,
  liveBodyObjects,
  liveStarPositions,
  readBodyPosition,
} from "@/lib/nyxheim/bodies";
import { useNyxheimStore } from "@/lib/nyxheim/useNyxheimStore";

/** World units the focused body shifts left when its panel is open on desktop. */
const PANEL_SHIFT = 2.6;
const MIN_PHI = 0.2;
const MAX_PHI = 2.8;
/** Free-flight bounds: how far the target may drift from the system. */
const MAX_PAN = 48;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

const MOVE_KEYS = new Set(["KeyW", "KeyA", "KeyS", "KeyD", "KeyQ", "KeyE"]);
const ARROW_TO_KEY: Record<string, string> = {
  ArrowUp: "KeyW",
  ArrowDown: "KeyS",
  ArrowLeft: "KeyA",
  ArrowRight: "KeyD",
};

export function NyxheimCameraRig({ reduced }: { reduced: boolean }) {
  const camera = useThree((s) => s.camera);
  const gl = useThree((s) => s.gl);
  const size = useThree((s) => s.size);
  const focusedId = useNyxheimStore((s) => s.focusedId);
  const focusedSkillId = useNyxheimStore((s) => s.focusedSkillId);
  const focus = useNyxheimStore((s) => s.focus);

  const sph = useRef({ radius: 34, theta: -0.6, phi: 1.12 });
  const goal = useRef({ radius: 34, theta: -0.6, phi: 1.12 });
  const focusCur = useRef(new THREE.Vector3(0, 0, 0));
  const shiftCur = useRef(0);
  /** Free-flight offset from the focused body (or the origin): panning and
      WASD/arrows move this, the orbit still turns around it. */
  const targetOffset = useRef(new THREE.Vector3(0, 0, 0));
  const pointers = useRef(new Map<number, { x: number; y: number; button: number }>());
  const downAt = useRef({ x: 0, y: 0, t: 0 });
  const movedRef = useRef(false);
  const pinchDist = useRef(0);
  const pinchMid = useRef({ x: 0, y: 0 });
  const keysHeld = useRef(new Set<string>());
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const tmpFocus = useMemo(() => new THREE.Vector3(), []);
  const tmpRight = useMemo(() => new THREE.Vector3(), []);
  const tmpForward = useMemo(() => new THREE.Vector3(), []);
  const tmpLook = useMemo(() => new THREE.Vector3(), []);
  const tmpMove = useMemo(() => new THREE.Vector3(), []);
  const tmpUp = useMemo(() => new THREE.Vector3(0, 1, 0), []);

  // Focus change: pick a camera distance for the new target, and reset the
  // free-flight offset so every destination starts centered.
  useEffect(() => {
    targetOffset.current.set(0, 0, 0);
    if (!focusedId) {
      goal.current.radius = 34;
      goal.current.phi = 1.12;
      return;
    }
    if (focusedId === "sinistra") {
      goal.current.radius = 16;
      goal.current.phi = 1.2;
      return;
    }
    const body = getNyxheimBody(focusedId);
    goal.current.radius = body ? clamp(body.size * 4.6, 7, 18) : 12;
    goal.current.phi = 1.2;
  }, [focusedId]);

  // WASD / arrows / Q-E free flight. Ignored while typing in a field.
  useEffect(() => {
    const isTyping = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      return !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable);
    };
    const onDown = (e: KeyboardEvent) => {
      if (isTyping(e)) return;
      const key = MOVE_KEYS.has(e.code) ? e.code : ARROW_TO_KEY[e.code];
      if (!key) return;
      e.preventDefault();
      keysHeld.current.add(key);
    };
    const onUp = (e: KeyboardEvent) => {
      const key = MOVE_KEYS.has(e.code) ? e.code : ARROW_TO_KEY[e.code];
      if (key) keysHeld.current.delete(key);
    };
    const onBlur = () => keysHeld.current.clear();
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  // Drag / wheel / pinch / pan on the canvas element.
  useEffect(() => {
    const el = gl.domElement;

    const onDown = (e: PointerEvent) => {
      el.setPointerCapture(e.pointerId);
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY, button: e.button });
      if (pointers.current.size === 1) {
        downAt.current = { x: e.clientX, y: e.clientY, t: performance.now() };
        movedRef.current = false;
      } else if (pointers.current.size === 2) {
        const [a, b] = [...pointers.current.values()];
        pinchDist.current = Math.hypot(a.x - b.x, a.y - b.y);
        pinchMid.current = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      }
    };

    const panByPixels = (dx: number, dy: number) => {
      // Screen-space pan: move the target opposite to the drag, in the
      // camera's right/up plane, scaled by distance so it feels constant.
      tmpForward.copy(focusCur.current).sub(camera.position).normalize();
      tmpRight.crossVectors(tmpForward, camera.up).normalize();
      const scale = (sph.current.radius * 0.0016) / Math.max(1, size.width / 1000);
      targetOffset.current
        .addScaledVector(tmpRight, -dx * scale)
        .addScaledVector(camera.up, dy * scale);
      if (targetOffset.current.length() > MAX_PAN) {
        targetOffset.current.setLength(MAX_PAN);
      }
    };

    const onMove = (e: PointerEvent) => {
      const prev = pointers.current.get(e.pointerId);
      if (!prev) return;
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY, button: prev.button });
      if (pointers.current.size === 1) {
        const dx = e.clientX - prev.x;
        const dy = e.clientY - prev.y;
        if (Math.abs(e.clientX - downAt.current.x) + Math.abs(e.clientY - downAt.current.y) > 6) {
          movedRef.current = true;
        }
        // Right-drag (or middle-drag) pans; left-drag orbits.
        if (prev.button === 2 || prev.button === 1) {
          panByPixels(dx, dy);
          return;
        }
        goal.current.theta -= dx * 0.005;
        goal.current.phi = clamp(goal.current.phi - dy * 0.005, MIN_PHI, MAX_PHI);
      } else if (pointers.current.size === 2) {
        const [a, b] = [...pointers.current.values()];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        if (pinchDist.current > 0 && dist > 0) {
          goal.current.radius = clamp(goal.current.radius * (pinchDist.current / dist), 4, 70);
        }
        // Two-finger drag pans by the midpoint travel.
        panByPixels(mid.x - pinchMid.current.x, mid.y - pinchMid.current.y);
        pinchDist.current = dist;
        pinchMid.current = mid;
      }
    };

    const findBodyId = (obj: THREE.Object3D | null): string | null => {
      let o: THREE.Object3D | null = obj;
      while (o) {
        for (const [id, root] of liveBodyObjects) {
          if (root === o) return id;
        }
        o = o.parent;
      }
      return null;
    };

    const onUp = (e: PointerEvent) => {
      const wasClick =
        pointers.current.size === 1 &&
        !movedRef.current &&
        performance.now() - downAt.current.t < 500;
      const button = pointers.current.get(e.pointerId)?.button ?? 0;
      pointers.current.delete(e.pointerId);
      // Only a short left click focuses a body; right/middle clicks pan.
      if (!wasClick || button !== 0) return;
      // Tap on a body: raycast and fly to it. The sun is not registered
      // (it does nothing on click), so it never matches here.
      const rect = el.getBoundingClientRect();
      const ndc = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObjects([...liveBodyObjects.values()], true);
      if (hits.length > 0) {
        const id = findBodyId(hits[0].object);
        if (id) focus(id);
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      goal.current.radius = clamp(goal.current.radius * Math.exp(e.deltaY * 0.001), 4, 70);
    };

    const onContextMenu = (e: Event) => e.preventDefault();

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("contextmenu", onContextMenu);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("contextmenu", onContextMenu);
    };
  }, [gl, camera, focus, raycaster, size]);

  useFrame((_, delta) => {
    if (typeof document !== "undefined" && document.hidden) return;

    // Focus point: live position of the focused body, a Sinistra star, or
    // the origin for the overview — plus the free-flight offset.
    if (focusedId === "sinistra") {
      const starIdx = focusedSkillId
        ? CONSTELLATION_STARS.findIndex((s) => s.id === focusedSkillId)
        : -1;
      const anchor = starIdx >= 0 ? liveStarPositions[starIdx] : liveStarPositions[0];
      if (anchor) tmpFocus.copy(anchor);
      else tmpFocus.set(SINISTRA_CENTER[0], SINISTRA_CENTER[1], SINISTRA_CENTER[2]);
    } else if (focusedId) {
      if (!readBodyPosition(focusedId, tmpFocus)) tmpFocus.set(0, 0, 0);
    } else {
      tmpFocus.set(0, 0, 0);
    }
    tmpFocus.add(targetOffset.current);

    // WASD / arrows / Q-E: fly the target in the camera-relative plane.
    if (keysHeld.current.size > 0 && !reduced) {
      const speed = sph.current.radius * 0.55 * Math.min(delta, 0.05);
      const boost = 2.2;
      tmpForward.copy(tmpFocus).sub(camera.position);
      tmpForward.y = 0;
      tmpForward.normalize();
      tmpRight.crossVectors(tmpForward, tmpUp).normalize();
      tmpMove.set(0, 0, 0);
      const k = keysHeld.current;
      if (k.has("KeyW")) tmpMove.add(tmpForward);
      if (k.has("KeyS")) tmpMove.sub(tmpForward);
      if (k.has("KeyD")) tmpMove.add(tmpRight);
      if (k.has("KeyA")) tmpMove.sub(tmpRight);
      if (k.has("KeyE")) tmpMove.y += 1;
      if (k.has("KeyQ")) tmpMove.y -= 1;
      if (tmpMove.lengthSq() > 0) {
        tmpMove.normalize().multiplyScalar(speed * boost);
        targetOffset.current.add(tmpMove);
        if (targetOffset.current.length() > MAX_PAN) {
          targetOffset.current.setLength(MAX_PAN);
        }
        tmpFocus.add(tmpMove);
      }
    }

    // Ease (or snap under reduced motion) toward the goals.
    const k = reduced ? 1 : 1 - Math.exp(-Math.min(delta, 0.05) * 3.2);
    focusCur.current.lerp(tmpFocus, k);
    sph.current.radius += (goal.current.radius - sph.current.radius) * k;
    sph.current.theta += (goal.current.theta - sph.current.theta) * k;
    sph.current.phi += (goal.current.phi - sph.current.phi) * k;
    const shiftGoal = focusedId && size.width >= 1024 ? 1 : 0;
    shiftCur.current += (shiftGoal - shiftCur.current) * k;

    const { radius, theta, phi } = sph.current;
    const sinPhi = Math.sin(phi);
    camera.position.set(
      focusCur.current.x + radius * sinPhi * Math.sin(theta),
      focusCur.current.y + radius * Math.cos(phi),
      focusCur.current.z + radius * sinPhi * Math.cos(theta)
    );

    // Look slightly to the right of the body on desktop so the open panel
    // does not cover it: the body ends up left of center.
    tmpForward.copy(focusCur.current).sub(camera.position).normalize();
    tmpRight.crossVectors(tmpForward, camera.up).normalize();
    tmpLook.copy(focusCur.current).addScaledVector(tmpRight, shiftCur.current * PANEL_SHIFT);
    camera.lookAt(tmpLook);
  });

  return null;
}
