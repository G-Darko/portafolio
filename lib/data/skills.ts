import snapshot from "./skills.generated.json";
import { techStackCatalog, type TechCategory } from "./missions";
import { techStackToIds } from "./techMap";

export const SKILLS_API_URL = "https://api.g-darko.dev/api/skills";

export type ApiSkillCategory =
  | "lenguajes"
  | "frontend"
  | "movil"
  | "backend"
  | "datos"
  | "devops"
  | "herramientas";

export interface ApiSkill {
  id: string;
  title: string;
  url?: string;
  color?: string;
  icon?: string;
  category: string;
}

export interface Skill {
  id: string;
  name: string;
  category: TechCategory;
  url?: string;
  color?: string;
  /** Remote SVG icon from the API. */
  icon?: string;
  /** TechSphere / TechIconsSprite node id, used to highlight the orb on hover. */
  sphereId?: string;
}

const API_CATEGORY_TO_HUD: Record<ApiSkillCategory, TechCategory> = {
  lenguajes: "backend",
  frontend: "frontend",
  movil: "mobile",
  backend: "backend",
  datos: "database",
  devops: "tools",
  herramientas: "tools",
};

/** Per-skill placement where the API category is broader than the HUD one. */
const HUD_CATEGORY_OVERRIDES: Record<string, TechCategory> = {
  html: "frontend",
  css: "frontend",
  javascript: "frontend",
  typescript: "frontend",
  threejs: "graphics",
};

export function toHudCategory(skill: Pick<ApiSkill, "id" | "category">): TechCategory {
  return (
    HUD_CATEGORY_OVERRIDES[skill.id] ??
    API_CATEGORY_TO_HUD[skill.category as ApiSkillCategory] ??
    "tools"
  );
}

function isApiSkill(value: unknown): value is ApiSkill {
  if (value === null || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.title === "string" && typeof v.category === "string";
}

function normalizeApiSkill(skill: ApiSkill): Skill {
  return {
    id: skill.id,
    name: skill.title,
    category: toHudCategory(skill),
    url: skill.url,
    color: skill.color,
    icon: skill.icon?.startsWith("https://") ? skill.icon : undefined,
    sphereId: techStackToIds([skill.title])[0],
  };
}

/** Parses an API payload (`{ skills: [...] }`); invalid entries are dropped. */
export function parseApiSkills(data: unknown): Skill[] {
  const raw = (data as { skills?: unknown } | null)?.skills;
  if (!Array.isArray(raw)) return [];
  return raw.filter(isApiSkill).map(normalizeApiSkill);
}

const catalogSkills: Skill[] = techStackCatalog.map((item) => ({
  id: item.name,
  name: item.name,
  category: item.category,
  sphereId: item.iconId,
}));

const snapshotSkills = parseApiSkills(snapshot);

/** Skills baked at build time (API snapshot, or the local catalog if empty). */
export const buildSkills: Skill[] = snapshotSkills.length > 0 ? snapshotSkills : catalogSkills;
