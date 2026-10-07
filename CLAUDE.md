@AGENTS.md

# Rococo Creative website: working rules

Marketing site for Rococo Creative, a boutique agency (strategy, design, AI-driven marketing) for **construction company owners and decision-makers**. Next.js 16.4 App Router + TypeScript, Supabase for content, deployed on Vercel.

Brand sources of truth: `docs/brand/Brand-Brief.md`, `docs/brand/Rococo-Design-System.md`, `docs/brand/tokens.reference.css`. Web tokens: `src/styles/tokens.css`.

## Voice and copy

- Elegant, modern, confident, clear, considered. Plain, assured sentences about outcomes. The audience is practical and skeptical of fluff.
- **Never**: exclamation marks, hype, buzzwords, em dashes (—). Use periods, commas, or colons. En dashes only in numeric ranges are also avoided: write "2 to 3 weeks".
- **Banned words**: synergy, tapestry, game-changer, deep dive, delve, unleash, "in today's landscape", "in the dynamic world of", "It's important to note", revolutionize, cutting-edge, world-class, best-in-class, supercharge, skyrocket, seamless, leverage (as a verb in copy), solutions (as a noun on its own).
- Speak the construction audience's language where it clarifies (bids, owners, GCs, subs, jobsite, preconstruction, pipeline, margins), never as a gimmick.
- CTA vocabulary (use verbatim): "Discuss a project", "Request for Proposal", "Gain Clarity Today" (see `src/lib/site.ts` `cta`).
- **Do not invent facts.** No fake clients, quotes, statistics, awards, years in business, team names, or metrics. Anything Rococo must supply is a visible `<Placeholder>` (`src/components/ui/Placeholder.tsx`) and/or a `TODO:` string or comment. Illustrative demos must be labelled as illustrative.
- Section openers use the bracketed mono eyebrow: `<Eyebrow>Areas of expertise</Eyebrow>` renders `[ AREAS OF EXPERTISE ]`. Write labels in sentence case; CSS uppercases.

## Visual rules

- Swiss/International style: 12-column grid (`Grid`/`Col`, `GridGuides`), strong hierarchy, flush-left ragged-right text, generous whitespace, hairline rules, mono numerals for indices ("01").
- Rococo refinement: display serif (`--font-display`) for H1, hero statements, pull-quotes; gold (`--color-accent`) only for ornament, rules, and small marks. **One gold flourish per page** (`<Flourish />`).
- Color balance about 60% paper/neutral, 30% forest, 10% gold. Never gold text on light grounds; text on gold is Ink; white text on forest only.
- **Never hardcode hex values in components.** Use tokens (`var(--color-*)`, `var(--rc-*)`, `var(--space-*)`...). Dark sections use `data-theme="forest"` or `"dark"` (via `<Section theme>`), light alternates via `surface`.
- Body copy 16px (`--text-body-lg`), never below 14px for reading text; line-height 1.65.
- Radii 8 to 16px, restrained warm shadows, hairline borders over heavy effects.

## Accessibility (WCAG 2.1 AA)

- Semantic landmarks; exactly one `<h1>` per page; no skipped heading levels.
- Visible focus on every interactive element (global `:focus-visible` exists; do not remove outlines).
- Real `<button>`/`<a>`; 44px minimum touch targets; keyboard operable; Escape closes overlays.
- Never convey meaning by color alone. Muted text is `--color-text-muted` (AA-safe per surface).
- Decorative SVG/imagery gets `aria-hidden="true"` / `alt=""`. Interactive visuals expose state via text (aria-live where state changes).
- **Motion**: every animation must respect `prefers-reduced-motion`. Reduced motion shows the complete, final, readable state with no movement. Content must never be hidden if JS fails or motion is reduced. Use `usePrefersReducedMotion`, `useInView`, `useScrollProgress` from `src/lib/motion/hooks.ts`, or the CSS-only `<Reveal>`.

## Next.js 16.4 rules for this repo (differs from older Next.js)

Read `node_modules/next/dist/docs/` when unsure. Key rules:

- `cacheComponents: true` and `partialPrefetching: true`. The root layout exports `ensureStatic = "navigation"`: **every route must prerender to static HTML**. The build fails on request-time work.
- Data comes only from `src/lib/content.ts` (cached with `'use cache'` + `cacheLife` + `cacheTag`). Never query Supabase from a page directly. Never call `cookies()`, `headers()`, `connection()`, or read server `searchParams` in pages.
- No `export const revalidate`, `dynamic`, `dynamicParams`, or `fetchCache` (they error under Cache Components).
- `new Date()`, `Date.now()`, `Math.random()` outside a `'use cache'` scope break the build. Format dates from data strings instead.
- `params` is a Promise: `export default async function Page({ params }: PageProps<"/blog/[slug]">) { const { slug } = await params; }`. `PageProps`/`LayoutProps` are global types (no import).
- `generateStaticParams` must return at least one item (content helpers guarantee this).
- `usePathname`/`useSearchParams` in client components must render inside `<Suspense>`.
- `next/image`: `priority` is deprecated; use `preload` or `loading="eager"`. Allowed `quality` values: 75, 90. Static imports for local images.
- `error.tsx` props are `{ error, retry }`. `revalidateTag(tag, profile)` needs two args.
- With Cache Components, routes are kept alive with React `<Activity>`: forms must reset their own state when hidden/revisited where it matters.
- Server Actions: file-level `'use server'`, validate every field, return expected errors as values.
- Turbopack is the default bundler. `npm run lint` runs ESLint directly (`next lint` no longer exists).

## Code conventions

- TypeScript strict. CSS Modules co-located with components (`Component.module.css`). No CSS-in-JS, no Tailwind.
- Keep dependencies lean. Motion is hand-rolled (no animation library). Ask before adding a dependency.
- Server Components by default; `'use client'` only on the leaf that needs interactivity. Pass serializable props only.
- UI primitives live in `src/components/ui` (Button/ButtonLink, Eyebrow, Section, SectionHeader, Grid/Col, Card, Badge, PullQuote, Flourish, Placeholder, Input/Textarea/Select/CheckboxGroup/Checkbox, Logo, icons). Use them; extend rather than duplicate.
- Shared copy: `src/content/services.ts` (pillars and offerings), `src/content/method.ts` (four-phase method), `src/content/contact.ts` (form options), `src/lib/site.ts` (nav, CTAs, contact details).

## Commands

- `npm run dev` · `npm run build` · `npm run lint` · `npm run typecheck` (runs `next typegen` then `tsc`).
- The build works with no environment variables (fallback content from `src/content/fallback.ts`).
- `npm run db:seed-sql` regenerates `supabase/seed.sql` from the fallback content.
