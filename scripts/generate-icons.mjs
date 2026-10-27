// Rasterize public/favicon.svg into the PNG icons referenced by lib/seo.ts + app/manifest.ts.
import sharp from "sharp";
import { readFile } from "node:fs/promises";

const svg = await readFile("public/favicon.svg");
const out = [["favicon-32x32.png", 32], ["apple-touch-icon.png", 180], ["icon-192.png", 192], ["icon-512.png", 512]];
for (const [name, size] of out) await sharp(svg, { density: 600 }).resize(size, size).png().toFile(`public/${name}`);
// Maskable: full-bleed background with the mark inside the safe zone.
const mark = await sharp(svg, { density: 600 }).resize(360, 360).png().toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 4, background: "#0f0f0f" } })
  .composite([{ input: mark, gravity: "center" }]).png().toFile("public/icon-512-maskable.png");
console.log("icons ok");