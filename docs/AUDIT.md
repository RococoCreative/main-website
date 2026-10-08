# Audit: Supabase, Vercel, codebase

Run 2026-10-08, before the planned redesign. Read-only: nothing in Supabase or Vercel was changed. Commit audited: `38c5fb1`.

Severity key: **High** = fix before launch or before redesign work starts. **Medium** = fix during the redesign. **Low** = cleanup.

---

## 1. Summary

| Area | Health | Headline |
| --- | --- | --- |
| Vercel | Good | Builds green, 0 runtime errors, security headers set. Site is behind Vercel Authentication until a custom domain is attached. No CSP. |
| Supabase | Good | Schema, RLS, constraints all match the repo. Two security advisor warnings and default write grants, fixed by the unapplied migration. Free plan can pause. |
| Code: correctness | Good | Lint, typecheck, build pass. 0 prod dependency vulnerabilities. Full Next 16 compliance. No tests. |
| Code: accessibility | Strong | axe: 0 violations on 14 routes at 375 and 1280px. Motion fully respects reduced motion. Mobile menu needs `inert`. |
| Code: copy rules | Strong | 0 em dashes, 0 banned words. ~67 visible TODO/Placeholder markers ship today, including real-looking case studies. |
| Code: design system | Mixed | Color discipline is excellent (0 hex in component CSS). Breakpoints, type sizes, cards, and labels are fragmented. This is the main redesign risk. |

---

## 2. Vercel

**Project** `main-website` (`prj_UIIvYdy8K9ASKRvtaBoAZnSMFkpb`), team `rocococreative`, Next.js preset, Node 24.x.

| Check | Result |
| --- | --- |
| Latest production deploy | `dpl_DnreAP2Xiuzb9BXKsJpsMRZccbUs` READY (commit `38c5fb1`) |
| Deploy history | 1 failure (wrong Supabase URL, fixed), 3 READY since |
| Runtime errors (7 days) | None |
| Build | 12s, 32 static pages, all routes prerendered |
| Font fix live | Confirmed: deployed CSS has `--font-sans: "halcom-variable", "halcom", ...` |
| Domains | `main-website-chi-liard.vercel.app`, `main-website-rocococreative.vercel.app`, branch alias. No custom domain. |
| Deployment Protection | Vercel Authentication ON for all URLs except custom domains. **The public cannot see the site yet.** Correct for pre-launch. |
| Env vars | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (all envs), `REVALIDATE_SECRET` (prod + preview, sensitive). No `RESEND_*`, no `NEXT_PUBLIC_SITE_URL`. |
| Security headers | HSTS (2y, includeSubDomains, preload), nosniff, X-Frame-Options SAMEORIGIN, Referrer-Policy, Permissions-Policy. **No CSP.** |
| Canonicals | Point at `main-website-chi-liard.vercel.app` until `NEXT_PUBLIC_SITE_URL` is set |
| Firewall | No custom config (defaults) |

**Findings**

| Sev | Finding | Fix |
| --- | --- | --- |
| High | No `RESEND_*` vars: **nobody is notified when a lead comes in.** Leads only land in Supabase. | Add `RESEND_API_KEY`, `CONTACT_NOTIFICATION_TO`, `CONTACT_NOTIFICATION_FROM` once the sending domain is verified in Resend. |
| Medium | No Content-Security-Policy. | Add a static CSP in `next.config.ts` (`'self'`, `use.typekit.net`, `p.typekit.net`, Supabase storage). |
| Medium | Contact endpoint has no rate limit. | Vercel Firewall rate-limit rule on POST `/contact`, or BotID. |
| Low | Build warns `engines: ">=20.9.0"` will auto-upgrade Node majors. Seed script needs 22.6+. | Set `engines.node` to `"24.x"` (matches the project setting). |
| Low | HSTS `includeSubDomains; preload` will bind every `rocococreative.io` subdomain to HTTPS. | Confirm all subdomains serve HTTPS before attaching the domain, or drop `preload`. |
| Info | Production tracks `claude/loving-brown-7cakyz`. `claude/modest-ptolemy-q9agwf` is an identical copy. | Create `main`, point production at it, delete both `claude/*` branches when ready. |

---

## 3. Supabase

**Project** `qaeulvqapuqsnilcvhwf`, org Rococo Creative Internal, **Free plan**, `ca-central-1`, Postgres 17, ACTIVE_HEALTHY. DB size 11 MB.

