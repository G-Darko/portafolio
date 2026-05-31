/**
 * Helpers for resolving base-path-safe asset paths in Next.js static export.
 */

export function asset(path: string): string {
  // Strip leading slash so basePath prepends correctly
  const clean = path.startsWith("/") ? path.slice(1) : path;
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return `${base}/${clean}`;
}
