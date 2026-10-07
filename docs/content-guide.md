# Content guide

How the Rococo Creative team publishes and updates website content. Everything here happens in the Supabase dashboard; no code or redeploy is needed.

- Blog posts live in the `posts` table, case studies in `case_studies`, testimonials in `testimonials`.
- Images live in the public Storage bucket `media`.
- The website only shows rows with `status` set to `published` (and, for posts and case studies, a `published_at` time that has passed).

Open the dashboard, choose the project, then **Table Editor** and the table you need. Use **Insert > Insert row** to add a row, or click a row to edit it in the side panel. Leave `id`, `created_at`, and `updated_at` alone: they fill themselves in.

---

## 1. Publishing a blog post

| Field | Required | What to enter |
| --- | --- | --- |
| `slug` | Yes | The URL: `/blog/<slug>`. See [slug rules](#slug-rules). |
| `title` | Yes | The headline, up to 200 characters. Sentence case. |
| `excerpt` | Recommended | One or two sentences for cards and search results, up to 400 characters. |
| `body` | Yes | The article in Markdown. See [Markdown tips](#markdown-tips). |
| `cover_image_url` | Optional | Public URL of an image in the `media` bucket. See [images](#images-and-alt-text). |
| `cover_image_alt` | With a cover | A description of the image for people who cannot see it. |
| `author_name` | Yes | Defaults to `Rococo Creative`. Use a person's name only with their approval. |
| `author_role` | Optional | For a named author, e.g. their title. |
| `tags` | Recommended | One to three topics. Reuse existing tags with the exact spelling and capitals (`Strategy`, `Websites`, `AI & automation`, `Lead generation`, `SEO`): the Insights page builds its topic filter from them. |
| `reading_minutes` | Leave empty | Calculated from the word count. Fill it in only to override. |
| `word_count` | Never edit | Calculated automatically from `body`. |
| `seo_title` | Optional | Title for search results and social sharing, up to 70 characters. The site adds "\| Rococo Creative". Empty uses `title`. |
| `seo_description` | Optional | Up to 200 characters (aim for about 155). Empty uses `excerpt`. |
| `status` | Yes | `draft` while writing, `published` when ready. |
| `published_at` | To publish | The publication date and time. See below. |

### Draft, published, and scheduled

- **Draft** (`status = draft`): never visible on the website, whatever the date.
- **Published** (`status = published` and `published_at` in the past): visible. The database refuses `published` without a `published_at`.
- **Scheduled** (`status = published` and `published_at` in the future): appears automatically after that time, within about an hour (scheduled posts wait for the hourly refresh, because nothing changes in the table at the moment they go live).
- **Unpublish** by setting `status` back to `draft`. Deleting the row also removes it.

Times are stored in UTC. Enter a full date and time; if in doubt, include the offset, e.g. `2026-11-03 09:00:00-06` for 9:00 a.m. Central Standard Time. The date shown on the article is `published_at`, so set it to the real publication date.

### Slug rules

- Lowercase letters, numbers, and single hyphens only: `local-search-for-contractors`. No spaces, capitals, accents, underscores, or leading or trailing hyphens. The database rejects anything else.
- Short and descriptive. Leave out filler words and dates.
- Unique within its table.
- **Do not change a slug after publishing.** The old URL stops working and any links or search rankings pointing at it are lost. If a change is unavoidable, ask a developer to add a redirect.

### Markdown tips

| Write | To get |
| --- | --- |
| `## Section heading` | A main section. The title is the page's only top-level heading, so never use a single `#`. |
| `### Subheading` | A subsection inside a `##` section. Do not skip levels. |
| A blank line between paragraphs | Separate paragraphs. Keep them short: two to four sentences. |
| `- item` or `1. item` | Bulleted or numbered lists. |
| `**bold**` | Emphasis, used sparingly. |
| `> A single line` | A pull-line in the large display serif. One per article at most. |
| `[Discuss a project](/contact)` | An internal link. Start with `/` for pages on this site. |
| `[Google's guidelines](https://example.com)` | An external link. It opens in a new tab automatically. |
| `![Alt text](https://...)` | An inline image (see below). Alt text goes in the square brackets. |
| A GitHub-style table | A table that scrolls on small screens. |

- Raw HTML is ignored for security, so stick to Markdown.
- Link text should make sense on its own: "read the local search guide", not "click here".
- Close articles with a soft invitation and a link to `/contact`, using the site's CTA wording: "Discuss a project", "Request for Proposal", or "Gain Clarity Today".

### Voice checklist

Before publishing, read the piece once for voice (the full rules are in `CLAUDE.md`):

- Plain, assured sentences about outcomes, in the language of construction owners.
- No exclamation marks, no em dashes (use a period, comma, or colon), no hype.
- None of these words: synergy, tapestry, game-changer, deep dive, delve, unleash, revolutionize, cutting-edge, world-class, best-in-class, supercharge, skyrocket, seamless, leverage (as a verb), "solutions" on its own.
- Write ranges in words: "2 to 3 weeks".
- No invented facts. Every statistic, client name, quote, or result must be real, sourced, and approved.

---

## 2. Publishing a case study

Case studies appear at `/work/<slug>`. The home page shows the first two featured case studies. Get the client's written permission before naming them, and their approval of every quote and number.

| Field | Required | What to enter |
| --- | --- | --- |
| `slug` | Yes | The URL: `/work/<slug>`. Same [slug rules](#slug-rules). |
| `client_name` | Yes | The client's name as they approve it, up to 160 characters. |
| `title` | Yes | What the engagement was, up to 200 characters. Do not promise results in the title. |
| `summary` | Recommended | One or two sentences: who the client is, the business problem, the result. Up to 600 characters. |
| `sector` | Recommended | e.g. `Commercial general contractor`, `Design-build firm`, `Specialty trade contractor`. |
| `location` | Optional | `City, State`. |
| `services` | Recommended | The offerings involved, named exactly as on the Services page (e.g. `Website`, `Local SEO`, `CRM & automation`). One value per item. |
| `challenge` | Yes | Markdown. The starting point, in the client's terms. |
| `approach` | Yes | Markdown. What Rococo did and why, in order. |
| `outcome` | Yes | Markdown. Verified results only. |
| `metrics` | Recommended | Two or three headline figures (format below). |
| `cover_image_url`, `cover_image_alt` | Recommended | Same as blog covers. |
| `website_url` | Optional | The client's site, with `https://`. |
| `year` | Optional | The year the work was completed (2000 to 2100). |
| `featured` | Optional | `true` to show it on the home page (the first two by `sort_order` appear there). |
| `sort_order` | Optional | Lower numbers appear first (featured items always lead). Default `100`. |
| `status`, `published_at` | To publish | Same as blog posts. |

The page supplies the Challenge, Approach, and Outcome headings, so start any subheadings inside those fields at `###`. The starter case studies contain writing prompts for each section; replace the prompts entirely.

### Metrics format

`metrics` is a JSON list. Each entry has a `label`, a `value`, and an optional `note` for the time period and comparison:

```json
[
  { "label": "<What was measured>", "value": "<Verified figure>", "note": "<Time period and comparison>" },
  { "label": "<What was measured>", "value": "<Verified figure>", "note": "<Time period and comparison>" }
]
```

Keep values short (they are set large). Every figure needs a source, a time period, and a comparison, and the client must approve it. If a number cannot be verified, leave it out. Any value that starts with `TODO` is treated as a placeholder.

---

## 3. Publishing a testimonial

| Field | Required | What to enter |
| --- | --- | --- |
| `quote` | Yes | The exact approved words, up to 1,000 characters. Leave out surrounding quotation marks: testimonials are set as display pull-quotes. |
| `author_name` | Yes | The person's name as they approve it. |
| `author_title` | Recommended | Their role, e.g. `President` or `Director of Preconstruction`. |
| `company` | Recommended | Their company. |
| `case_study_id` | Optional | Pick the related case study from the lookup in the side panel. Leave empty if there is none. |
| `featured` | Optional | `true` to give it priority wherever the site highlights testimonials. |
| `sort_order` | Optional | Lower numbers appear first. |
| `status` | Yes | `published` to show it. Testimonials have no date. |

Get written approval for the exact wording, and keep it on file. The strongest testimonials name the problem, what changed, and a concrete result.

---

## Images and alt text

1. In the dashboard, open **Storage > media**.
2. Upload into a folder per item, e.g. `blog/<slug>/cover.jpg` or `work/<slug>/site-01.jpg`. Use lowercase file names with hyphens and no spaces.
3. Click the uploaded file and copy its public URL. It looks like `https://<project-ref>.supabase.co/storage/v1/object/public/media/blog/<slug>/cover.jpg`.
4. Paste it into `cover_image_url`, or into Markdown as `![Alt text](URL)`.

Notes:

- Use landscape images at least 1600 px wide, in JPEG or WebP. Cover images are resized and converted automatically; images inside a Markdown body are not, so keep those under about 300 KB.
- Use real photography of real projects. No stock images of handshakes or hard hats.
- Cover images must come from this project's Storage (the `media` bucket). Images hosted anywhere else will not load as covers.
- To replace an image, upload it under a new file name (e.g. `cover-v2.jpg`) and update the URL. Reusing the old name can leave the previous version cached.
- Make sure you have the rights to every image, and the client's permission for photos of their projects.

**Alt text** describes what the image shows and why it matters, in one sentence. Write "Steel frame of a three-story medical office building, crane at left" rather than "image" or "project photo". Do not start with "Image of". If an image in a Markdown body is purely decorative, leave the brackets empty: `![](URL)`.

---

## How changes go live

- **Within seconds**, if the Supabase Database Webhooks are configured (see README, "Instant updates"). Saving, publishing, unpublishing, or deleting a row tells the website to refresh that content.
- **Within about an hour** otherwise. The website refreshes its content in the background every hour, so every change appears eventually without anyone doing anything.
- No redeploy is needed for anything in the database. Text that lives in the code (navigation, service descriptions, contact details in `src/lib/site.ts` and `src/content/`) changes through a pull request and a deploy.

If a change does not appear: check that `status` is `published`, that `published_at` is in the past (in UTC), and the webhook's recent deliveries under **Database > Webhooks**. Then wait for the hourly refresh.

### Starter content

`supabase/seed.sql` loads the starter articles and placeholder case studies and testimonials (generated from `src/content/fallback.ts` with `npm run db:seed-sql`). Running it again **overwrites** rows with the same slugs, including edits made in the dashboard, so do not re-run it once real content exists.

### Leads

Contact form submissions arrive in `contact_submissions`. Update `status` as you work each lead: `new`, `contacted`, `qualified`, `closed`, or `spam`.

---

## Pre-launch checklist

Search the repository for `TODO` and for `<Placeholder` to find every open item in the code, and run the query at the end of this list to find placeholders in the database. The categories:

**Proof and content**

- [ ] **Case studies:** real client names with written permission, summaries, challenge, approach, and outcome, verified metrics with time periods, sector, location, year, and cover images with alt text. Replace or unpublish all three starter scaffolds (`src/content/fallback.ts` and the `case_studies` table).
- [ ] **Testimonials:** real quotes approved in writing, with name, title, and company. Replace or unpublish both placeholders.
- [ ] **Blog:** review and approve the three starter articles, add cover images with alt text, and confirm dates and author.
- [ ] **About page:** founder and team bios and photography; client logos only with permission.
- [ ] **Every visible `<Placeholder>`** on the site: photography, logos, figures.

**Company facts**

- [ ] **Contact details:** confirm the public email; add phone and service area (`src/lib/site.ts`).
- [ ] **Social profiles and client portal:** add URLs, or leave empty to hide them (`src/lib/site.ts`).
- [ ] **Contact form:** confirm budget bands and the reply-time commitment (`src/content/contact.ts`).
- [ ] **Method:** confirm typical phase durations against real engagements (`src/content/method.ts`).
- [ ] **FAQ and policies:** pricing approach, AI usage, and contract terms, wherever the pages state them.

**Legal**

- [ ] **Privacy notice:** reviewed by counsel, with a correct "Last updated" date (`/privacy`).

**Platform**

- [ ] **Supabase:** migration applied; seed reviewed; `media` bucket present; placeholders removed or set to `draft`.
- [ ] **Webhooks:** one per table (`posts`, `case_studies`, `testimonials`) pointing at `/api/revalidate`, with `REVALIDATE_SECRET` set in Vercel. Edit a post and confirm the change appears within seconds.
- [ ] **Email alerts (optional):** `RESEND_API_KEY`, `CONTACT_NOTIFICATION_TO`, and `CONTACT_NOTIFICATION_FROM` on a verified domain. Send a test inquiry.
- [ ] **Vercel:** environment variables for Production and Preview, domain, and `NEXT_PUBLIC_SITE_URL`.
- [ ] **Brand fonts (optional):** host the licensed Goldenbook and Halcom files and set `NEXT_PUBLIC_BRAND_FONTS_URL`.

**Final sweep**

- [ ] The code search for `TODO` finds only developer comments, not visible copy.
- [ ] This query, run in the SQL Editor, returns no rows:

```sql
select 'posts' as source, slug as item from public.posts
  where status = 'published' and (title like '%TODO%' or excerpt like '%TODO%' or body like '%TODO%')
union all
select 'case_studies', slug from public.case_studies
  where status = 'published' and (client_name like '%TODO%' or summary like '%TODO%' or location like '%TODO%'
    or challenge like '%TODO%' or approach like '%TODO%' or outcome like '%TODO%' or metrics::text like '%TODO%')
union all
select 'testimonials', left(quote, 60) from public.testimonials
  where status = 'published' and (quote like '%TODO%' or author_name like '%TODO%'
    or author_title like '%TODO%' or company like '%TODO%');
```

- [ ] Every page reviewed on a phone and a desktop, including a test submission of the contact form.
