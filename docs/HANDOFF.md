# Session handoff: Rococo Creative website

Last updated 2026-10-08. Read `CLAUDE.md` (project rules) and `README.md` (setup) first. This file covers state that is not in either. Full Supabase, Vercel, and codebase audit: `docs/AUDIT.md`.

## Where things stand

| Area | State |
| --- | --- |
| Code | Complete and pushed. Branch `claude/loving-brown-7cakyz` is the only remote branch (no `main` yet). |
| Local checks | `npm run typecheck`, `npm run lint`, `npm run build` all pass. Fallback-content build verified with axe (0 violations), overflow, heading and copy checks across all routes. |
| Brand fonts | Kit `jhb8wfa` checked 2026-10-08 (fetched through Firecrawl): it serves `goldenbook` (300, 400, 600) and `halcom-variable` (100 to 900, roman only), all with `font-display: auto`. Tokens previously asked for `"Halcom"`, which matched nothing, so Halcom never rendered; fixed in `src/styles/tokens.css`. Still not seen in a real browser. |
| Vercel | Project `main-website` in team `rocococreative` (`team_hEsbOjSa5AisKpNmIyKVz7WD`), production tracks `claude/loving-brown-7cakyz`. Deploys READY since the Supabase env fix (`dpl_6Ci1RujF1jAWQNiNdrKqjyxNJZMz`, commit `b4a3694`). Only domain: `main-website-chi-liard.vercel.app`. |
| Supabase | Project `qaeulvqapuqsnilcvhwf` ("Rococo Creative - Main Website", org **Rococo Creative Internal**, Free plan, `ca-central-1`). Verified 2026-10-08: four tables with RLS on, policies match the init migration, column-level insert grants on `contact_submissions`, `word_count` generated, public `media` bucket, seed rows (3 posts, 3 case studies, 2 testimonials). Edge logs show the Vercel build reading all three content tables with 200s. `20261008000000_tighten_grants.sql` is in the repo but **not yet applied** (awaiting Austin's go-ahead). |
| Pull request | None opened. Do not open one unless asked. |

## The failed deploy and its fix

- The first deploy used `NEXT_PUBLIC_SUPABASE_URL=https://lbnccszguwtsmtjaqxiv.supabase.co`. That is the wrong project (found on the old `official-website` Vercel project; it is unreachable, likely paused or deleted). The build failed with `ContentError ... TypeError: fetch failed` while prerendering `/blog/[slug]`.
- Correct values, sent to Austin to set in Vercel (Production, Preview, Development) and redeploy:
  - `NEXT_PUBLIC_SUPABASE_URL=https://qaeulvqapuqsnilcvhwf.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_liyyaOC2lebnFsWh0RrOdQ_oPezzmJ4` (public by design)
  - `REVALIDATE_SECRET` is already set in Vercel. Its value is not recorded here (public repo); the same value goes in the Supabase webhook header.
- Resolved: the redeploy with these values succeeded.

How build errors map to causes (every route prerenders, so any Supabase error fails the build):

| Log says | Cause |
| --- | --- |
| `fetch failed` | Host unreachable: wrong URL, or project paused |
| `PGRST205` / relation does not exist | Migration not applied to that project |
| `401` / Invalid API key | Key wrong or from another project |

## Access notes for the next session

- **Supabase connector** now sees only `qaeulvqapuqsnilcvhwf`. Org **Rococo Creative** (`jmfovfahdznikwcuasfp`) holds unrelated projects "Plan Notation" and "Kingdom Estimating Tool": never touch those.
- **Vercel connector** works for team `rocococreative`. Do not decrypt env values unless Austin asks. The old `official-website` project (repo `RococoCreative/official-website`) is unrelated to this codebase.
- **Sandbox network** blocks `use.typekit.net` and `*.supabase.co`. Live checks go through the connectors: Vercel `web_fetch_vercel_url` for deployed pages, Supabase `query_logs`/`execute_sql`, Firecrawl `firecrawl_scrape` for the kit CSS.

## Vercel env rules

- Do not add `NEXT_PUBLIC_SUPABASE_ANON_KEY`: it overrides the publishable key (`src/lib/env.ts`). Do not add the Vercel Supabase integration for the same reason.
- No service role, secret, JWT secret, or `POSTGRES_*` vars: the code does not use them.
- `NEXT_PUBLIC_SITE_URL`: leave unset until a custom domain is attached; then set `https://<canonical domain>` for Production only.
- Optional email alerts: `RESEND_API_KEY`, `CONTACT_NOTIFICATION_TO`, `CONTACT_NOTIFICATION_FROM` (domain verified in Resend).

## Open items, in order

1. Apply `supabase/migrations/20261008000000_tighten_grants.sql` (Austin approves first). Clears both security advisor warnings (`rls_auto_enable` SECURITY DEFINER exposed to anon/authenticated) and the unindexed-FK notice, and drops the default write grants anon/authenticated hold on content tables. RLS already blocked those writes through the API.
2. Adobe Fonts web project: set font display to `swap` (currently `auto`, so text can stay invisible while the kit loads). Optional: add Halcom Variable Italic if articles use `em`; without it the browser synthesizes an oblique.
3. Confirm Goldenbook and Halcom render in a real browser on the deployed site (check headings and body in DevTools > Computed > Rendered Fonts).
4. Attach `rocococreative.io` / `www` to the Vercel project, then set `NEXT_PUBLIC_SITE_URL` and redeploy.
5. Create three Supabase Database Webhooks (`posts`, `case_studies`, `testimonials`; insert/update/delete) to `https://<domain>/api/revalidate` with header `x-revalidate-secret`. Use the custom domain: `*.vercel.app` URLs may sit behind Deployment Protection.
6. Decide on a `main` branch (Vercel production currently tracks `claude/loving-brown-7cakyz`).
7. Pre-launch content checklist in `README.md` (TODO placeholders, privacy review, contact details).

## Working preferences (Austin)

Direct, low-ego, no fluff. Scannable headers and bullets. Never use em dashes. Commit and push to `claude/loving-brown-7cakyz` only; no PR unless asked. Confirm before any action that changes an external service (Vercel settings, Supabase writes, creating projects).