| Check | Result |
| --- | --- |
| Tables | `posts` (3), `case_studies` (3), `testimonials` (2), `contact_submissions` (0). RLS on all four. |
| Policies | Match the init migration exactly |
| Constraints | All CHECK and UNIQUE constraints present (slug format, lengths, status enums, email regex, published-has-date) |
| Contact grants | Column-level INSERT only, no read/update/delete for anon |
| Storage | Public `media` bucket, **0 objects**: no imagery uploaded yet |
| Auth | 0 users (site uses no auth) |
| Webhooks | None yet (expected: blocked on custom domain) |
| Migration history | Empty: schema was applied via SQL editor, so `supabase db push` would try to re-run init |
| Live reads | Edge logs show every Vercel build reading all content tables with 200s |
| Extensions | Defaults only (pgcrypto, uuid-ossp, pg_stat_statements, vault) |

**Findings**

| Sev | Finding | Fix |
| --- | --- | --- |
| High | **Free plan pauses after a week of low activity.** The site is static, so the DB sees little traffic. A paused project fails every deploy, breaks revalidation, and rejects leads. | Upgrade to Pro before launch, or add a daily keep-alive. |
| Medium | Security advisor: `public.rls_auto_enable()` is SECURITY DEFINER and callable by anon/authenticated via RPC. | Apply `20261008000000_tighten_grants.sql`. |
| Medium | anon/authenticated hold INSERT/UPDATE/DELETE/TRUNCATE on content tables (Supabase defaults). RLS blocks writes today. | Same migration. |
| Medium | Seeded TODO case studies and testimonials are `status = 'published'`. | Set them to `draft` until real content exists (see section 5). |
| Low | Unindexed FK `testimonials.case_study_id`. | Same migration. |
| Low | Migration history empty. | If adopting the CLI later: `supabase migration repair --status applied 20261007000000`. |
| Low | `database.types.ts` is hand-maintained. | Generate with `supabase gen types` and check in CI. |

---

## 4. Codebase: architecture and security

Lint, typecheck, and build pass. `npm audit --omit=dev`: 0 vulnerabilities (5 high in the dev-only ESLint chain). Seed generator is deterministic and matches `supabase/seed.sql`. No N+1 queries. Revalidation tags match the content layer exactly. Next 16 rules: fully compliant.

| Sev | Location | Finding | Fix |
| --- | --- | --- | --- |
| High | `lib/contact/validation.ts:206-210` | Spam timer is client-supplied; omitting `elapsedMs` bypasses it. No rate limit or CAPTCHA. Each accepted post writes a row (and an email once Resend is on). | Treat missing `elapsedMs` as suspect; add Turnstile or BotID plus a rate limit. |
| Medium | `contact/actions.ts:52-53` | If the Supabase insert fails, no email is sent: the lead is lost. | Send the notification even when the store fails. |
| Medium | `lib/env.ts:19`, `content.ts:213` | A production deploy missing one Supabase var silently ships fallback (TODO) content. | Fail the build when `VERCEL_ENV=production` and Supabase is unset. |
| Medium | `contact/constraints.ts:26` | Honeypot field named `website` can be filled by browser autofill, silently dropping real leads. | Rename to a non-semantic name; log honeypot hits. |
| Medium | `sitemap.ts:30` | Sitemap lists TODO case studies; no noindex on them. | Exclude `isTodo` items from sitemap and noindex them. |
| Low | `api/revalidate/route.ts:76` | `{ expire: 0 }` serves the error page if Supabase blips right after a webhook. | Use `"max"` (stale-while-revalidate). |
| Low | `content.ts` (Supabase client) | No fetch timeout; a hung project can stall the build to the 50s prerender limit. | Pass a fetch with `AbortSignal.timeout`. |
| Low | `blog/[slug]`, `work/[slug]` pages | Arbitrary slugs each cost a DB query. | Check slug regex, `notFound()` before querying. |
| Low | `work/CaseStudyFacts.tsx:47` | `websiteUrl` has no protocol allowlist. | Accept `http:`/`https:` only. |
| Low | `content.ts:243,313` | `select("*")`. | List columns. |
| Low | `content.ts:379`, `format.ts:17`, `motion/hooks.ts:116`, `ui/icons.tsx:37,46` | Unused exports. | Remove. |
| Low | repo | No tests. CI runs lint, typecheck, fallback build only. | Add Vitest for `validation.ts` and revalidate tag mapping. |
| Low | `src/assets/og/*.woff` | OFL fonts committed for OG images (legal, but contradicts the "never commit font files" rule). | Document the exception in CLAUDE.md. |

