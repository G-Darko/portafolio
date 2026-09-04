/**
 * Login to Universidad Fyttsa (Skool tenant), capture screens + record tour video.
 * Creds: .env.captures.local (email= / password=)
 *
 * Usage (from temp dir with playwright+sharp, or with NODE deps available):
 *   node scripts/capture-skool-authed.mjs
 */
import { chromium } from "playwright";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = process.env.PORTAFOLIO_ROOT
  ? path.resolve(process.env.PORTAFOLIO_ROOT)
  : path.resolve(__dirname, "..");
const OUT_IMG = path.join(ROOT, "public", "img", "skool");
const OUT_VIDEO = path.join(ROOT, "public", "video", "skool");
const ENV_FILE = path.join(ROOT, ".env.captures.local");
const BASE = process.env.SKOOL_BASE || "https://universidadfyttsa.com";
console.log(`ROOT=${ROOT}`);

function loadEnv(file) {
  const raw = fs.readFileSync(file, "utf8");
  const out = {};
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    out[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return out;
}

async function toWebp(pngPath) {
  const webp = pngPath.replace(/\.png$/i, ".webp");
  await sharp(pngPath).webp({ quality: 82 }).toFile(webp);
  fs.unlinkSync(pngPath);
  return webp;
}

async function shot(page, name) {
  fs.mkdirSync(OUT_IMG, { recursive: true });
  const png = path.join(OUT_IMG, `${name}.png`);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: png, type: "png", fullPage: false });
  const webp = await toWebp(png);
  console.log(`  ✓ img/${path.relative(path.join(ROOT, "public", "img"), webp).replace(/\\/g, "/")}`);
}

const env = loadEnv(ENV_FILE);
const email = env.email || env.EMAIL || env.user || env.USER;
const password = env.password || env.PASSWORD || env.pass;
if (!email || !password) {
  console.error("Missing email/password in .env.captures.local");
  process.exit(1);
}

fs.mkdirSync(OUT_VIDEO, { recursive: true });
fs.mkdirSync(OUT_IMG, { recursive: true });

const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: ["--hide-scrollbars", "--disable-gpu"],
});

const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  locale: "es-MX",
  colorScheme: "dark",
  recordVideo: {
    dir: OUT_VIDEO,
    size: { width: 1440, height: 900 },
  },
});

const page = await context.newPage();

try {
  console.log(`→ login ${BASE}/login (as ${email})`);
  await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForTimeout(1500);

  const identifier =
    (await page.$("#identifier")) ||
    (await page.$('input[name="identifier"]')) ||
    (await page.$('input[type="email"]')) ||
    (await page.$('input[name="email"]'));
  const passInput =
    (await page.$("#password")) ||
    (await page.$('input[name="password"]')) ||
    (await page.$('input[type="password"]'));

  if (!identifier || !passInput) {
    await shot(page, "login-fail-form");
    throw new Error("Could not find login fields (#identifier / #password)");
  }

  await identifier.fill(email);
  await passInput.fill(password);
  await shot(page, "app-login");

  await Promise.all([
    page.waitForURL(/dashboard|unauthorized|update-password/i, { timeout: 45000 }).catch(() => null),
    page.click('button[type="submit"]'),
  ]);
  await page.waitForTimeout(2500);

  const url = page.url();
  console.log(`  landed: ${url}`);
  if (/login/i.test(url)) {
    await shot(page, "app-login-error");
    const errText = await page.evaluate(() => document.body?.innerText?.slice(0, 500));
    throw new Error(`Still on login. Page text snippet: ${errText}`);
  }

  // Core tour
  const stops = [
    { name: "app-dashboard", path: "/dashboard" },
    { name: "app-cursos", path: "/dashboard/cursos" },
    { name: "app-mi-progreso", path: "/dashboard/mi-progreso" },
    { name: "app-tops", path: "/dashboard/tops" },
    { name: "app-calendario", path: "/dashboard/calendario" },
    { name: "app-programas", path: "/dashboard/programas" },
    { name: "app-certificados", path: "/dashboard/certificados" },
    { name: "app-perfil", path: "/dashboard/perfil" },
  ];

  for (const stop of stops) {
    console.log(`→ ${stop.name}  ${stop.path}`);
    await page.goto(`${BASE}${stop.path}`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await page.waitForTimeout(2000);
    // dismiss potential modals / toasts
    await page.keyboard.press("Escape").catch(() => {});
    await shot(page, stop.name);
  }

  // Open first course if any card/link exists
  console.log("→ try first course detail");
  await page.goto(`${BASE}/dashboard/cursos`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(2000);
  const courseHref = await page.evaluate(() => {
    const a = [...document.querySelectorAll('a[href*="/dashboard/cursos/"]')].find((el) =>
      /\/dashboard\/cursos\/[^/]+\/?$/.test(el.getAttribute("href") || "")
    );
    return a?.getAttribute("href") || null;
  });
  if (courseHref) {
    const abs = courseHref.startsWith("http") ? courseHref : `${BASE}${courseHref}`;
    await page.goto(abs, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(2000);
    await shot(page, "app-curso-detail");

    const contenido = abs.replace(/\/?$/, "") + "/contenido";
    await page.goto(contenido, { waitUntil: "domcontentloaded", timeout: 60000 }).catch(() => null);
    await page.waitForTimeout(2000);
    await shot(page, "app-curso-contenido");

    const lesson = await page.evaluate(() => {
      const a = [...document.querySelectorAll('a[href*="/lecciones/"]')][0];
      return a?.getAttribute("href") || null;
    });
    if (lesson) {
      const lessonUrl = lesson.startsWith("http") ? lesson : `${BASE}${lesson}`;
      await page.goto(lessonUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForTimeout(2500);
      await shot(page, "app-leccion");
    }
  } else {
    console.log("  (no course links found — skip detail/lesson)");
  }

  // Admin surfaces (may 403 — still useful if allowed)
  for (const stop of [
    { name: "app-gestion", path: "/dashboard/gestion" },
    { name: "app-reportes", path: "/dashboard/reportes" },
    { name: "app-usuarios", path: "/dashboard/usuarios" },
  ]) {
    console.log(`→ ${stop.name}  ${stop.path}`);
    const res = await page.goto(`${BASE}${stop.path}`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await page.waitForTimeout(1800);
    if (page.url().includes("unauthorized") || res?.status() === 403) {
      console.log("  (no access — skip save)");
      continue;
    }
    await shot(page, stop.name);
  }

  // Slow scroll on dashboard for video beat
  await page.goto(`${BASE}/dashboard`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(1000);
  for (let i = 0; i < 4; i++) {
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(700);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
} finally {
  await context.close();
  await browser.close();
}

// Rename recorded webm to tour.webm
const clips = fs
  .readdirSync(OUT_VIDEO)
  .filter((f) => f.endsWith(".webm"))
  .map((f) => ({ f, m: fs.statSync(path.join(OUT_VIDEO, f)).mtimeMs }))
  .sort((a, b) => b.m - a.m);

if (clips.length) {
  const dest = path.join(OUT_VIDEO, "tour.webm");
  const src = path.join(OUT_VIDEO, clips[0].f);
  if (fs.existsSync(dest)) fs.unlinkSync(dest);
  fs.renameSync(src, dest);
  // remove older stray clips
  for (const c of clips.slice(1)) {
    try {
      fs.unlinkSync(path.join(OUT_VIDEO, c.f));
    } catch {}
  }
  console.log(`✓ video/skool/tour.webm (${Math.round(fs.statSync(dest).size / 1024)} KB)`);
}

console.log("done");
