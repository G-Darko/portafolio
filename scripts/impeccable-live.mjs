#!/usr/bin/env node
/**
 * Starts (or stops) Impeccable live helper for this portfolio.
 * Requires PRODUCT.md + DESIGN.md and a running `pnpm dev`.
 *
 *   pnpm live        → inject + start live helper (port 8400)
 *   pnpm live:stop   → stop helper and remove inject
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const stop = process.argv.includes("--stop");

const candidates = [
  process.env.IMPECCABLE_SKILL_DIR,
  path.join(os.homedir(), ".agents", "skills", "impeccable"),
  path.join(os.homedir(), ".cursor", "skills", "impeccable"),
].filter(Boolean);

function resolveScript(name) {
  for (const base of candidates) {
    const full = path.join(base, "scripts", name);
    if (fs.existsSync(full)) return full;
  }
  return null;
}

const scriptName = stop ? "live-server.mjs" : "live.mjs";
const script = resolveScript(scriptName);

if (!script) {
  console.error(
    "Impeccable scripts not found. Set IMPECCABLE_SKILL_DIR or install the skill under ~/.agents/skills/impeccable"
  );
  process.exit(1);
}

const args = stop ? [script, "stop"] : [script, "--target", "app/page.tsx"];
const result = spawnSync(process.execPath, args, {
  cwd: projectRoot,
  stdio: "inherit",
  env: process.env,
});

if (!stop && result.status === 0) {
  console.log("\nLive helper ready. Open http://localhost:3000 (with pnpm dev running).");
  console.log("Picker bar appears in the browser; agent poll is handled by Cursor when in live mode.");
}

process.exit(result.status ?? 1);
