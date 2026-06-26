import { translations, type Locale } from "./translations";
import type { Mission, SubMission } from "@/lib/data/missions";

export function getMissionCopy(locale: Locale, mission: Mission) {
  const data = translations[locale].missionsData;
  const m = data.missions[mission.i18nKey as keyof typeof data.missions];
  return {
    title: m.title,
    codename: m.codename,
    description: m.description,
    org: data.orgs[mission.orgKey as keyof typeof data.orgs],
    role: mission.roleKey
      ? data.roles[mission.roleKey as keyof typeof data.roles]
      : undefined,
  };
}

export function getSubMissionCopy(locale: Locale, sub: SubMission) {
  const data = translations[locale].missionsData;
  const s = data.subMissions[sub.i18nKey as keyof typeof data.subMissions];
  const contextTag = sub.contextTagKey
    ? data.contextTags[sub.contextTagKey as keyof typeof data.contextTags]
    : undefined;
  return {
    title: s.title,
    tagline: s.tagline,
    description: s.description,
    contextTag,
  };
}

export function getMissionsUI(locale: Locale) {
  return translations[locale].missionsUI;
}
