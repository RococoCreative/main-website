# Rococo Creative: website

The marketing site for **Rococo Creative**, a boutique agency combining strategy, design, and AI-driven marketing for construction companies.

Built with **Next.js 16** (App Router, TypeScript), **Supabase** (content and lead capture), and deployed on **Vercel**. The visual system follows the Rococo Design System v1.2 (`docs/brand/`): modern Swiss structure, refined with Rococo restraint.

---

## Contents

1. [Decisions at a glance](#decisions-at-a-glance)
2. [Quick start](#quick-start)
3. [Environment variables](#environment-variables)
4. [Supabase setup](#supabase-setup)
5. [Deploying to Vercel](#deploying-to-vercel)
6. [Project structure](#project-structure)
7. [Design system](#design-system)
8. [Interactive storytelling components](#interactive-storytelling-components)
9. [Content, caching, and revalidation](#content-caching-and-revalidation)
10. [Contact form](#contact-form)
11. [Brand fonts (Goldenbook + Halcom)](#brand-fonts-goldenbook--halcom)
12. [Accessibility and performance](#accessibility-and-performance)
13. [Pre-launch checklist](#pre-launch-checklist)
14. [Troubleshooting](#troubleshooting)

---

## Decisions at a glance

| Area | Decision | Why |
| --- | --- | --- |
| Framework | Next.js 16.4, App Router, TypeScript, Turbopack | Current stable Next.js with first-party image, font, and metadata APIs. |
| Rendering | Cache Components + `ensureStatic = "navigation"` on the root layout | Every page is prerendered static HTML (fast, cheap, resilient). The build fails if a page accidentally becomes request-time rendered. |
| Data | Supabase (Postgres + RLS) through one cached data layer (`src/lib/content.ts`) | Content edits happen in the Supabase Table Editor; pages refresh hourly or instantly through a webhook. |
| Fallback content | `src/content/fallback.ts` | The site builds and runs with zero configuration. CI and local development need no credentials. |
| Styling | CSS Modules + CSS custom properties (`src/styles/tokens.css`) | Components read tokens directly. No runtime CSS-in-JS, no utility framework. |
| Motion | Hand-written hooks + CSS scroll-driven animations | Zero animation dependencies. Every effect respects `prefers-reduced-motion` and degrades to a complete, readable state. |
| Markdown | `react-markdown` + `remark-gfm`, server-rendered | Safe by default (raw HTML ignored), no client JavaScript. |
| Typography | Cormorant Garamond, Instrument Sans, Inter, Fragment Mono via `next/font` | The brand system's documented fallbacks, self-hosted at build. Licensed Goldenbook/Halcom can be switched on by URL (see below). |
| Email | Optional Resend notification via REST, sent with `after()` | Leads are always stored in Supabase; email is an extra alert that never slows the response. |

Runtime dependencies: `next`, `react`, `react-dom`, `@supabase/supabase-js`, `react-markdown`, `remark-gfm`, `server-only`.

---

## Quick start

Requirements: **Node.js 20.9+** (Node 22 recommended) and npm.

```bash
npm install
cp .env.local.example .env.local   # optional: the site runs without it
npm run dev                         # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server (Turbopack). |
| `npm run build` | Production build. Works with or without Supabase variables. |
| `npm start` | Serves the production build. |
| `npm run lint` | ESLint (flat config, `eslint-config-next`). |
| `npm run typecheck` | Generates route types, then runs `tsc --noEmit`. |
| `npm run check` | Lint + typecheck. |
| `npm run db:seed-sql` | Regenerates `supabase/seed.sql` from `src/content/fallback.ts` (Node 22.6+). |

Without Supabase variables the site serves the starter content in `src/content/fallback.ts`, and contact form submissions are logged to the terminal in development.

---

## Environment variables

Copy `.env.local.example` to `.env.local` for local work. On Vercel, add the same keys in **Project Settings > Environment Variables**.

| Variable | Required | Scope | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | For live content | Public | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | For live content | Public | Anon (or publishable) key. Safe in the browser: RLS limits it to published content and form inserts. `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is also accepted. |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Public | Canonical origin (e.g. `https://www.rocococreative.io`). If unset on Vercel, the production domain is used automatically. |
| `REVALIDATE_SECRET` | For instant updates | Server | Shared secret for the Supabase webhook that calls `/api/revalidate`. Generate with `openssl rand -hex 32`. |
| `RESEND_API_KEY` | Optional | Server | Enables email alerts for new inquiries. |
| `CONTACT_NOTIFICATION_TO` | With Resend | Server | Inbox that receives alerts. |
| `CONTACT_NOTIFICATION_FROM` | With Resend | Server | Sender on a domain verified in Resend, e.g. `Rococo Website <website@rocococreative.io>`. |
| `NEXT_PUBLIC_BRAND_FONTS_URL` | Optional | Public | URL of a stylesheet declaring the licensed Goldenbook + Halcom faces. |

`NEXT_PUBLIC_*` values are inlined at build time: redeploy after changing them.

---

## Supabase setup

### 1. Create the project

Create a project at [supabase.com](https://supabase.com). From **Project Settings > API**, copy the project URL and the anon/publishable key into your environment variables.

### 2. Apply the schema

The schema lives in `supabase/migrations/20261007000000_init.sql`. Choose one:

- **SQL editor (simplest):** open **SQL Editor**, paste the migration, run it.
- **Supabase CLI:**
  ```bash
  npx supabase login
  npx supabase link --project-ref <your-project-ref>
  npx supabase db push
  ```

It creates:

| Table | Purpose | Public access (RLS) |
| --- | --- | --- |
| `posts` | Blog articles (Markdown body, tags, SEO fields) | Read rows where `status = 'published'` and `published_at <= now()` |
| `case_studies` | Work/proof (sector, services, metrics JSON, Markdown sections) | Same as posts |
| `testimonials` | Client quotes, optionally linked to a case study | Read rows where `status = 'published'` |
| `contact_submissions` | Contact form leads | **Insert only** (selected columns). Never readable with the public key. |

It also creates a public Storage bucket named `media` for blog covers and case study images.

### 3. Load the starter content (optional)

`supabase/seed.sql` contains the same starter articles and placeholder case studies as the local fallback. Run it in the SQL editor (or `npx supabase db reset` for a local stack). Placeholders are clearly marked `TODO`: replace them before launch.

### 4. Instant updates (Database Webhook)

Pages refresh at least hourly on their own. For edits to appear within seconds:

1. Set `REVALIDATE_SECRET` in Vercel and redeploy.
2. In Supabase: **Database > Webhooks > Create a new hook**
   - Name: `revalidate-site`
   - Table: `posts` (create one hook per table: `posts`, `case_studies`, `testimonials`)
   - Events: Insert, Update, Delete
   - Type: HTTP Request, Method `POST`
   - URL: `https://<your-domain>/api/revalidate`
   - HTTP header: `x-revalidate-secret: <REVALIDATE_SECRET>`

The handler (`src/app/api/revalidate/route.ts`) expires the matching cache tags (list + the specific slug). Test it:

```bash
curl -X POST https://<your-domain>/api/revalidate \
  -H "content-type: application/json" \
  -H "x-revalidate-secret: $REVALIDATE_SECRET" \
  -d '{"type":"UPDATE","table":"posts","record":{"slug":"speed-to-lead-the-first-hour"}}'
```

### 5. Managing content

See `docs/content-guide.md` for publishing posts, case studies, and testimonials in the Table Editor (drafts, `published_at`, slugs, Markdown, images, alt text). Leads arrive in **Table Editor > contact_submissions**; update `status` as you work them (`new`, `contacted`, `qualified`, `closed`, `spam`).

### 6. Types

`src/lib/supabase/database.types.ts` mirrors the migration. After schema changes, regenerate:

```bash
npx supabase gen types typescript --project-id <ref> --schema public > src/lib/supabase/database.types.ts
```

---

## Deploying to Vercel

1. **Connect GitHub.** In Vercel, **Add New > Project**, import `RococoCreative/main-website`. The framework preset is detected as Next.js; keep the default build command (`next build`) and output settings.
2. **Environment variables.** Add the variables above for **Production** and **Preview** (Preview can point at a separate Supabase project if you want to test schema changes safely).
3. **Deploy.** Every push to `main` deploys to production; every pull request and branch gets its own preview URL automatically.
4. **Domain.** Add `rocococreative.io` / `www.rocococreative.io` under **Settings > Domains** and set `NEXT_PUBLIC_SITE_URL` to the canonical one.
5. **Webhook.** Point the Supabase webhooks at the production domain (step 4 above).

Notes:

- Preview deployments are kept out of search engines automatically (`robots.txt` disallows crawling when `VERCEL_ENV` is not `production`, and pages carry `noindex`).
- GitHub Actions (`.github/workflows/ci.yml`) runs lint, typecheck, and a credential-free build on every pull request.
- Security headers (HSTS, `nosniff`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`) are set in `next.config.ts`.
- Consider enabling **Vercel Firewall** rate limiting or **BotID** for `/contact` if spam appears; the form already uses a honeypot and a minimum fill time.

---

## Project structure

```
src/
  app/                      Routes (App Router)
    page.tsx                Home: the brand story
    services/  work/  work/[slug]/  blog/  blog/[slug]/  about/  contact/  privacy/
    api/revalidate/         Supabase webhook -> cache invalidation
    layout.tsx              Fonts, metadata, header/footer, JSON-LD, static guardrail
    opengraph-image.tsx     Branded social image (per-slug images in work/ and blog/)
    sitemap.ts robots.ts manifest.ts icon.png apple-icon.png favicon.ico
    error.tsx global-error.tsx not-found.tsx
  components/
    ui/                     Design-system primitives (Button, Eyebrow, Section, Grid, Card, Badge, PullQuote, Field...)
    layout/                 SiteHeader, MobileMenu, SiteFooter, PageHero, CtaBand
    story/                  Interactive storytelling (BlueprintCanvas, MethodScroller, LeadFlowDemo, KineticStatement)
    home/ services/ work/ blog/ about/ contact/   Page-specific components
    content/Markdown.tsx    Safe server-side Markdown renderer
    motion/Reveal.tsx       Zero-JS scroll reveal (CSS scroll-driven animations)
  content/                  Shared copy: services, method, contact options, fallback content
  lib/
    content.ts              Cached data layer (Supabase or fallback)
    supabase/               Client + schema types
    motion/hooks.ts         Reduced-motion, in-view, scroll-progress hooks
    env.ts site.ts seo.ts og.tsx format.ts
  styles/tokens.css         Design tokens (mirrors docs/brand/tokens.reference.css)
supabase/
  migrations/               Schema, RLS, storage bucket
  seed.sql                  Starter content (generated)
docs/
  brand/                    Brand brief, design system, reference tokens, font template
  content-guide.md          How to publish content
```

---

## Design system

Tokens live in `src/styles/tokens.css` and mirror `docs/brand/tokens.reference.css` (Design System v1.2). Components use semantic tokens (`--color-bg`, `--color-text`, `--color-heading`, `--color-primary`...), so a section re-themes by attribute:

```tsx
<Section surface="alt">...</Section>        // paper-alt
<Section surface="sand">...</Section>       // warm sand
<Section theme="forest">...</Section>       // forest canvas: light text, gold accents, gold buttons with ink text
```

Primitives (`src/components/ui`):

| Component | Notes |
| --- | --- |
| `Button` / `ButtonLink` | Variants `primary` (forest), `secondary` (outlined), `ghost`, `accent` (gold with ink text). Sizes `md`, `lg`; `pill`; `arrow`. 44px minimum target. |
| `Eyebrow` | The bracketed mono signature: `<Eyebrow index="01">Areas of expertise</Eyebrow>`. |
| `Section`, `SectionHeader`, `Grid`/`Col`, `GridGuides` | 12-column Swiss grid and the brand section pattern (eyebrow, H2, supporting copy). |
| `Card`, `Badge`, `PullQuote`, `Flourish` | Cream cards with stretched links; status badges pair color with icons; display-serif pull-quotes; the one gold flourish per page. |
| `Input`, `Textarea`, `Select`, `CheckboxGroup`, `Checkbox` | Visible labels, hints, inline errors wired with `aria-describedby`/`aria-invalid`. |
| `Placeholder` | Visible TODO marker for assets and facts Rococo must supply. |
| `Logo` | `Rococo_Horizontal@2x.png` (dark) and the light variant for dark grounds. Never recolored. |

**Accessibility extensions to the brand tokens** (documented in `tokens.css`):

- On Sand, the kit's muted text (`#6B6660`) measures 4.38:1, below AA. Sand and cream surfaces use `#5A554F` (5.69:1).
- The kit's hairline (`#E4DFD6`, 1.3:1) cannot be the only edge of a form control (WCAG 1.4.11). Inputs use `--color-border-strong` (`#8C857A`, 3.59:1).
- On forest, muted text lifts to `#C9C1B3` (5.69:1).

---

## Interactive storytelling components

Each interactive piece tells part of the brand story. All are client components with reduced-motion and no-JS fallbacks that show the complete content.

| Component | Where | Story |
| --- | --- | --- |
| `BlueprintCanvas` | Home hero | "Structure first, then ornament." A Swiss grid and building elevation draw themselves like a construction drawing; the Rococo ornament arrives last. A drafting crosshair follows fine pointers. |
| `KineticStatement` | Home | The manifesto line resolves word by word as it scrolls into view. |
| `MethodScroller` | Home `#method` | The four-phase method (Survey, Foundation, Frame, Finish) told as a building assembling layer by layer while the phases scroll past. |
| `LeadFlowDemo` | Home (forest section) | An illustrative inquiry played two ways: without a system it is lost overnight; with one it becomes a booked walkthrough. Shows the martech offer instead of describing it. |
| `GrowthSystemBuilder` | Services | Pick offerings or a preset and watch the system assemble; hands the selection to the contact form. |
| `Reveal` | Anywhere | Zero-JS entrance animation using CSS scroll-driven animations. |

---

## Content, caching, and revalidation

- All reads go through `src/lib/content.ts`. Each function is a `'use cache'` scope with `cacheLife("hours")` and tags (`posts`, `post:<slug>`, `case-studies`, `case-study:<slug>`, `testimonials`).
- Pages prerender at build time. Content refreshes in the background hourly, or immediately when the webhook calls `/api/revalidate`.
- Source rules: no Supabase variables means fallback content; with Supabase configured the database is the source of truth (an empty table shows an empty state); a failed query throws, so a deploy fails loudly and a runtime refresh keeps serving the last good page. Placeholder content never replaces real content.
- Unknown slugs return a real HTTP 404.

---

## Contact form

`/contact` posts to a Server Action (`src/app/contact/actions.ts`):

1. Server-side validation of every field against the same option lists the form renders.
2. Spam defenses: hidden honeypot field and a minimum fill time. Suspected spam receives a normal success message and is not stored.
3. Storage: insert into `contact_submissions` with the public key (insert-only RLS, column-level grants).
4. Optional email alert via Resend, sent after the response with `after()`.
5. Accessible feedback: error summary with links to fields, inline errors, focus management, and a confirmation panel.

Deep links: `/contact?intent=proposal`, `/contact?intent=clarity`, and `/contact?services=website,automation` (offering ids from `src/content/services.ts`) pre-configure the form.

---

## Brand fonts (Goldenbook + Halcom)

Goldenbook and Halcom are commercial fonts licensed for Rococo's use. **This repository is public, so the font files are not committed.** The site ships with the brand system's documented fallbacks (Cormorant Garamond for Goldenbook, Instrument Sans for Halcom), self-hosted through `next/font`.

To switch on the licensed faces without committing them:

1. Upload the WOFF2 files (Goldenbook Light/Regular, Halcom Light/Regular/Medium) to a public location you control, such as a public Supabase Storage bucket.
2. Copy `docs/brand/brand-fonts.example.css` next to them as `brand-fonts.css` and set the base URL.
3. Set `NEXT_PUBLIC_BRAND_FONTS_URL` to that stylesheet's URL and redeploy.

The token font stacks list `"Goldenbook"` and `"Halcom"` first, so they take over as soon as the stylesheet loads. If the repository is made private later, you can instead self-host them with `next/font/local`.

---

## Accessibility and performance

- WCAG 2.1 AA target: semantic landmarks, one H1 per page, skip link, visible focus rings, 44px targets, labelled form controls, error summaries, and no color-only meaning.
- `prefers-reduced-motion` is honored globally and in every interactive component.
- Static HTML for every route; minimal client JavaScript (interactive leaves only).
- `next/font` self-hosting with `display: swap`; `next/image` with AVIF/WebP for remote images.
- Open Graph images rendered at build (`next/og`), sitemap and robots generated from content.

---

## Pre-launch checklist

Search the codebase for `TODO` to find every item. The main categories:

- [ ] Real case studies: client names (with permission), challenge/approach/outcome, verified metrics, imagery.
- [ ] Real, approved testimonials.
- [ ] Founder/team bios and photography; client logos (with permission).
- [ ] Contact details: phone, service area, social profiles, client portal link (`src/lib/site.ts`).
- [ ] Budget bands and response-time commitments on the contact page (`src/content/contact.ts`).
- [ ] Typical phase durations and FAQ policies (pricing, AI usage, contract terms).
- [ ] Privacy notice reviewed by counsel; "Last updated" date.
- [ ] Review the three starter articles.
- [ ] Optional: host licensed Goldenbook/Halcom and set `NEXT_PUBLIC_BRAND_FONTS_URL`.
- [ ] Supabase: migration applied, seed reviewed, webhooks configured, `REVALIDATE_SECRET` set.
- [ ] Vercel: environment variables, domain, `NEXT_PUBLIC_SITE_URL`.

---

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Build fails with "uncached data" or an `ensureStatic` error | A page read request-time data (`cookies()`, `headers()`, server `searchParams`, `new Date()`, or an uncached query). Move data access into `src/lib/content.ts` (`'use cache'`) or into a client component. |
| Build fails with a Supabase error | The project URL/key is wrong or the migration was not applied. The previous deployment stays live. |
| Content edits do not appear | Check the webhook's recent deliveries in Supabase and the `REVALIDATE_SECRET` value. Without the webhook, changes appear within an hour. |
| Contact form says it is unavailable in production | Supabase variables are missing in that environment. |
| Remote images do not load | Images must come from your Supabase project's public Storage URL (`/storage/v1/object/public/...`). Other hosts must be added to `images.remotePatterns` in `next.config.ts`. |
