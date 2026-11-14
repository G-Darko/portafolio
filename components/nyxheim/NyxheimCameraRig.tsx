"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
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

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export function NyxheimCameraRig({ reduced }: { reduced: boolean }) {
  const camera = useThree((s) => s.camera);
  const gl = useThree((s) => s.gl);
  const size = useThree((s) => s.size);
  const focusedId = useNyxheimStore((s) => s.focusedId);
  const focus = useNyxheimStore((s) => s.focus);

  const sph = useRef({ radius: 34, theta: -0.6, phi: 1.12 });
  const goal = useRef({ radius: 34, theta: -0.6, phi: 1.12 });
  const focusCur = useRef(new THREE.Vector3(0, 0, 0));
  const shiftCur = useRef(0);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const downAt = useRef({ x: 0, y: 0, t: 0 });
  const movedRef = useRef(false);
  const pinchDist = useRef(0);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const tmpFocus = useMemo(() => new THREE.Vector3(), []);
  const tmpRight = useMemo(() => new THREE.Vector3(), []);
  const tmpForward = useMemo(() => new THREE.Vector3(), []);
  const tmpLook = useMemo(() => new THREE.Vector3(), []);

  // Focus change: pick a camera distance for the new target.
  useEffect(() => {
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

  // Drag / wheel / pinch on the canvas element.
  useEffect(() => {
    const el = gl.domElement;

    const onDown = (e: PointerEvent) => {
      el.setPointerCapture(e.pointerId);
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.current.size === 1) {
        downAt.current = { x: e.clientX, y: e.clientY, t: performance.now() };
        movedRef.current = false;
      } else if (pointers.current.size === 2) {
        const [a, b] = [...pointers.current.values()];
        pinchDist.current = Math.hypot(a.x - b.x, a.y - b.y);
      }
    };

    const onMove = (e: PointerEvent) => {
      const prev = pointers.current.get(e.pointerId);
      if (!prev) return;
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.current.size === 1) {
        const dx = e.clientX - prev.x;
        const dy = e.clientY - prev.y;
        if (Math.abs(e.clientX - downAt.current.x) + Math.abs(e.clientY - downAt.current.y) > 6) {
          movedRef.current = true;
        }
        goal.current.theta -= dx * 0.005;
        goal.current.phi = clamp(goal.current.phi - dy * 0.005, MIN_PHI, MAX_PHI);
      } else if (pointers.current.size === 2) {
        const [a, b] = [...pointers.current.values()];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinchDist.current > 0 && dist > 0) {
          goal.current.radius = clamp(goal.current.radius * (pinchDist.current / dist), 4, 70);
        }
        pinchDist.current = dist;
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
      pointers.current.delete(e.pointerId);
      if (!wasClick) return;
      // Tap on a body: raycast and fly to it.
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

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("wheel", onWheel);
    };
  }, [gl, camera, focus, raycaster]);

  useFrame((_, delta) => {
    if (typeof document !== "undefined" && document.hidden) return;

    // Focus point: live position of the focused body, a star of Sinistra,
    // or the origin for the overview.
    if (focusedId === "sinistra") {
      const anchor = liveStarPositions[0];
      if (anchor) tmpFocus.copy(anchor);
      else tmpFocus.set(SINISTRA_CENTER[0], SINISTRA_CENTER[1], SINISTRA_CENTER[2]);
    } else if (focusedId) {
      if (!readBodyPosition(focusedId, tmpFocus)) tmpFocus.set(0, 0, 0);
    } else {
      tmpFocus.set(0, 0, 0);
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
