# Session handoff: Rococo Creative website

Last updated 2026-10-08. Read `CLAUDE.md` (project rules) and `README.md` (setup) first. This file covers state that is not in either.

## Where things stand

| Area | State |
| --- | --- |
| Code | Complete and pushed. Branch `claude/loving-brown-7cakyz` is the only remote branch (no `main` yet). |
| Local checks | `npm run typecheck`, `npm run lint`, `npm run build` all pass. Fallback-content build verified with axe (0 violations), overflow, heading and copy checks across all routes. |
| Brand fonts | Goldenbook + Halcom load from Adobe Fonts kit `jhb8wfa` (`adobeFontsKit` in `src/app/fonts.ts`). Not yet seen rendering: `use.typekit.net` is blocked in the cloud sandbox. |
| Vercel | Project `main-website` created by Austin in team `rocococreative` (`team_hEsbOjSa5AisKpNmIyKVz7WD`), importing branch `claude/loving-brown-7cakyz`. First deploy failed (see below). |
| Supabase | Website project `qaeulvqapuqsnilcvhwf` ("Rococo Creative - Main Website") in org **Rococo Creative Internal** (Free plan). Austin ran `supabase/migrations/20261007000000_init.sql` and `supabase/seed.sql` there. Not yet verified by Claude. |
| Pull request | None opened. Do not open one unless asked. |

## The failed deploy and its fix

- The first deploy used `NEXT_PUBLIC_SUPABASE_URL=https://lbnccszguwtsmtjaqxiv.supabase.co`. That is the wrong project (found on the old `official-website` Vercel project; it is unreachable, likely paused or deleted). The build failed with `ContentError ... TypeError: fetch failed` while prerendering `/blog/[slug]`.
- Correct values, sent to Austin to set in Vercel (Production, Preview, Development) and redeploy:
  - `NEXT_PUBLIC_SUPABASE_URL=https://qaeulvqapuqsnilcvhwf.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_liyyaOC2lebnFsWh0RrOdQ_oPezzmJ4` (public by design)
  - `REVALIDATE_SECRET` is already set in Vercel. Its value is not recorded here (public repo); the same value goes in the Supabase webhook header.
- Outcome of that redeploy is unknown at handoff. Check it first.

How build errors map to causes (every route prerenders, so any Supabase error fails the build):

| Log says | Cause |
| --- | --- |
| `fetch failed` | Host unreachable: wrong URL, or project paused |
| `PGRST205` / relation does not exist | Migration not applied to that project |
| `401` / Invalid API key | Key wrong or from another project |

## Access notes for the next session

- **Supabase connector** previously saw only org **Rococo Creative** (`jmfovfahdznikwcuasfp`, Pro), which holds unrelated projects "Plan Notation" and "Kingdom Estimating Tool". Do not touch those. Austin is reconnecting the connector to include **Rococo Creative Internal**. If `list_projects` now shows `qaeulvqapuqsnilcvhwf`, verify: four tables (`posts`, `case_studies`, `testimonials`, `contact_submissions`), RLS policies and anon grants from the migration, the `word_count` generated column, the public `media` bucket, seeded rows, and `get_advisors`.
- **Vercel connector** works for team `rocococreative`. Do not decrypt env values unless Austin asks. The old `official-website` project (repo `RococoCreative/official-website`) is unrelated to this codebase.
- **Sandbox network** blocks `use.typekit.net` and `*.supabase.co`. Live checks must go through the connectors or a deployed URL.

## Vercel env rules

- Do not add `NEXT_PUBLIC_SUPABASE_ANON_KEY`: it overrides the publishable key (`src/lib/env.ts`). Do not add the Vercel Supabase integration for the same reason.
- No service role, secret, JWT secret, or `POSTGRES_*` vars: the code does not use them.
- `NEXT_PUBLIC_SITE_URL`: leave unset until a custom domain is attached; then set `https://<canonical domain>` for Production only.
- Optional email alerts: `RESEND_API_KEY`, `CONTACT_NOTIFICATION_TO`, `CONTACT_NOTIFICATION_FROM` (domain verified in Resend).

## Open items, in order

1. Confirm the redeploy with the corrected Supabase values succeeds; if not, diagnose from the table above.
2. Verify the Supabase schema once the connector can see `qaeulvqapuqsnilcvhwf`.
3. Check Goldenbook and Halcom render on the deployed site; confirm the Adobe Fonts web project includes Goldenbook Light and Halcom Light, Regular, Medium, Bold, with font display `swap` (README > Brand fonts).
4. Attach `rocococreative.io` / `www` to the Vercel project, then set `NEXT_PUBLIC_SITE_URL` and redeploy.
5. Create three Supabase Database Webhooks (`posts`, `case_studies`, `testimonials`; insert/update/delete) to `https://<domain>/api/revalidate` with header `x-revalidate-secret`. Use the custom domain: `*.vercel.app` URLs may sit behind Deployment Protection.
6. Decide on a `main` branch (Vercel production currently tracks `claude/loving-brown-7cakyz`).
7. Pre-launch content checklist in `README.md` (TODO placeholders, privacy review, contact details).

## Working preferences (Austin)

Direct, low-ego, no fluff. Scannable headers and bullets. Never use em dashes. Commit and push to `claude/loving-brown-7cakyz` only; no PR unless asked. Confirm before any action that changes an external service (Vercel settings, Supabase writes, creating projects).