---

## 5. Codebase: accessibility, motion, copy

**Browser run** (Playwright + axe-core, 14 routes, 375 and 1280px, reduced motion on and off, JS on and off):

- axe: **0 violations** on every route.
- No horizontal overflow. One `<h1>` per page, no skipped levels. Visible focus on every tab stop.
- Mobile menu: focus moves in, Tab is trapped, Escape closes and restores focus.
- Reduced motion and no-JS: no content hidden. All animations gated.
- Copy: 0 em dashes, 0 en dashes, 0 exclamation marks, 0 banned words.

| Sev | Location | Finding | Fix |
| --- | --- | --- | --- |
| High | `lib/site.ts:17` | Footer shows "TODO: Service area ..." as plain text on every page. | Supply the value, or hide it while it is a TODO. |
| High | `content/fallback.ts:399+`, seed | Case study scaffolds publish real-sounding titles, sectors, and dates. Implies client work that may not exist. | Draft them until real, or label every card "Example structure". |
| Medium | `home/HomeTestimonial.tsx:33-51` | TODO quote renders as a display pull-quote with attribution and a case study link. | Render only the Placeholder while TODO. |
| Medium | `layout/MobileMenu.tsx:44-82` | Open menu leaves `main` and footer reachable by screen readers. | `inert` on background content while open. |
| Medium | `layout/MobileMenu.tsx:118-127` | No-JS fallback is a disabled button: no primary nav below 960px. | Link to footer nav, or a `<details>` disclosure. |
| Medium | `services/PillarSection.tsx:67`, `GrowthSystemBuilder.tsx:217` | Non-canonical CTAs ("Discuss strategy", "Discuss this system"). | Use "Discuss a project" with the same preselected href. |
| Low | `ServicesFaq.module.css:102` | +/- ring border on sand is 2.81:1 (needs 3:1). | Darker border on sand. |
| Low | `Card`, `CaseStudyCard`, `NextProject` CSS | Card-link outline removed without the `@supports selector(:has(*))` guard. | Wrap like `PostCard.module.css:40`. |
| Low | `WorkFilter`, `GrowthSystemBuilder`, `LeadFlowPlayer` | Controls render but do nothing with JS off. | `@media (scripting: none) { display: none }`. |
| Low | `ui/Field.tsx:155` | `aria-invalid` on `<fieldset>` is unsupported. | Remove. |
| Low | `SiteFooter.module.css:62`, `CaseStudyHero.module.css:43` | Single-word links 37 to 40px wide. | `min-width: 44px`. |
| Low | `LeadFlowPlayer.tsx:123` | Reduced motion dumps every event into the live region at once. | Announce a one-line summary. |
| Info | `content/method.ts:30-50` | Method durations ("2 to 3 weeks") show as fact. | Confirm before launch. |

**Visible markers shipping today:** ~18 `<Placeholder>`, ~36 TODO chips, ~13 plain TODO strings, plus the footer line on every page. Heaviest: the three case studies (12 to 15 each), `/about` (5), `/privacy` (5, including "Last updated: TODO").

---

## 6. Codebase: design system (redesign readiness)

### What is solid
- **Two-layer tokens:** `--rc-*` primitives feed `--color-*` semantics. 119 tokens in `src/styles/tokens.css`.
- **Themes:** `[data-theme="forest"|"dark"]` and `[data-surface="sand"|"cream"|"alt"]`, applied through `<Section>`.
- **Color discipline:** zero hex/rgb literals in component CSS. SVG illustrations color through `currentColor`, so a palette swap flows through.
- **Strong primitives:** `Section`, `Eyebrow`, `Button`/`ButtonLink`, `SectionHeader`, `Grid`/`Col` are used widely (22 to 37 uses each).

### What will fight a redesign

