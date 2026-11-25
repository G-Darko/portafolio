/**
 * Aspect-aware camera framing for Exordia (Ronda 7, plan §4).
 *
 * Desktop and wide screens (aspect >= ~1.2) keep the exact round-6
 * framing: fov 50, overview radius 34, focus radius
 * clamp(size * 4.6, 7, 18), Sinistra 16. Portrait phones pull the
 * camera back and open the fov, so the system reads as a system
 * instead of a cropped ball — and a focused body fits with its ring
 * and a neighbour visible instead of filling the whole screen.
 *
 * Pure functions of the viewport aspect, so the framing can be
 * reasoned about (and screenshotted) without running the scene.
 */

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

/** 0 on wide screens, 1 on a 390px portrait phone. */
export function portraitAmount(aspect: number): number {
  return 1 - clamp(aspect / 1.2, 0, 1);
}

/** Vertical fov: 50 on desktop, up to 62 in portrait. */
export function framingFov(aspect: number): number {
  return 50 + portraitAmount(aspect) * 12;
}

/**
 * Overview distance: 34 on desktop, up to ~75 in portrait. At 390px
 * (aspect 0.46) the horizontal fov is only ~24 degrees, so the same
 * 34 units that frame the system on desktop show a narrow slice on a
 * phone; pulling back restores the sun, Duplica, Skool, KRKN and the
 * Sinistra band in one frame.
 */
export function overviewRadius(aspect: number): number {
  return 34 * clamp(1.15 / aspect, 1, 2.2);
}

/**
 * Overview tilt: 1.12 on desktop, a touch more top-down in portrait,
 * so the orbit disc fills more of the tall screen instead of leaving
 * a black band above it.
 */
export function overviewPhi(aspect: number): number {
  return 1.12 - portraitAmount(aspect) * 0.17;
}

/**
 * Focus distance: the round-6 base radius, pulled back in portrait so
 * the body fits with its ring (Duplica 10.6 -> ~23) and Sinistra
 * reads as a constellation (16 -> ~34). The mobile sheet shift
 * (look target drops radius * 0.27) scales with the radius, so the
 * body keeps riding in the visible strip above the sheet.
 */
export function focusRadius(baseRadius: number, aspect: number): number {
  return baseRadius * clamp(1.3 / aspect, 1, 2.15);
}
