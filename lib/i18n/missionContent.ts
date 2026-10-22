import { translations, type Locale } from "./translations";
import { formatPeriod } from "@/lib/data/api";
import type { Mission, SubMission } from "@/lib/data/missions";

export function getMissionCopy(locale: Locale, mission: Mission) {
  return {
    title: mission.title[locale],
    codename: mission.codename[locale],
    description: mission.description[locale],
    org: mission.org[locale],
    role: mission.role?.[locale],
    period: formatPeriod(mission.period, locale),
  };
}

export function getSubMissionCopy(locale: Locale, sub: SubMission) {
  return {
    title: sub.title[locale],
    tagline: sub.tagline[locale],
    description: sub.description[locale],
    contextTag: sub.contextTag?.[locale],
    period: formatPeriod(sub.period, locale),
  };
}

export function getMissionsUI(locale: Locale) {
  return translations[locale].missionsUI;
}