| # | Issue | Evidence |
| --- | --- | --- |
| 1 | **Breakpoints not tokenized** | 74 media queries across 10 widths (1024 ×34, 768 ×22, 640 ×6, plus 960, 1280, 900, 1100, 479...), 10 container queries, and 960 duplicated in JS (`MobileMenu.tsx:74`). |
| 2 | **Card primitive unused** | `ui/Card` has 0 uses. `PostCard` (323 CSS lines), `CaseStudyCard` (204), `NextProject` (170), `HomeCards` each roll their own. |
| 3 | **Primitive leaks bypass theming** | 87 `var(--rc-*)` refs in 16 files. `SiteHeader` (14) and `SystemSchematic` (21) will not follow a palette change. |
| 4 | **Illustration geometry baked into TS** | `work/blueprint.ts` (1104 lines), `story/BlueprintCanvas.tsx` (457), `story/method/geometry.ts` (359), `SystemSchematic`. 40 literal stroke widths. The blueprint/drafting motif is code, not config. |
| 5 | **Fragmented type scale** | 22 bespoke `clamp()` sizes and 14 raw px sizes outside tokens. 58 of 131 line-heights raw. `--text-body` is 14px while body copy uses `--text-body-lg` (16px). `--text-h1` to `--text-h3` unused. `strong { font-weight: 600 }` contradicts the weight policy. |
| 6 | **Eyebrow/label pattern duplicated** | `blog/MonoLabel.tsx` re-implements `Eyebrow`; `.kicker` and `.eyebrow` classes elsewhere; 52 `text-transform: uppercase` rules; mono set in 45 files. |
| 7 | **Theme blocks hold raw values** | `tokens.css:184-224` uses `#232624`, `#b7ae9f`, `#c9c1b3`, and 8 rgba literals. Missing semantic tokens (on-accent, accent-hover, control-bg, hairline-on-dark) push components to primitives. |
| 8 | **Layout bypasses Grid** | 97 ad hoc `grid-template-columns` in 40 files; 19 rebuild a 12-col grid themselves. ~55 literal max-width measures. `GridGuides` hardcodes 12 and 4 columns. |
| 9 | **Raster-only brand assets** | PNG logos (no SVG), gold baked into the ornament PNG, OG images use Cormorant/Instrument Sans (not brand faces) and 7 hex constants in `lib/og.tsx`. Unused `rococo-icon.png` (99 KB). |
| 10 | **No enforcement** | No stylelint, 14 dead tokens, no z-index scale (values 1 to 1000 ad hoc), global heading/link/`.container` rules that components must override. |

### Blast radius by change type

| Change | Files touched |
| --- | --- |
| **Palette swap** | `tokens.css` primitives and theme blocks; the 16 files leaking `--rc-*`; `lib/og.tsx`, `manifest.ts`, `layout.tsx:46`; logo/ornament PNGs and app icons. |
| **Type swap** | `tokens.css` type groups, `fonts.ts`, `layout.tsx` preconnect, `globals.css` headings, ~36 off-token sizes, `og.tsx` fonts. If the mono texture goes: 45 files. |
| **Grid/layout change** | `Grid`, `Section`, container tokens, 40 files with own grid templates, all 74 media queries, `MobileMenu.tsx:74`, image `sizes` strings, illustration geometry. |
| **Component restyle** | Leverage only through Button, Eyebrow, Section, SectionHeader. Cards and labels restyle per feature. `story/`, `services/`, `work/` visuals (~4,600 CSS lines) are bespoke. |

Size reference: 70 CSS modules, 8,747 lines. Largest directories: `work/` (2,076 TSX / 1,293 CSS), `services/` (1,028 / 1,359), `blog/` (833 / 1,023), `story/leadflow` (769 / 808).

---

## 7. Recommended order

**Before redesign work (makes every later change cheaper):**
1. Tokenize breakpoints (`@custom-media` via the existing Lightning CSS, or a fixed set of 3 to 4 values) and remove the JS copy of 960.
2. Replace the 87 `--rc-*` leaks with semantic tokens; add the missing semantics (on-accent, accent-hover, hairline-on-dark).
3. Consolidate the type scale: map the 36 off-token sizes and raw line-heights to tokens; rename `--text-body`.
4. Decide the fate of the bespoke visuals (blueprint canvas, method drawing, system schematic, lead-flow demo). Keep, restyle, or cut changes the scope more than anything else.

**External, needs Austin:**
1. Apply `20261008000000_tighten_grants.sql` (Supabase write).
2. Upgrade Supabase to Pro, or accept pause risk until launch.
3. Set up Resend and add the three env vars.
4. Adobe Fonts: font display `swap`.
5. Attach custom domain, set `NEXT_PUBLIC_SITE_URL`, create the three webhooks.

**Before launch:** contact spam hardening, lead-loss fallback, CSP, mobile menu `inert`, draft or relabel the scaffold case studies, clear TODO markers.
