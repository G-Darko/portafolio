---
name: G-Darko Portfolio
description: Hologram Workshop — futuristic HUD atmosphere around Gael’s work and contact path
colors:
  holo-cyan: "oklch(0.8 0.18 195)"
  ops-blue: "oklch(0.65 0.18 255)"
  status-green: "oklch(0.75 0.2 145)"
  alert-red: "oklch(0.65 0.22 25)"
  amber-signal: "oklch(0.85 0.18 80)"
  near-black-console: "oklch(0.12 0 0)"
  soft-readout: "oklch(0.95 0 0)"
  muted-readout: "oklch(0.65 0 0)"
  frosted-panel: "oklch(0.08 0.02 240 / 0.85)"
  hud-border: "oklch(0.65 0.18 255 / 0.25)"
  light-console: "oklch(0.97 0 0)"
  light-ink: "oklch(0.15 0 0)"
typography:
  display:
    fontFamily: "var(--font-poppins), Poppins, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "0.12em"
  headline:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.05em"
  title:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.12em"
  body:
    fontFamily: "var(--font-poppins), Poppins, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.2em"
rounded:
  sm: "0.25rem"
  md: "0.375rem"
  lg: "0.5rem"
  xl: "0.75rem"
  panel: "0.5rem"
  input: "10px"
  pill: "9999px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
  xl: "1.25rem"
  panel-pad: "1rem"
components:
  button-primary:
    backgroundColor: "{colors.soft-readout}"
    textColor: "{colors.near-black-console}"
    rounded: "{rounded.input}"
    padding: "0.875rem 1.25rem"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.holo-cyan}"
    textColor: "{colors.near-black-console}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.holo-cyan}"
    rounded: "{rounded.sm}"
    padding: "0.5rem 1rem"
  input-hud:
    backgroundColor: "{colors.frosted-panel}"
    textColor: "{colors.soft-readout}"
    rounded: "{rounded.input}"
    padding: "1rem 1.25rem"
  hologram-panel:
    backgroundColor: "{colors.frosted-panel}"
    textColor: "{colors.soft-readout}"
    rounded: "{rounded.panel}"
    padding: "{spacing.panel-pad}"
  nav-item-active:
    backgroundColor: "oklch(0.8 0.18 195 / 0.15)"
    textColor: "{colors.holo-cyan}"
    rounded: "{rounded.sm}"
    padding: "0.375rem 0.625rem"
---

# Design System: G-Darko Portfolio

## Overview

**Creative North Star: "Hologram Workshop"**

This is a personal portfolio dressed as a builder’s workshop rendered in hologram glass: precise, technical, and playfully controlled. The HUD is atmosphere and personality — not a competing product. Identity, work proof, and contact must remain readable before chrome, meters, or optional systems theater.

Depth comes from **glow + border** and **frosted glass panels** (backdrop blur, translucent `hud-bg`, inset highlights). Default dark console is the home key; light mode and alternate palettes exist but signature remains G-Darko Holo Cyan / Ops Blue. Anti-references: saturated cyberpunk neon stacks, generic SaaS dashboards, and purple-on-white AI-template looks.

**Key Characteristics:**
- Hologram Workshop mood: craft first, OS costume second
- Precision panels: glow on focus, quiet at rest
- Poppins body + monospace system voice (labels, headers, terminal)
- Glass + cyan/blue glow elevation, not heavy drop shadows
- Bilingual ES/EN surfaces share the same visual grammar

## Colors

Default dark G-Darko palette is normative. Alternate `data-palette` themes remint Holo Cyan / Ops Blue only; status greens/reds/ambers stay readable.

### Primary
- **Holo Cyan** (`oklch(0.8 0.18 195)` dark / `oklch(0.75 0.18 195)` light): accent text, active nav, focus rings, scan accents, primary CTAs on hover.
- **Ops Blue** (`oklch(0.65 0.18 255)` dark / `oklch(0.55 0.18 255)` light): borders, dual-tone glows, progress gradients with cyan.

### Secondary
- **Status Green** (`oklch(0.75 0.2 145)`): success / positive system states.
- **Alert Red** (`oklch(0.65 0.22 25)`): errors, destructive hover, game-over states.
- **Amber Signal** (`oklch(0.85 0.18 80)`): warnings / secondary status.

### Neutral
- **Near-Black Console** (`oklch(0.12 0 0)`): default dark background.
- **Soft Readout** (`oklch(0.95 0 0)`): primary text on dark.
- **Muted Readout** (`oklch(0.65 0 0)`): secondary labels and hints.
- **Frosted Panel** (`oklch(0.08 0.02 240 / 0.85)`): translucent panel fill with blur.
- **HUD Border** (`oklch(0.65 0.18 255 / 0.25)`): structural strokes on panels and chrome.
- Light mode counterparts: **Light Console** / **Light Ink** for non-dark sessions.

### Named Rules
**The One Voice Rule.** Holo Cyan is the speaking accent. Use it for hierarchy and focus — not as a full-bleed wash. Rarity keeps the workshop precise.

**The Signature Palette Rule.** G-Darko (default) is the brand home. Extra palettes are optional visitor toys; new surfaces should design against default dark first.

## Typography

**Display Font:** Poppins (via `--font-poppins`)
**Body Font:** Poppins
**Label/Mono Font:** system UI monospace stack (`font-mono`)

