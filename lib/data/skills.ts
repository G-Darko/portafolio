import { profileSnapshot } from "./snapshot";
import type { ApiSkill, HudCategory } from "./api";

export interface Skill {
  id: string;
  name: string;
  category: HudCategory;
  url?: string;
  color?: string;
  /** Remote SVG logo from the API. */
  icon?: string;
  /** lucide icon name (see components/SkillIcon.tsx). */
  uiIcon?: string;
  /** TechIconsSprite / TechSphere id, used to highlight the orb on hover. */
  sprite?: string;
}

export function toSkill(skill: ApiSkill): Skill {
  return {
    id: skill.id,
    name: skill.title,
    category: skill.hudCategory ?? "tools",
    url: skill.url,
    color: skill.color,
    icon: skill.icon?.startsWith("https://") ? skill.icon : undefined,
    uiIcon: skill.uiIcon,
    sprite: skill.sprite,
  };
}

/** Skills baked at build time from the API snapshot. */
export const buildSkills: Skill[] = profileSnapshot.skills.map(toSkill);
