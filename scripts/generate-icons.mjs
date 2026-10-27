// Rasterize the original avatar (public/img/DARKO.png) into the PNG icons used by lib/seo.ts + app/manifest.ts.
import sharp from "sharp";

const SRC = "public/img/DARKO.png";
const transparent = { r: 0, g: 0, b: 0, alpha: 0 };
const out = [["favicon-32x32.png", 32], ["apple-touch-icon.png", 180], ["icon-192.png", 192], ["icon-512.png", 512]];
for (const [name, size] of out)
  await sharp(SRC).resize(size, size, { fit: "contain", background: transparent }).png().toFile(`public/${name}`);
// Maskable: avatar inside the 80% safe zone on the site background.
const mark = await sharp(SRC).resize(410, 410, { fit: "contain", background: transparent }).png().toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 4, background: "#0f0f0f" } })
  .composite([{ input: mark, gravity: "center" }]).png().toFile("public/icon-512-maskable.png");
console.log("icons ok");
