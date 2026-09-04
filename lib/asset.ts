/**
 * Helpers for resolving base-path-safe asset paths in Next.js static export.
 * Keep in sync with next.config.ts `basePath`.
 */

export function getBasePath(): string {
  return process.env.NODE_ENV === "production" ? "/portafolio" : "";
}

export function asset(path: string): string {
  const clean = path.startsWith("/") ? path.slice(1) : path;
  const base = getBasePath();
  return base ? `${base}/${clean}` : `/${clean}`;
}
