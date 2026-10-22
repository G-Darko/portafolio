/**
 * Build-time snapshot of the profile served by api.g-darko.dev (skills, contact, socials, missions…).
 *
 *   node scripts/fetch-profile.mjs
 *
 * Writes lib/data/profile.generated.json (committed). Validation lives in lib/data/api.ts; here we only
 * make sure the payload looks like a profile before replacing the snapshot. If the API is down or returns
 * something unexpected, the existing snapshot is kept. Never exits non-zero so `next build` keeps working.
 *
 * Override the endpoint with PROFILE_API_URL (e.g. a local readme-stats: http://127.0.0.1:3000/api/profile).
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT = join(ROOT, "lib", "data", "profile.generated.json");
const API_URL = process.env.PROFILE_API_URL || "https://api.g-darko.dev/api/profile";
const TIMEOUT_MS = 8000;

/** Shape check only; lib/data/api.ts parses the details. Missions are required so an old API can't wipe them. */
function looksLikeProfile(data) {
  return (
    data !== null &&
    typeof data === "object" &&
    typeof data.name === "string" &&
    Array.isArray(data.skills) &&
    data.skills.length > 0 &&
    Array.isArray(data.missions) &&
    data.missions.length > 0
  );
}

async function main() {
  try {
    const res = await fetch(API_URL, { headers: { accept: "application/json" }, signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!looksLikeProfile(data)) throw new Error("response is not a profile with skills and missions");
    const next = `${JSON.stringify({ source: "https://api.g-darko.dev/api/profile", ...data }, null, 2)}\n`;
    const current = existsSync(OUTPUT) ? readFileSync(OUTPUT, "utf8") : null;
    if (current === next) return console.log(`[profile] snapshot unchanged`);
    writeFileSync(OUTPUT, next);
    console.log(`[profile] ${data.skills.length} skills, ${data.missions.length} missions written to ${relative(ROOT, OUTPUT)}`);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    console.warn(`[profile] ${API_URL} failed (${reason}); keeping existing snapshot`);
  }
}

await main();
