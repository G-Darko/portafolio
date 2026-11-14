"use client";

import { useState } from "react";
import { getProjectFavicon } from "@/lib/nyxheim/bodies";

/**
 * A project's real logo (remote favicon, verified to load) inside the
 * dock chip and the panel header. Falls back to the project's initial
 * letter when there is no favicon for the slug or the remote image fails
 * to load — so a dead logo never leaves an empty hole.
 */
export function ProjectLogo({
  slug,
  label,
  color,
  size = 28,
}: {
  slug: string;
  label: string;
  color: string;
  size?: number;
}) {
  const src = getProjectFavicon(slug);
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <span
        aria-hidden
        className="flex shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold"
        style={{ width: size, height: size, backgroundColor: `${color}22`, color }}
      >
        {label.charAt(0)}
      </span>
    );
  }
  return (
    <img
      src={src}
      alt=""
      aria-hidden
      width={size}
      height={size}
      loading="lazy"
      onError={() => setFailed(true)}
      className="shrink-0 rounded-full object-contain"
      style={{ width: size, height: size }}
    />
  );
}
