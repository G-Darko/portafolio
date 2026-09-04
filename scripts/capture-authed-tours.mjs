/**
 * Authenticated tours: screenshots + video for portfolio missions.
 * Creds: .env.captures.local (comment = site, then email=/password=)
 *
 *   $env:PORTAFOLIO_ROOT="c:\_dev\portafolio"
 *   node scripts/capture-authed-tours.mjs
 *   node scripts/capture-authed-tours.mjs skool,duplica   # subset
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
const ENV_FILE = path.join(ROOT, ".env.captures.local");
const ONLY = new Set(
  (process.argv[2] || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
);

console.log(`ROOT=${ROOT}`);

function loadCredBlocks(file) {
  const blocks = [];
  let cur = null;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t) continue;
    if (t.startsWith("#")) {
      const url = t.match(/https?:\/\/[^\s/#]+/i)?.[0];
      const host = t.match(/([\w.-]+\.(?:com|mx|app|local)(?:\/[^\s]*)?)/i)?.[1];
      cur = {
        key: (url || host || t.slice(1).trim()).toLowerCase(),
        email: null,
        password: null,
      };
      blocks.push(cur);
      continue;
    }
    if (!cur) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    const k = t.slice(0, i).trim().toLowerCase();
    const v = t.slice(i + 1).trim();
    if (["email", "user", "usuario", "login"].includes(k)) cur.email = v;
    if (["password", "pass", "pwd"].includes(k)) cur.password = v;
  }
  return blocks;
}

function credFor(blocks, needle) {
  const n = needle.toLowerCase();
  return blocks.find((b) => b.key.includes(n) || n.includes(b.key.replace(/^https?:\/\//, "")));
}

async function toWebp(pngPath) {
  const webp = pngPath.replace(/\.png$/i, ".webp");
  await sharp(pngPath).webp({ quality: 82 }).toFile(webp);
  fs.unlinkSync(pngPath);
  return webp;
}

async function shot(page, imgDir, name) {
  fs.mkdirSync(imgDir, { recursive: true });
  const png = path.join(imgDir, `${name}.png`);
  await page.waitForTimeout(600);
  await page.screenshot({ path: png, type: "png", fullPage: false });
  await toWebp(png);
  console.log(`  ✓ ${name}.webp`);
}

/** Prefer in-app link click (keeps shell → fewer black frames in video). */
async function softNav(page, href, base) {
  const ok = await page.evaluate((h) => {
    const candidates = [
      `a[href="${h}"]`,
      `a[href="${h}/"]`,
      `a[href$="${h}"]`,
    ];
    for (const sel of candidates) {
      const a = document.querySelector(sel);
      if (a) {
        a.click();
        return true;
      }
    }
    // text-ish nav buttons
    const links = [...document.querySelectorAll("a, button, [role=link]")];
    const hit = links.find((el) => (el.getAttribute("href") || "") === h);
    if (hit) {
      hit.click();
      return true;
    }
    return false;
  }, href);
  if (ok) {
    await page.waitForTimeout(1800);
    await page.keyboard.press("Escape").catch(() => {});
    return;
  }
  const url = href.startsWith("http") ? href : `${base}${href}`;
  await page.goto(url, { waitUntil: "commit", timeout: 60000 });
  await page.waitForTimeout(1600);
}

async function fillLogin(page, { userSel, passSel, email, password }) {
  async function typeInto(locator, value) {
    const el = locator.first();
    await el.click({ force: true });
    await el.fill("");
    // RN Web / controlled inputs often ignore fill() — type() fires key events
    await el.pressSequentially(value, { delay: 15 });
  }

  if (userSel) {
    await typeInto(page.locator(userSel), email);
    await typeInto(page.locator(passSel), password);
    return;
  }

  const inputs = page.locator(
    'input:not([type=hidden]):not([tabindex="-1"])'
  );
  await page.waitForTimeout(800);
  const count = await inputs.count();
  if (count < 2) throw new Error(`Expected ≥2 inputs, found ${count}`);
  await typeInto(inputs.nth(0), email);
  await typeInto(inputs.nth(1), password);
}

