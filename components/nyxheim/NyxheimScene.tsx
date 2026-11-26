"use client";

import { Stars } from "@react-three/drei";
import { NyxheimBodies } from "./NyxheimBodies";
import { NyxheimCameraRig } from "./NyxheimCameraRig";

/** Thin orbit guides for the main orbits (readability, not to scale). */
const ORBIT_RINGS = [6.5, 8.5, 11, 13.5, 15, 18.5, 36];

export function NyxheimScene({ reduced }: { reduced: boolean }) {
  return (
    <>
      <color attach="background" args={["#05070d"]} />
      <fog attach="fog" args={["#05070d", 70, 160]} />
      {/* The sun is the key light (its point light lives on the sun
          mesh, with distance falloff): the ambient and the directional
          are only a faint fill, so the night side of every planet is
          actually dark and the terminator reads. Flat even light was
          half of the plastic look. */}
      <ambientLight intensity={0.22} />
      <directionalLight position={[20, 30, 10]} intensity={0.12} color="#cfe8ff" />
      <Stars radius={90} depth={40} count={2500} factor={3} saturation={0} fade speed={reduced ? 0 : 0.5} />
      {ORBIT_RINGS.map((r) => (
        <mesh key={r} rotation-x={Math.PI / 2} position={[0, 0, 0]}>
          <ringGeometry args={[r - 0.03, r + 0.03, 128]} />
          <meshBasicMaterial color="#67e8f9" transparent opacity={0.1} side={2} />
        </mesh>
      ))}
      <NyxheimBodies reduced={reduced} />
      <NyxheimCameraRig reduced={reduced} />
    </>
  );
}