**Character:** Poppins carries human-readable body and profile copy; mono carries OS voice — headers, tracking-wide labels, terminal, ranks. Pairing should feel workshop-instrument, not costume cosplay.

### Hierarchy
- **Display** (Poppins 700, ~1.25rem+, tracking ~0.12em): rare brand moments (boot mark, profile name emphasis).
- **Headline** (mono 700, ~1.125rem): panel titles and mission names.
- **Title** (mono 700, tracking ~0.12–0.3em, often uppercase): channel labels, section stamps.
- **Body** (Poppins 400, 1rem, leading-relaxed): about text, mission briefs, contact description.
- **Label** (mono 700, 0.75–0.875rem, tracking 0.2em+, uppercase): form labels, nav chips, HUD chrome.

### Named Rules
**The Two Voices Rule.** Mono speaks for the system; Poppins speaks for the person. Don’t set long biographical paragraphs in all-caps mono.

## Layout

Full-bleed desktop metaphor: fixed header chrome, optional floating Stack Orb, modal/window panels (`HologramPanel`) centered with `max-w-2xl`, mobile drawer under header. Base radius token `--radius: 0.5rem`. Shell uses comfortable reading size (`text-base leading-relaxed`). Primary hire path should keep ≤4 peer destinations visible; denser utilities belong behind progressive disclosure. Touch targets for primary actions should meet ≥44px on small screens (incumbent header icons are undersized — treat 44px as the design-system target going forward).

## Elevation & Depth

Hybrid: **quiet at rest, luminous on focus.** Resting surfaces use translucent Frosted Panel + thin HUD Border + light ambient glow. Focus/hover adds cyan ring glow and stronger border mix. Contact and panels may use `backdrop-blur-xl` glass density. Avoid multi-layer material card shadows; depth is optical (blur, border, glow), not skeuomorphic lift.

### Shadow Vocabulary
- **HUD ambient** (`var(--hud-glow)` / e.g. `0 0 15px oklch(0.65 0.18 255 / 0.2), 0 0 30px … / 0.08`): panel presence.
- **Panel soft** (`0 0 30px oklch(0.65 0.18 255 / 0.12), 0 0 60px … / 0.06, inset 0 1px 0 oklch(1 0 0 / 0.05)`): HologramPanel shell.
- **Focus whisper** (`0 0 0 1px` cyan mix + `0 0 18px` cyan mix): inputs and active controls.

### Named Rules
**The Quiet Rest Rule.** Glow intensifies for focus, active, or success — not for every static rectangle.

## Shapes

Corners are soft-instrument: `rounded-lg` (~0.5rem) on panels, `10px` on contact inputs/submit, small `rounded` on icon buttons, `rounded-full` for brand mark and orb affordances. Borders are 1px (or 2px on inputs) using HUD Border / cyan mixes. Corner brackets and scanline overlays on hologram chrome are allowed signature geometry; don’t add unrelated sticker/badge chrome.

## Components

Precision panels: glow on focus, quiet at rest.

### Buttons
- **Shape:** ~10px on primary contact submit; smaller rounded rects on HUD chrome.
- **Primary:** Soft Readout fill on Near-Black text, uppercase tracked mono/semibold; hover → cyan→blue gradient + glow.
- **Ghost / HUD:** transparent with cyan text and `border-hud-*`; hover `bg-hud-cyan/10`.
- **Icon controls:** compact; new work should enlarge primary hit areas on mobile.

### Chips
- Mono uppercase / tracked labels for skills and meta; selected states use cyan tint fill + border.

### Cards / Containers
- **HologramPanel:** Frosted Panel + border + ambient glow + backdrop blur; corner accents; header with cyan title + mono subtitle.
- List tiles (certs, missions): light cyan wash (`bg-hud-cyan/5`) + HUD border, not opaque white cards.

### Inputs / Fields
- Rounded 10px, 2px border, soft card mix fill; caret Holo Cyan; focus border + whisper glow.
- Labels: mono uppercase tracked cyan (`contact-label-static`).

### Navigation
- Header: frosted bar (`bg-background/90 backdrop-blur-lg`), mono items; active = cyan tint + soft glow.
- Mobile: grid drawer of module tiles; prefer fewer labeled primary actions in thumb zone for hire path.

### Signature: Hologram Panel
The workshop window — frosted glass, cyan title stamp, optional scanline/corner treatment, close control. All major content modules inherit this shell.

### Signature: Stack Orb / Desktop Atmosphere
Three.js / particle-grid background and orb are atmospheric. They must not outrank name, featured work, or contact in the first durable viewport.

## Do's and Don'ts

### Do:
- **Do** design new surfaces against default dark G-Darko (Holo Cyan + Ops Blue) first.
- **Do** keep glow reserved for focus, active, and confirmation states.
- **Do** use mono for system voice and Poppins for human narrative.
- **Do** preserve bilingual parity in visible chrome and primary CTAs.
- **Do** let work evidence and contact lead; HUD personality supports them.

### Don't:
- **Don't** lead with unskippable boot theater or unexplained completion meters.
- **Don't** treat all seven modules as equal peers on the hire path.
- **Don't** flood the viewport with equal-weight glow on every panel.
- **Don't** invent screenshots, metrics, or case claims where mockups are still placeholders.
- **Don't** restyle the CV into a disconnected generic résumé world if it remains linked from the HUD — keep workshop grammar or use a clear external PDF affordance.
