/**
 * Helpers for resolving asset paths in the Next.js static export.
 * The site is served from the domain root, so there is no base path.
 */

export function getBasePath(): string {
  return "";
}

export function asset(path: string): string {
  const clean = path.startsWith("/") ? path.slice(1) : path;
  const base = getBasePath();
  return base ? `${base}/${clean}` : `/${clean}`;
}
