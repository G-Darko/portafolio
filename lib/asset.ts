const basePath = process.env.NODE_ENV === "production" ? "/portafolio" : "";

export function asset(path: string): string {
  return `${basePath}${path}`;
}
