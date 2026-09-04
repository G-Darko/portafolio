/** Shared identity / contact constants for HUD + CV. */

export const CONTACT_EMAIL = "gdarko.uribe@gmail.com";
export const GITHUB_HANDLE = "G-Darko";
export const GITHUB_URL = `https://github.com/${GITHUB_HANDLE}`;
export const GITHUB_LABEL = `github.com/${GITHUB_HANDLE}`;
export const FORMSPREE_ENDPOINT = "https://formspree.io/f/xlevgjee";
export const CV_PATH = "/cv";
export const SITE_URL = "https://g-darko.github.io/portafolio/";
export const SITE_LABEL = "g-darko.github.io/portafolio";
export const PHONE = "7202948727";

export function mailtoHref(opts?: { subject?: string; body?: string }): string {
  const params = new URLSearchParams();
  if (opts?.subject) params.set("subject", opts.subject);
  if (opts?.body) params.set("body", opts.body);
  const qs = params.toString();
  return qs ? `mailto:${CONTACT_EMAIL}?${qs}` : `mailto:${CONTACT_EMAIL}`;
}
