/**
 * Build-time snapshot of the skills served by api.g-darko.dev.
 *
 *   node scripts/fetch-skills.mjs
 *
 * Writes lib/data/skills.generated.json (committed). If the API is down or
 * returns something unexpected, the existing snapshot is kept; when no
 * snapshot exists yet, an empty one is written so the app falls back to
 * `techStackCatalog`. Never exits non-zero so `next build` keeps working.
 *
 * Override the endpoint with SKILLS_API_URL.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT = join(ROOT, "lib", "data", "skills.generated.json");
const API_URL = process.env.SKILLS_API_URL || "https://api.g-darko.dev/api/skills";
const TIMEOUT_MS = 8000;

function isApiSkill(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.category === "string"
  );
}

function pickSkill(skill) {
  return {
    id: skill.id,
    title: skill.title,
    url: typeof skill.url === "string" ? skill.url : undefined,
    color: typeof skill.color === "string" ? skill.color : undefined,
    icon: typeof skill.icon === "string" ? skill.icon : undefined,
    category: skill.category,
  };
}

function writeSnapshot(skills) {
  const next = `${JSON.stringify({ source: API_URL, skills }, null, 2)}\n`;
  const current = existsSync(OUTPUT) ? readFileSync(OUTPUT, "utf8") : null;
  if (current === next) {
    console.log(`[skills] ${skills.length} skills, snapshot unchanged`);
    return;
  }
  writeFileSync(OUTPUT, next);
  console.log(`[skills] ${skills.length} skills written to ${relative(ROOT, OUTPUT)}`);
}

async function main() {
  try {
    const res = await fetch(API_URL, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const raw = Array.isArray(data?.skills) ? data.skills : [];
    const skills = raw.filter(isApiSkill).map(pickSkill);
    if (skills.length === 0) throw new Error("response has no valid skills");
    writeSnapshot(skills);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    if (existsSync(OUTPUT)) {
      console.warn(`[skills] ${API_URL} failed (${reason}); keeping existing snapshot`);
    } else {
      console.warn(`[skills] ${API_URL} failed (${reason}); writing empty snapshot (catalog fallback)`);
      writeSnapshot([]);
    }
  }
}

await main();
