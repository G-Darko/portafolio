/** Identity / contact constants for HUD + CV, derived from the API profile snapshot. */
import { profileSnapshot } from "./snapshot";

const contact = profileSnapshot.contact;

export const CONTACT_EMAIL = contact?.email ?? "contacto@g-darko.dev";
export const GITHUB_URL = contact?.github ?? "https://github.com/G-Darko";
export const GITHUB_HANDLE = GITHUB_URL.replace(/\/+$/, "").split("/").pop() ?? "G-Darko";
export const GITHUB_LABEL = `github.com/${GITHUB_HANDLE}`;
export const SITE_URL = (contact?.site ?? "https://g-darko.dev").replace(/\/?$/, "/");
export const SITE_LABEL = new URL(SITE_URL).host;
export const LINKEDIN_URL = contact?.linkedin;
export const LINKEDIN_LABEL = LINKEDIN_URL?.replace(/^https?:\/\/(www\.)?/, "").replace(/\/+$/, "");

/** Local only: the phone is not published by the API. */
export const PHONE = "+52 720 294 8727";
export const FORMSPREE_ENDPOINT = "https://formspree.io/f/xlevgjee";
export const CV_PATH = "/cv";

/** Digits-only E.164-ish value for `tel:` links. */
export function telHref(phone: string = PHONE): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function mailtoHref(opts?: { subject?: string; body?: string }): string {
  const params = new URLSearchParams();
  if (opts?.subject) params.set("subject", opts.subject);
  if (opts?.body) params.set("body", opts.body);
  const qs = params.toString();
  return qs ? `mailto:${CONTACT_EMAIL}?${qs}` : `mailto:${CONTACT_EMAIL}`;
}
