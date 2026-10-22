import type { Locale } from "@/lib/store/useLocaleStore";
import { formatPeriodPart } from "@/lib/data/api";
import { profileSnapshot } from "@/lib/data/snapshot";

/** Certifications come from the API snapshot (Credly badges + manual entries); nothing is hardcoded here. */
export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
  emblem: string;
  color: string;
}

const initials = (text: string) =>
  text
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");

export function getCertifications(locale: Locale): Certification[] {
  return [...profileSnapshot.certifications]
    .sort((a, b) => b.issuedAt.localeCompare(a.issuedAt))
    .map((c) => ({
      id: c.id,
      name: c.name,
      issuer: c.issuer,
      date: formatPeriodPart(c.issuedAt, locale),
      url: c.url,
      emblem: c.emblem ?? initials(c.issuer),
      color: c.color ?? "var(--hud-cyan)",
    }));
}
