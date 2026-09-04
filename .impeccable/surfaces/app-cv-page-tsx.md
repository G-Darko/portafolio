---
version: 1
slug: "app-cv-page-tsx"
primary_target: "app/cv/page.tsx"
related_targets: ["components/cv/CvView.tsx","lib/data/cv.ts","components/hud/HUDHeader.tsx"]
---

# Surface: CV (`app/cv/page.tsx`)

Mode: **Read** (recruiter scan + download action)

## Direction contract

THESIS: Featured proof as a scannable evidence ledger under a legal-name masthead — not a two-column dossier and not a live dump of HUD missions.
OWN-WORLD: Hologram Workshop — near-black console, frosted panels, Holo Cyan / Ops Blue, Poppins body + mono stamps; quiet glow on export chrome only.
STORY: Visitor understands Gael's highlights in CV structure, trusts the stack (TypeScript first on Black Sheep), downloads a real PDF, returns to the portfolio.
FIRST VIEWPORT: Sticky chrome (← Portafolio | brand stamp | locale | Descargar PDF); masthead name/role/blurb + available signal; ledger table of curated experience; bottom skills / education+certs / contact.
FORM: Masthead + evidence ledger (surface seed `2adf218c`, option `masthead-ledger`); approved comp `.impeccable/mocks/decision/cv-masthead-ledger.webp` (composition only — product copy is curated truth, not synthetic mock employers).
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Related

- `components/cv/CvView.tsx`
- `components/cv/CvPdfDocument.tsx`
- `lib/data/cv.ts`
- Stack coherence: `lib/data/missions.ts`, `lib/data/techMap.ts`
- Nav: `components/hud/HUDHeader.tsx` (Más → CV)

## Boundaries

- Do not touch `_LEGACY`
- CV data is curated highlights, not auto-synced from missions
- Static export: PDF generated client-side via `@react-pdf/renderer`