async function submitLogin(page) {
  const tryClick = async (locator) => {
    try {
      await locator.first().click({ timeout: 4000, force: true });
      return true;
    } catch {
      return false;
    }
  };

  if (await tryClick(page.locator('button[type="submit"]'))) return;
  if (await tryClick(page.getByRole("button", { name: /entrar|iniciar|aceptar|log\s*in|sign\s*in/i })))
    return;
  // Expo / RN web: TouchableOpacity often has no button role — Duplica label is "Entrar ahora"
  if (await tryClick(page.getByText(/entrar ahora|entrar|iniciar sesión|sign in|log in/i))) return;
  if (
    await tryClick(
      page.locator('[data-testid="login-submit"], [role="button"]').filter({
        hasText: /entrar|iniciar|log\s*in/i,
      })
    )
  )
    return;

  await page.keyboard.press("Enter");
  await page.waitForTimeout(500);
  // Last resort: click the primary-looking pressable near password
  await page.evaluate(() => {
    const texts = ["Entrar", "Iniciar sesión", "Log in", "Login", "Aceptar"];
    const nodes = [...document.querySelectorAll("div, span, a, button")];
    const hit = nodes.find((el) => texts.includes((el.textContent || "").trim()));
    hit?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
}

/** Expo web: RN controlled inputs fight Playwright — login via API + localStorage token. */
async function apiLoginInject(page, { apiBase, tenantSlug, email, password, appOrigin }) {
  const result = await page.evaluate(
    async ({ apiBase, tenantSlug, email, password }) => {
      const res = await fetch(`${apiBase}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Tenant-Slug": tenantSlug,
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      return { ok: res.ok, status: res.status, data };
    },
    { apiBase, tenantSlug, email, password }
  );

  const token = result.data?.token || result.data?.data?.token;
  if (!result.ok || !token) {
    throw new Error(
      `API login failed (${result.status}): ${JSON.stringify(result.data).slice(0, 200)}`
    );
  }

  await page.evaluate(
    ({ token, tenantSlug }) => {
      const key = `auth_token_${tenantSlug}`;
      localStorage.setItem(key, token);
      localStorage.setItem("auth_token", token);
      localStorage.setItem(`last_active_${tenantSlug}`, String(Date.now()));
    },
    { token, tenantSlug }
  );

  await page.goto(appOrigin.replace(/\/$/, "") + "/", {
    waitUntil: "domcontentloaded",
    timeout: 90000,
  });
  await page.waitForTimeout(2500);
}

async function dismissOverlays(page) {
  // Mark RNME driver.js tours as done
  await page.evaluate(() => {
    for (const k of [
      "rnme_admin_tour_done",
      "rnme_usuarios_tour_done",
      "rnme_personalizacion_tour_done",
      "rnme_event_tour_completed",
    ]) {
      try {
        localStorage.setItem(k, "true");
      } catch {}
    }
  });

  // KRKN theme promo — click + persist dismiss for any stored user id
  await page.getByText(/ahora no,? gracias/i).first().click({ timeout: 2000 }).catch(() => {});
  await page.evaluate(() => {
    const nodes = [...document.querySelectorAll("button, a, span, div")];
    const hit = nodes.find((el) => /ahora no,? gracias/i.test((el.textContent || "").trim()));
    hit?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (!k) continue;
        const v = localStorage.getItem(k) || "";
        for (const m of v.matchAll(/"id"\s*:\s*(\d+)/g)) {
          localStorage.setItem(`fyttsa_special_themes_promo_dismissed_${m[1]}`, "1");
          localStorage.setItem(`fyttsa_kraken_promo_dismissed_${m[1]}`, "1");
        }
      }
    } catch {}
  });

  // RNME comunidad match promo
  await page.getByText(/^más tarde$/i).first().click({ timeout: 1500 }).catch(() => {});
  await page.getByText(/más tarde/i).first().click({ timeout: 800 }).catch(() => {});
  await page.evaluate(() => {
    const nodes = [...document.querySelectorAll("button, a, span, div")];
    const hit = nodes.find((el) => /^más tarde$/i.test((el.textContent || "").trim()));
    hit?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  // If logout confirm was opened by mistake, cancel it
  await page.getByRole("button", { name: /^cancelar$/i }).click({ timeout: 800 }).catch(() => {});

  // driver.js close / done — avoid matching "Cerrar sesión"
  await page.locator(".driver-popover-close-btn").click({ timeout: 800 }).catch(() => {});
  await page.getByRole("button", { name: /entendido|saltar|¡entendido/i }).click({ timeout: 800 }).catch(() => {});
  await page.evaluate(() => {
    document.querySelectorAll(".driver-overlay, .driver-active-element, .driver-popover").forEach((el) => {
      try {
        el.remove();
      } catch {}
    });
    document.body.classList.remove("driver-active", "driver-fade");
  });

  // Dialog X / Escape only (do NOT click text "Cerrar" — hits logout)
  await page.keyboard.press("Escape").catch(() => {});
  await page
    .locator('[aria-label="Close"], [aria-label="Cerrar"]:not(:has-text("sesión"))')
    .first()
    .click({ timeout: 600 })
    .catch(() => {});
  await page.waitForTimeout(350);
}

async function scrollToHeading(page, needle) {
  const ok = await page.evaluate((t) => {
    const n = t.toLowerCase();
    const el = [...document.querySelectorAll("h1,h2,h3,h4,section,a,p")].find((e) =>
      (e.textContent || "").toLowerCase().includes(n)
    );
    if (!el) return false;
    el.scrollIntoView({ block: "start", behavior: "instant" });
    return true;
  }, needle);
  await page.waitForTimeout(900);
  return ok;
}

async function scrollRatio(page, ratio) {
  await page.evaluate((r) => {
    const max = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight
    );
    window.scrollTo(0, Math.floor(max * r));
  }, ratio);
  await page.waitForTimeout(900);
}

async function finalizeVideo(videoDir) {
  fs.mkdirSync(videoDir, { recursive: true });
  const files = fs.readdirSync(videoDir).filter((f) => f.endsWith(".webm"));
  if (!files.length) {
    console.warn("  (no video file)");
    return;
  }
  const ranked = files
    .map((f) => ({ f, m: fs.statSync(path.join(videoDir, f)).mtimeMs }))
    .sort((a, b) => b.m - a.m);
  const dest = path.join(videoDir, "tour.webm");
  const src = path.join(videoDir, ranked[0].f);
  try {
    if (path.resolve(src) !== path.resolve(dest)) {
      fs.copyFileSync(src, dest);
      fs.unlinkSync(src);
    }
    for (const c of ranked.slice(1)) {
      const p = path.join(videoDir, c.f);
      if (path.resolve(p) === path.resolve(dest)) continue;
      try {
        fs.unlinkSync(p);
      } catch {}
    }
    if (fs.existsSync(dest)) {
      console.log(`  ✓ tour.webm (${Math.round(fs.statSync(dest).size / 1024)} KB)`);
    } else {
      console.warn("  (video missing after finalize)");
    }
  } catch (e) {
    console.warn(`  (video finalize: ${e.message})`);
  }
}

const blocks = loadCredBlocks(ENV_FILE);

const tours = [
  {
    id: "skool",
    match: "universidadfyttsa",
    base: "https://universidadfyttsa.com",
    loginPath: "/login",
    userSel: "#identifier",
    passSel: "#password",
    waitAfterLoginMs: 2500,
    softStops: [
      { name: "app-dashboard", href: "/dashboard" },
      { name: "app-cursos", href: "/dashboard/cursos" },
      { name: "app-mi-progreso", href: "/dashboard/mi-progreso" },
      { name: "app-tops", href: "/dashboard/tops" },
      { name: "app-calendario", href: "/dashboard/calendario" },
      { name: "app-programas", href: "/dashboard/programas" },
      { name: "app-certificados", href: "/dashboard/certificados" },
      { name: "app-gestion", href: "/dashboard/gestion" },
      { name: "app-usuarios", href: "/dashboard/usuarios" },
      { name: "app-reportes", href: "/dashboard/reportes" },
      { name: "app-perfil", href: "/dashboard/perfil" },
    ],
  },
  {
    id: "duplica",
    match: "duplicamlm",
    base: "https://duplicamlm.app",
    loginPath: "/login",
    apiLogin: {
      apiBase: "https://duplica.blck-sheep.com",
      tenantSlug: "duplica",
    },
    waitAfterLoginMs: 4000,
    softStops: [
      { name: "app-home", href: "/" },
      { name: "app-classroom", href: "/classroom" },
      { name: "app-community", href: "/community" },
      { name: "app-ai", href: "/ai-bot" },
      { name: "app-admin", href: "/admin" },
      { name: "app-profile", href: "/profile" },
      { name: "app-more", href: "/more" },
    ],
  },
  {
    id: "creser",
    match: "creser.app",
    base: "https://creser.app",
    loginPath: "/login",
    apiLogin: {
      apiBase: "https://duplica.blck-sheep.com",
      tenantSlug: "creser",
    },
    waitAfterLoginMs: 4000,
    softStops: [
      { name: "app-home", href: "/" },
      { name: "app-classroom", href: "/classroom" },
      { name: "app-community", href: "/community" },
      { name: "app-ai", href: "/ai-bot" },
      { name: "app-admin", href: "/admin" },
      { name: "app-profile", href: "/profile" },
    ],
  },
  {
    id: "cpmx",
    match: "cpmx.blck-sheep",
    base: "https://cpmx.blck-sheep.com",
    loginPath: "/login",
    userSel: "#login",
    passSel: "#password",
    waitAfterLoginMs: 3000,
    softStops: [
      { name: "app-dashboard", href: "/dashboard" },
      { name: "app-tokens", href: "/dashboard/tokens" },
      { name: "app-usuarios", href: "/dashboard/usuarios" },
      { name: "app-catalogo", href: "/dashboard/catalogo" },
      { name: "app-mapa", href: "/dashboard/mapa" },
      { name: "app-docs", href: "/documentacion" },
    ],
  },
  {
    id: "omnisip",
    match: "omnisip",
    base: "https://omnisip.blck-sheep.com",
    loginPath: "/admin/login",
    userSel: "#email",
    passSel: "#password",
    waitAfterLoginMs: 3000,
    softStops: [
      { name: "app-admin", href: "/admin" },
      { name: "app-empresas", href: "/admin/empresas" },
      { name: "app-integracion", href: "/admin/integracion" },
      { name: "app-conversaciones", href: "/admin/conversaciones" },
      { name: "app-bot", href: "/admin/bot" },
      { name: "app-usuarios", href: "/admin/usuarios" },
      { name: "app-config", href: "/admin/config" },
    ],
  },
  {
    id: "krkn",
    match: "fyttsa.krkn",
    base: "https://fyttsa.krkn.mx",
    loginPath: "/",
    userSel: "#krkn-usr",
    passSel: "#krkn-pwd",
    preLoginWaitMs: 2200,
    waitAfterLoginMs: 4000,
    softStops: [
      { name: "app-etiquetado", href: "/aplicaciones/etiquetado" },
      { name: "app-layout", href: "/procesos/layout/2", waitMs: 2500 },
      { name: "app-embarques-mapa", href: "/procesos/embarques/mapa", waitMs: 10000 },
      { name: "app-quiebres", href: "/procesos/quiebres" },
      {
        name: "app-sesiones-microsip",
        href: "/configuracion/sesiones-microsip",
        waitMs: 2500,
      },
      {
        name: "app-auditoria-dml",
        href: "/configuracion/auditoria-dml?bd=1&desde=2026-09-04&hasta=2026-09-04&preset=hoy",
        waitMs: 2500,
      },
    ],
  },
  {
    id: "rnme",
    match: "redmexicoemprende",
    base: "https://www.redmexicoemprende.mx",
    loginPath: "/login",
    userSel: "#email",
    passSel: "#password",
    waitAfterLoginMs: 3500,
    softStops: [
      { name: "app-comunidad", href: "/comunidad" },
      { name: "app-comunidad-miembros", href: "/comunidad/miembros" },
      { name: "app-comunidad-chat", href: "/comunidad/chat" },
      { name: "app-admin", href: "/admin" },
      { name: "app-eventos", href: "/admin/eventos" },
      { name: "app-usuarios", href: "/admin/usuarios" },
      { name: "app-membresias", href: "/admin/memberships" },
    ],
  },
  {
    id: "leamsi",
    match: null,
    noAuth: true,
    base: "https://leamsi.vercel.app",
    loginPath: "/",
    dark: true,
    // scrollBy heading text — hash anchors don't exist on this site
    scrollStops: [
      { name: "app-home", heading: null, ratio: 0 },
      { name: "app-acerca", heading: "Josué Rodríguez" },
      { name: "app-mision", heading: "MISIÓN" },
      { name: "app-contacto", heading: "Contáctanos", ratio: 0.92 },
    ],
  },
];

const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: ["--hide-scrollbars", "--disable-gpu"],
});

try {
  for (const tour of tours) {
    if (ONLY.size && !ONLY.has(tour.id)) continue;

    const imgDir = path.join(ROOT, "public", "img", tour.id);
    const videoDir = path.join(ROOT, "public", "video", tour.id);
    fs.mkdirSync(imgDir, { recursive: true });
    fs.mkdirSync(videoDir, { recursive: true });

    let email = null;
    let password = null;
    if (!tour.noAuth) {
      const cred = credFor(blocks, tour.match);
      if (!cred?.email || !cred?.password) {
        console.warn(`⚠ skip ${tour.id}: no creds for ${tour.match}`);
        continue;
      }
      email = cred.email;
      password = cred.password;
    }

    console.log(`\n══ ${tour.id} ══`);
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
      locale: "es-MX",
      colorScheme: "dark",
      recordVideo: { dir: videoDir, size: { width: 1440, height: 900 } },
    });
    const page = await context.newPage();

    try {
      await page.goto(`${tour.base}${tour.loginPath}`, {
        waitUntil: "domcontentloaded",
        timeout: 90000,
      });
      await page.waitForTimeout(tour.preLoginWaitMs || 1200);

      if (tour.dark) {
        await page.evaluate(() => {
          document.documentElement.classList.add("dark");
          document.body?.classList.add("dark");
          localStorage.setItem("theme", "dark");
        });
        const sun = page.locator("header button, nav button").filter({ has: page.locator("svg") }).last();
        await sun.click({ timeout: 2000 }).catch(() => {});
        await page.waitForTimeout(500);
      }

      if (!tour.noAuth) {
        if (tour.apiLogin) {
          await shot(page, imgDir, "app-login");
          await apiLoginInject(page, {
            apiBase: tour.apiLogin.apiBase,
            tenantSlug: tour.apiLogin.tenantSlug,
            email,
            password,
            appOrigin: tour.base,
          });
        } else {
          await fillLogin(page, {
            userSel: tour.userSel,
            passSel: tour.passSel,
            email,
            password,
          });
          await shot(page, imgDir, "app-login");
          await submitLogin(page);
          await page.waitForTimeout(tour.waitAfterLoginMs || 3000);
        }
        console.log(`  landed: ${page.url()}`);
        if (/\/login/i.test(page.url()) && tour.id !== "krkn") {
          console.warn(`  ⚠ still on login for ${tour.id}`);
        }
        await dismissOverlays(page);
        // KRKN: dismiss promo for whatever user id is stored
        await page.evaluate(() => {
          try {
            const raw = localStorage.getItem("usuario") || localStorage.getItem("user");
            // also blanket-set for ids found in any auth payload
            for (let i = 0; i < localStorage.length; i++) {
              const k = localStorage.key(i);
              if (!k) continue;
              if (/user|usuario|auth/i.test(k)) {
                const v = localStorage.getItem(k) || "";
                const m = v.match(/"id"\s*:\s*(\d+)/);
                if (m) {
                  localStorage.setItem(`fyttsa_special_themes_promo_dismissed_${m[1]}`, "1");
                  localStorage.setItem(`fyttsa_kraken_promo_dismissed_${m[1]}`, "1");
                }
              }
            }
          } catch {}
        });
        await dismissOverlays(page);
      }

      if (tour.scrollStops?.length) {
        for (const stop of tour.scrollStops) {
          console.log(`  → ${stop.name}`);
          if (stop.heading) {
            const ok = await scrollToHeading(page, stop.heading);
            if (!ok && stop.ratio != null) await scrollRatio(page, stop.ratio);
          } else if (stop.ratio != null) {
            await scrollRatio(page, stop.ratio);
          }
          await dismissOverlays(page);
          await shot(page, imgDir, stop.name);
        }
      }

      for (const stop of tour.softStops || []) {
        console.log(`  → ${stop.name}`);
        // Prefer full goto for deep links / query strings (KRKN modules)
        if (stop.forceGoto || stop.href.includes("?") || /\/\d+(\/|$)/.test(stop.href)) {
          await page.goto(`${tour.base}${stop.href}`, {
            waitUntil: "domcontentloaded",
            timeout: 90000,
          });
          await page.waitForTimeout(1200);
        } else if (stop.href.includes("#")) {
          await page.goto(`${tour.base}${stop.href}`, {
            waitUntil: "commit",
            timeout: 60000,
          });
          await page.waitForTimeout(1200);
        } else {
          await softNav(page, stop.href, tour.base);
        }
        // skip unauthorized shells
        if (/unauthorized|login/i.test(page.url()) && !tour.noAuth && tour.id !== "krkn") {
          console.log("    (skipped — redirected)");
          continue;
        }
        await dismissOverlays(page);
        if (stop.waitMs) await page.waitForTimeout(stop.waitMs);
        await dismissOverlays(page);
        await shot(page, imgDir, stop.name);
      }

      // gentle end beat on last meaningful page
      for (let i = 0; i < 3; i++) {
        await page.mouse.wheel(0, 350);
        await page.waitForTimeout(500);
      }
    } catch (err) {
      console.error(`  ✗ ${tour.id}:`, err.message);
    } finally {
      await context.close();
      await finalizeVideo(videoDir);
    }
  }
} finally {
  await browser.close();
}

console.log("\ndone");
