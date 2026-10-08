# Rococo Creative — Design System

**Version 1.2** · Derived from *Brand Kit v1.0*, a live audit of [rocococreative.io](https://www.rocococreative.io), and the official Goldenbook + Halcom fonts and logo family (2026-07-07).

> *A boutique digital agency blending strategy, design, and AI-driven marketing to build elegant, modern brands that move people and outperform the algorithm.*

This is the single source of truth for how Rococo Creative looks, reads, and behaves — across web, decks, social, email, and documents. Pair it with:

| File | Purpose |
|------|---------|
| `fonts.css` | `@font-face` for the real Goldenbook + Halcom web fonts |
| `tokens.css` | Drop-in CSS custom properties — the styling engine (imports `fonts.css`) |
| `tokens.json` | Machine-readable tokens for Figma, tooling, or AI prompts |
| `Brand-Brief.md` | Paste-into-Claude brief for generating on-brand assets in any format |
| `Website-Audit.md` | How the live site measures against this system, with fixes |
| `style-guide.html` | A living, viewable style guide (open in any browser) |
| `fonts/` | Goldenbook + Halcom source OTFs and optimized `woff2/` for the web |
| `logos/` | Full logo family — `svg/` masters and `png/` @2x (dark & light) |

---

## 1. Brand Foundation

**Positioning:** Strategy first, design that lasts & results that matter.
**Mission:** *"We leverage our expertise to elevate your brand and sharpen your future."*
**Promise:** *"Modernize your business without losing its identity."*

**Personality:** Elegant · Modern · Confident · Clear · Considered.
Think *boutique atelier meets data-driven marketing* — the ornament of Rococo restraint applied to contemporary digital work.

### Voice & Tone
Sophisticated yet accessible. Lead with clarity; let confidence come from precision, not volume.

| ✅ Do | ❌ Don't |
|------|---------|
| Write in plain, assured sentences | Use hype, buzzwords, or exclamation marks |
| Speak to outcomes ("sharpen your future") | Lead with jargon or feature lists |
| Use restrained, editorial phrasing | Over-explain or pad |
| Signature framing: *elegant, modern, clarity, confidence, stand out* | Sound like every other agency |

**Signature copy device — bracketed eyebrows:** section labels are set in mono, uppercase, in brackets — e.g. `[ SERVICES OF DISTINCTION ]`, `[ AREAS OF EXPERTISE ]`, `[ SIGNATURE PROJECTS ]`. This is a core brand tell; use it to open sections.

---

## 2. Logo System

A painterly gold damask ornament paired with the **ROCOCO** wordmark (Goldenbook) above tracked-out **CREATIVE** (Halcom). Master files live in `logos/` — `svg/` (vector) and `png/` (@2x). Full set also in the source library at `Rococo Creative - Company/Rococo Logos/` (SVG + PNG @1–4×).

### Variants — pick by space
| Lockup | File stem | Use when |
|--------|-----------|----------|
| **Vertical** | `Rococo_Vertical` | Primary — centered/stacked space (hero, profile, social) |
| **Vertical Alt** | `Rococo_Vertical-Alt` | Alternate stacked proportion |
| **Horizontal** | `Rococo_Horizontal` | Wide space — site header, email banner |
| **Horizontal + Creative** | `Rococo_Horizontal-Creative` | Wide space where "Creative" should read |
| **Wordmark** | `Rococo_Wordmark` | ROCOCO only — tight/legal lockups |
| **Wordmark + Creative** | `Rococo_Wordmark-Creative` | ROCOCO CREATIVE, no ornament |
| **Creative** | `Rococo_Creative` | The "Creative" sub-lockup alone |
| **Icon** | `Rococo_Icon` | Ornament only — favicon, avatar, app icon, watermark |

### Rules
- **Dark vs light:** on **light** grounds use the **Dark** (ink) version; on **dark** grounds use the **Light** (cream) version. Both carry the same gold ornament.
- **Formats:** SVG for digital, PNG @2× for social/email; @4× for print/retina.
- **Clear space:** the width of the **"O"** in ROCOCO on *all* sides.
- **Never:** stretch, skew, recolor outside the palette, alter ornament-to-wordmark proportions, or flatten the painterly gold flourish to a solid fill.

---

## 3. Color

### Brand
| Token | Hex | RGB | Role |
|-------|-----|-----|------|
| `--rc-forest` | `#39443C` | 57,68,60 | **Primary** — buttons, headings, dark UI |
| `--rc-forest-dark` | `#2E3630` | — | Hover / pressed |
| `--rc-sand` | `#E9E1D4` | 233,225,212 | **Secondary** — warm surfaces |
| `--rc-gold` | `#D6B563` | 214,181,99 | **Accent** — matches logo ornament; decorative |

### Neutral ramp (Ink → Paper)
| Token | Hex | Use |
|-------|-----|-----|
| `--rc-paper` | `#FDFDFD` | Primary background |
| `--rc-paper-alt` | `#F3F3F1` | Alternating sections *(added from live site)* |
| `--rc-cream` | `#F0EDE6` | Warm surface / cards *(added from live site)* |
| `--rc-sand-100` | `#E9E1D4` | Deepest warm surface |
| `--rc-border` | `#E4DFD6` | Hairline borders |
| `--rc-text-muted` | `#6B6660` | Muted body text (AA-safe) |
| `--rc-ink` | `#1F1F1F` | Primary text |
| `--rc-ink-950` | `#1C1C1C` | Dark canvas |

### Semantic
| Meaning | Surface / tint | Accessible text |
|---------|----------------|-----------------|
| Success | `#ACCFC0` | `#3F6B54` |
| Error | `#D46A6A` | `#B84A4A` |
| Warning | `#D6B563` (gold) | `#8F6A20` |

### Contrast & usage rules (WCAG, verified)
| Pair | Ratio | Verdict |
|------|-------|---------|
| Ink on Paper | 16.2 : 1 | ✅ AAA |
| Forest on Paper | 10.0 : 1 | ✅ AAA — safe for text & buttons |
| Paper on Forest | 10.0 : 1 | ✅ AAA — white text on forest |
| Ink on Sand | 12.7 : 1 | ✅ AAA |
| Ink on Gold | 8.4 : 1 | ✅ AAA — text on gold must be **Ink**, never white |
| Muted `#6B6660` on Paper | 5.6 : 1 | ✅ AA |
| Site gray `#858585` on Paper | 3.6 : 1 | ⚠️ **Large text only** |
| **Gold on Paper** | **1.9 : 1** | ❌ **Never** gold text on light — decorative only |
| **Red on Paper** | **3.4 : 1** | ❌ Small error text must use `#B84A4A` |

**Rules of thumb**
1. Body text is Ink on Paper/Sand. Headings may be Forest.
2. Gold is for ornament, rules, icons, and large display flourishes — **not** running text.
3. Primary buttons = Forest fill + white label. Text-on-gold = Ink.
4. Keep 60 / 30 / 10 — mostly paper & neutrals, forest for structure, gold as the 10% spark.

---

## 4. Typography

Canonical families: **Goldenbook** (display serif) · **Halcom** (sans) · **Inter** (body). The real fonts are now in hand — hosted via `fonts.css` (optimized WOFF2 in `fonts/woff2/`), so the serif hero renders for real. Fallback stacks in `tokens.css` still degrade gracefully. Weights available: **Goldenbook** Light 300 · Regular 400 · ExtraBold 800 · Black 900 (+ Heavy); **Halcom** Thin 100 · Light 300 · Book/Regular 400 · Medium 500 · Bold 700 · ExtraBold 800 · Black 900 (+ italics).

> **Website update (2026-10-08, Rococo direction):** the website sets body copy in **Halcom Regular**, not Inter, and leans lighter: Goldenbook Light for H1 and display, Halcom Light for H2, Halcom Regular for H3 to H6 and uppercase labels/CTAs. Light is used only at 24px and up. Goldenbook and Halcom are served by the Adobe Fonts kit (see the repo README, Brand fonts). The table below is the original brand spec.

| Style | Font | Size | Weight | Tracking | Notes |
|-------|------|------|--------|----------|-------|
| **H1 · Hero** | Goldenbook Light | 48px | 300 | -0.02em | Display serif; use `--text-h1-fluid` on large screens |
| **H2 · Section** | Halcom Medium | 32px | 500 | — | |
| **H3 · Subsection** | Halcom Medium | 24px | 500 | — | |
| **H4 · Subhead** | Halcom Regular | 20px | 400 | — | |
| **H5 · Minor** | Halcom Regular | 16px | 400 | — | |
| **H6 · Eyebrow** | Halcom Regular | 14px | 400 | 0.14em | Set uppercase, in `[ brackets ]`, mono on web |
| **Body** | Inter Regular | 14px | 400 | — | line-height **1.65**; 14px minimum |
| **Small / Footnote** | Inter Regular | 12px | 400 | — | |
| **Label / CTA** | Halcom Medium | 14px | 500 | 0.08em | **UPPERCASE** |

**Pairing logic:** serif hero for emotion → sans for structure and UI → mono for metadata/eyebrows → Inter for calm, readable body.

---

## 5. Space, Radius, Elevation, Motion

*(Proposed extensions — the Brand Kit defined color & type only; these complete the system.)*

- **Spacing** — 8pt base: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128`. Section rhythm = `--space-9` (96px).
- **Radius** — `sm 4 · md 8 · lg 16 · xl 24 · pill 999`. Default UI radius: `md`.
- **Elevation** — warm-tinted, restrained: `xs → lg`. Luxury doesn't shout; prefer borders and generous space over heavy shadows.
- **Motion** — durations `fast 150 · base 250 · slow 400`; default easing `--ease-out`. Honor `prefers-reduced-motion`.

---

## 6. Core Components

Each component consumes semantic tokens (`--color-*`), so re-theming (incl. dark/forest canvas) is automatic.

### Button
| Variant | Fill | Text | Use |
|---------|------|------|-----|
| **Primary** | Forest → Forest-dark on hover | White | Main action ("Discuss a project") |
| **Secondary** | Transparent, 1px Forest border | Forest | Supporting action |
| **Ghost** | None | Forest | Low-emphasis / inline |
| **Accent** | Gold | **Ink** | Rare, high-signal moments only |

- Padding `--space-3` / `--space-5`; radius `md` (or `pill` for editorial CTAs).
- Label: Halcom Medium, uppercase, `--tracking-label`.
- States: hover (darken + subtle lift), focus (`--focus-ring`), active (translate 1px), disabled (60% opacity, no pointer).
- **A11y:** real `<button>`/`<a>`; visible focus ring; ≥44px touch target.

### Eyebrow / Section Label *(brand signature)*
`[ AREAS OF EXPERTISE ]` — Fragment Mono, 12–14px, uppercase, `--tracking-eyebrow`, muted or gold. Opens every major section.

### Card
Cream surface, `--radius-lg`, `--shadow-sm`, `--space-6` padding, hairline border optional. Eyebrow → H3 → body → link. Hover: lift to `--shadow-md`.

### Input
Paper fill, 1px `--color-border`, `--radius-md`, `--space-3` padding, Inter 14px. Focus: forest border + `--focus-ring`. Error: `--color-error-bg` border + `--color-error-fg` message. Always pair with a visible `<label>`.

### Badge / Tag
Pill, `--rc-cream` bg, Ink text, mono 12px. Status badges use semantic surface + accessible text pairs.

### Blockquote / Pull-quote
Goldenbook, forest, generous margins, optional gold vertical rule. For testimonials and manifesto lines.

### Section pattern
`Eyebrow → H2 → supporting H4 → content`. Alternate `--color-bg` and `--color-bg-alt` between sections; separate with `--section-gap`.

---

## 7. Accessibility Baseline

- Target **WCAG 2.1 AA**. Body text ≥ 4.5:1 (use Ink or `--rc-text-muted`, never the raw site gray for small text).
- Never convey meaning by color alone — pair semantic colors with icon/label.
- Visible, non-color focus state on every interactive element.
- Body never below 14px; line-height 1.65 for reading comfort.
- Respect `prefers-reduced-motion` and `prefers-color-scheme`.

---

## 8. How to Reuse This System

1. **Web / code:** `@import "tokens.css";` (it pulls in `fonts.css`) then style with `var(--token)`. Ship the `fonts/` folder alongside so the faces load. Never hardcode hex.
2. **Framer (the live site):** upload the WOFF2s from `fonts/woff2/` as custom fonts named exactly **"Goldenbook"** and **"Halcom"** — this is the one remaining step to make the site match the kit.
3. **Figma / design tools:** import `tokens.json` as variables/styles; install the OTFs from `fonts/`.
4. **AI generation (any format):** paste `Brand-Brief.md` at the top of a Claude session, then ask for the asset — social post, deck, landing page, email. It carries the palette, type, voice, and rules.
5. **Decks & docs:** forest headings, Inter body, sand/cream section fills, gold as a single accent per page, bracketed eyebrows for section openers.

> Consistency over creativity. If it's not in the tokens, it's not in the brand.
