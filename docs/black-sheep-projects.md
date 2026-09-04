# Black Sheep — mapa de proyectos (`C:\_dev`)

Referencia local para el portafolio y capturas. Credenciales de demo viven solo en `.env.captures.local` (gitignored).

## Índice rápido

| Carpeta | Producto en portafolio | Tipo |
|---------|------------------------|------|
| `uf/` | Skool / Universidad Fyttsa | LMS multi-tenant |
| `Cursos/` | Duplica (+ base de Creser) | Monorepo membresías / comunidad / app |
| `CRESER/` | Creser (white-label) | Checkout del monorepo Duplica |
| `KRKN/` | KRKN / FYTTSA ERP | Frontend Next + backend PHP/Firebird |
| `omnisip/` | OmniSIP | Bridge respond.io ↔ Microsip |
| `cpmx/` | CPMX | API CP / colonias México |
| `RNME/` | La Red (RNME) | Comunidad / eventos / membresías |
| `FyttsaGo/` | (no en Missions aún) | E-commerce B2C FYTTSA |

---

## `uf/` — Skool (Universidad Fyttsa)

**Qué es:** LMS multi-empresa (cursos, SCORM/video, certificados, puntos, admin). Marketing en [skool.com.mx](https://skool.com.mx/); tenant vivo [universidadfyttsa.com](https://universidadfyttsa.com/login).

**Estructura (app única Next, no monorepo):**

```
uf/
├── app/           # App Router: (auth), (marketing), (users)/dashboard, api/
├── actions/       # server actions (auth, etc.)
├── components/    # UI + Sidebar
├── lib/           # JWT, tenant, cookies auth-token-{slug}
├── migrations/    # Postgres
├── seed/
├── capacitor.config.ts
└── ecosystem.config.cjs   # PM2 → puerto 3321
```

**Auth:** login en `/login` (`#identifier` + `#password`) → cookie JWT → `/dashboard`.

**Rutas útiles (capturas):** `/dashboard`, `/dashboard/cursos`, `/dashboard/gestion`, `/dashboard/usuarios`, `/dashboard/reportes`, `/dashboard/certificados`, …

**Capturas portfolio:** `public/img/skool/app-*.webp` + `public/video/skool/tour.webm`  
Script: `scripts/capture-skool-authed.mjs`

---

## `Cursos/` — Duplica

**Qué es:** Monorepo de membresías / aula / comunidad / DupliBot / diamantes-XP / pagos. Web [duplicamlm.app](https://duplicamlm.app/), API `duplica.blck-sheep.com`.

```
Cursos/                    # package name: duplica
├── back/                  # @duplica/api — Next API + WS
├── movil/                 # @duplica/mobile — Expo / RN (+ web)
├── packages/shared/       # @duplica/shared
├── MULTI_TENANT.md
├── PRODUCT.md
└── pnpm-workspace.yaml
```

**Dev típico:** `pnpm dev:back` (:3001) · `pnpm dev:ws` (:3355) · `pnpm dev:movil`.

**White-label:** `movil/tenants/{duplica,creser,…}.json` + `APP_TENANT=…`.

---

## `CRESER/`

No es otro producto: suele ser working copy del monorepo apuntando al tenant **creser** (`creser.app`, bundles `com.blacksheep.creser`). Misma API Duplica; branding/tenant distinto.

---

## `KRKN/` — FYTTSA ERP + marca KRKN

```
KRKN/
├── fyttsa-frontend/   # Next ERP (inventario, catálogos, layout/croquis, …)
└── fyttsa-backend/    # PHP MVC + Firebird/Microsip + helpers FastAPI
```

- Marketing producto: [krkn.mx](https://krkn.mx/)
- Tenant / login: [fyttsa.krkn.mx](https://fyttsa.krkn.mx/)
- Backend API suele vivir bajo `*.krkn.mx`

El pedazo “Layout/Croquis” del portafolio vive en este stack (piso de almacén + sync ERP).

---

## `omnisip/`

SaaS: WhatsApp/agente (respond.io) → pedidos/catálogo/stock en Microsip (Firebird) por empresa.

```
omnisip/
├── app/admin/     # panel
├── app/api/       # webhooks respond, bots, …
├── lib/
├── sql/           # migraciones append-only
└── docs/
```

Live: [omnisip.blck-sheep.com](https://omnisip.blck-sheep.com/) · dev ~`:3333` · PM2 prod ~`:3359`.

---

## `cpmx/`

API de estados/municipios/colonias/CP (SEPOMEX + GeoJSON) + dashboard de tokens.

```
cpmx/
├── app/               # marketing, demo, docs, dashboard, api/v1/*
├── geojsons/
├── SQL/
└── lib/
```

Live: [cpmx.blck-sheep.com](https://cpmx.blck-sheep.com/).

---

## `RNME/`

Plataforma de Red México Emprende: landing + auth, eventos, membresías, comunidad, revista, admin, sockets.

```
RNME/
├── app/           # eventos, membresias, comunidad, admin, …
├── components/
├── lib/ + sql/
├── socket-server.js
└── certificates/ / certs/
```

Marketing: [redmexicoemprende.mx](https://www.redmexicoemprende.mx/).

---

## `FyttsaGo/`

Storefront B2C (catálogo, carrito, checkout) — **no** es el ERP KRKN. Dominio típico `fyttsago.com`. El backend ERP puede tener módulo PHP hermano `FYTTSAGO/`; este repo es Next + Postgres.

---

## Capturas autenticadas

1. Credenciales en `.env.captures.local` (bloques `# url` + `email=` / `password=`).
2. Dependencias Playwright en `C:\_dev\_tmp-capture` (playwright + sharp + `npx playwright install ffmpeg`).
3. Tour multi-proyecto (login + soft-nav + video):

```powershell
$env:PORTAFOLIO_ROOT="c:\_dev\portafolio"
node c:\_dev\_tmp-capture\capture-authed-tours.mjs
# subset:
node c:\_dev\_tmp-capture\capture-authed-tours.mjs duplica,creser
```

Fuente: `scripts/capture-authed-tours.mjs` (Duplica/Creser usan login por API + token en `localStorage` porque Expo Web no reacciona bien a `fill`).

4. Landings públicas: `scripts/capture-missions.mjs`.
5. Skool solo: `scripts/capture-skool-authed.mjs` (legacy; preferir el tour unificado).
