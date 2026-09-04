/**
 * Capture mission screenshots using system Chrome (no Chromium download).
 * Usage: node scripts/capture-missions.mjs
 */
import { chromium } from "playwright";
import sharp from "sharp";
import fs from "fs";
import path from "path";

const OUT = "public/img";

async function toWebp(pngPath) {
  const webp = pngPath.replace(/\.png$/i, ".webp");
  await sharp(pngPath).webp({ quality: 82 }).toFile(webp);
  fs.unlinkSync(pngPath);
  return webp;
}

async function capture(page, { url, out, waitMs = 3000, dark = false, scrollSteps = 0 }) {
  const abs = path.resolve(OUT, out);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  const png = abs.replace(/\.webp$/i, ".png");

  console.log(`→ ${out}  ${url}${dark ? " [dark]" : ""}`);
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(800);

  if (dark) {
    // Prefer site toggle; fall back to class + color-scheme
    const toggled = await page.evaluate(() => {
      const btn =
        document.querySelector('[aria-label*="theme" i], [aria-label*="modo" i], button[class*="theme"]') ||
        [...document.querySelectorAll("button, a")].find((el) => {
          const t = (el.getAttribute("aria-label") || el.textContent || "").toLowerCase();
          return /dark|oscuro|theme|modo/.test(t) || el.querySelector("svg");
        });
      // LEAMSI: sun icon in header — click last header button-like control with svg
      const headerBtns = [...document.querySelectorAll("header button, header a, nav button")];
      const sun = headerBtns.find((b) => b.querySelector("svg"));
      const target = sun || btn;
      if (target) {
        target.click();
        return true;
      }
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
      return false;
    });
    await page.waitForTimeout(toggled ? 600 : 400);
    // If still light (LEAMSI stores theme), force dark class commonly used by Tailwind
    await page.evaluate(() => {
      document.documentElement.classList.add("dark");
      document.body?.classList.add("dark");
      localStorage.setItem("theme", "dark");
      localStorage.setItem("color-theme", "dark");
    });
    await page.waitForTimeout(400);
    // Reload once so theme from localStorage applies if the site reads it on boot
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);
    await page.evaluate(() => {
      document.documentElement.classList.add("dark");
      document.body?.classList.add("dark");
    });
  }

  // Wait for video elements to have data / playing
  await page.waitForTimeout(waitMs);
  await page.evaluate(async () => {
    const videos = [...document.querySelectorAll("video")];
    await Promise.all(
      videos.map(
        (v) =>
          new Promise((resolve) => {
            if (v.readyState >= 2) return resolve();
            const done = () => resolve();
            v.addEventListener("loadeddata", done, { once: true });
            v.addEventListener("error", done, { once: true });
            setTimeout(done, 12000);
            try {
              v.muted = true;
              v.play?.().catch(() => {});
            } catch {}
          })
      )
    );
  });
  await page.waitForTimeout(1500);

  if (scrollSteps > 0) {
    const h = await page.evaluate(() => window.innerHeight);
    for (let i = 0; i < scrollSteps; i++) {
      await page.evaluate((y) => window.scrollTo(0, y), h * (i + 0.15));
      await page.waitForTimeout(700);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
  }

  await page.screenshot({ path: png, type: "png" });
  const webp = await toWebp(png);
  console.log(`  ✓ ${webp}`);
}

async function captureScrollShots(page, { url, dir, prefix, count, waitMs = 2000 }) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(waitMs);
  const h = await page.evaluate(() => window.innerHeight);
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let i = 0; i < count; i++) {
    const y = Math.min(i * Math.floor(h * 0.85), Math.max(0, total - h));
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(800);
    const out = `${dir}/${prefix}${i + 1}.webp`;
    const abs = path.resolve(OUT, out);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    const png = abs.replace(/\.webp$/i, ".png");
    console.log(`→ ${out}  scroll=${y}`);
    await page.screenshot({ path: png, type: "png" });
    await toWebp(png);
    console.log(`  ✓ ${out}`);
  }
}

const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: ["--disable-gpu", "--hide-scrollbars"],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  colorScheme: "dark",
  locale: "es-MX",
});
const page = await context.newPage();

try {
  // Duplica / Creser — wait for hero video
  await capture(page, {
    url: "https://duplicamlm.app/",
    out: "duplica/1.webp",
    waitMs: 8000,
  });
  await capture(page, {
    url: "https://creser.app/",
    out: "creser/1.webp",
    waitMs: 8000,
  });

  // LEAMSI dark
  await capture(page, {
    url: "https://leamsi.vercel.app/",
    out: "leamsi/1.webp",
    waitMs: 2500,
    dark: true,
  });

  // RNME landing — several scroll positions
  await captureScrollShots(page, {
    url: "https://www.redmexicoemprende.mx/",
    dir: "rnme",
    prefix: "",
    count: 4,
    waitMs: 3000,
  });

  // KRKN: scroll lives on main.landing-root (not window)
  {
    await page.goto("https://krkn.mx/", { waitUntil: "networkidle", timeout: 90000 });
    await page.waitForTimeout(2500);
    async function scrollMain(ratio) {
      await page.evaluate((r) => {
        const main = document.querySelector("main.landing-root") || document.querySelector("main");
        if (!main) return;
        const max = main.scrollHeight - main.clientHeight;
        main.scrollTo(0, Math.floor(max * r));
      }, ratio);
      await page.waitForTimeout(900);
    }
    async function shot(name) {
      const out = `krkn/${name}.webp`;
      const abs = path.resolve(OUT, out);
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      const png = abs.replace(/\.webp$/i, ".png");
      console.log(`→ ${out}`);
      await page.screenshot({ path: png, type: "png" });
      await toWebp(png);
      console.log(`  ✓ ${out}`);
    }
    await scrollMain(0);
    await shot("1");
    await scrollMain(0.22);
    await shot("2");
    await scrollMain(0.45);
    await shot("3");
  }
  await capture(page, {
    url: "https://fyttsa.krkn.mx/",
    out: "krkn/fyttsa.webp",
    waitMs: 4000,
  });
} finally {
  await browser.close();
}

console.log("done");
