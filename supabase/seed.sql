-- =============================================================================
-- Rococo Creative: starter content
--
-- GENERATED FILE. Do not edit by hand.
--   Source:      src/content/fallback.ts
--   Regenerate:  npm run db:seed-sql   (scripts/generate-seed.ts)
--
-- Run it AFTER the schema migration (supabase/migrations/20261007000000_init.sql):
--   * Supabase dashboard: SQL Editor > New query, paste this whole file, Run.
--   * Supabase CLI with a local stack: npx supabase db reset
--     (re-creates the LOCAL database, applies migrations, then runs this file).
--     Never reset a linked production project: it deletes all data.
--
-- What it does (one transaction; safe to run more than once)
--   * Blog posts and case studies are upserted by slug. Re-running OVERWRITES
--     rows with these slugs, including edits made in the dashboard.
--   * Placeholder testimonials (quote beginning with 'TODO:') are deleted and
--     re-inserted, linked to their case study by slug.
--   * Everything is inserted as published so a new project matches the local
--     fallback content. Case studies and testimonials are PLACEHOLDERS: replace
--     them with real, approved content (or set status = 'draft') before launch.
-- =============================================================================

begin;

-- Blog posts (3)
insert into public.posts (
  slug, title, excerpt, body, cover_image_url, cover_image_alt, author_name, author_role, tags, reading_minutes, seo_title, seo_description, status, published_at, created_at, updated_at
) values (
  'your-website-is-a-bid-package',
  'Your website is a bid package. Treat it like one.',
  'Owners, developers, and architects read your website the way you read a set of drawings: looking for evidence that you are organized, capable, and safe to hire. Here is what they look for, and a checklist to test your own.',
  $rococo_md$Before an owner calls you, they have already reviewed you. Long before a prequalification form or a request for qualifications, someone on the owner's side has typed your company name into a search bar and opened your website. That visit is quiet. You will not know it happened, and you will not get a second chance to make it count.

Owners, developers, and architects read your website the way you read a set of drawings. They look for completeness, for consistency, and for evidence that the people behind it are organized. Give the site the same care you give a bid package, because in practice that is how it gets used.

## How owners, developers, and architects review a contractor

The people who build shortlists rarely have time for a long look. They open your site on a phone between meetings, or at a desk with three other firms open in other tabs. Each reader arrives with a different question:

- **Owners and developers** want to know whether you have built this type of project, at this scale, and whether it went well.
- **Owner's representatives and project managers** look for signs of control: a defined process, schedule discipline, and people who return calls.
- **Architects and engineers** want a partner who will protect the design intent and contribute in preconstruction.
- **Risk and procurement teams** need the basics confirmed: licensing, insurance, bonding capacity, and a safety program that exists on paper and on site.

None of them will fill out your contact form to ask what is missing. If the answer is not on the page, they move to the next firm on the list.

## What a credible construction website contains

### A portfolio with real specifications

A gallery of attractive photos is not a portfolio. Each featured project should read like a short project sheet:

- Sector and building type
- Size, in square feet, units, or the measure your clients use
- Scope of work and your role on the team
- Delivery method: design-build, CM at risk, negotiated, or hard bid
- Location and completion date
- Photographs of the finished work, and a few from construction

Schedule and budget outcomes belong here too, but only where you can verify them. Let visitors filter by sector, and lead with the work you want more of, not simply the most recent job.

### Safety and quality evidence

Every contractor says safety comes first. Show how. Describe your safety program, who runs it, how crews are trained, and how incidents are reviewed. Do the same for quality: your QA/QC process, inspections, punch list and closeout, and how you handle warranty calls. If you publish safety figures or certifications, publish only what you can keep current.

### Leadership and team

Owners hire people, not logos. Introduce your leadership with real photos, roles, and backgrounds, and go further than the principals. The project managers and superintendents who would run the job are often the people a client most wants to see.

### Process

Explain how a project runs with you, from the first conversation through preconstruction, estimating, scheduling, construction, and closeout. One clear page answers questions that would otherwise take a meeting, and it shows that you work from a method rather than a habit.

### A clear service area

State where you work and, if it helps, where you do not. A plain service area saves time on both sides and helps search engines connect you with the right markets.

### Speed and mobile performance

Your site will often be opened on a phone, sometimes on a weak signal from a jobsite trailer. Pages should load quickly, images should be compressed, text should be readable without zooming, and phone numbers should be tappable.

### Clear paths to contact and to submit bid invitations

Different visitors need different doors. An owner with a project needs an obvious way to start a conversation. A general contractor inviting you to bid needs a dedicated email address or a short form for bid invitations. Subcontractors, suppliers, and job seekers need their own routes, so they do not crowd the inbox that matters most. Every path should end with a named person who responds.

## Where construction websites usually fall short

The common failures are easy to spot once you look for them:

- Project photos with no scope, size, or sector
- News and projects that stopped being updated years ago
- Stock images of handshakes and hard hats that could belong to any firm
- Claims of quality, integrity, and service with nothing to support them
- A single contact form that feeds a shared inbox no one owns
- Slow, heavy pages, and PDF brochures that are unreadable on a phone

Each of these reads as a signal about how you run a job. An outdated site suggests inattention. A vague portfolio suggests thin experience. A form that goes unanswered suggests that questions during construction will go unanswered too.

> An owner will never tell you that your website cost you the shortlist. They simply call the next firm on the list.

## A practical checklist

Run this review on your own site, on a phone, as if you were an owner seeing it for the first time. Better still, ask someone outside the company to do it.

1. Can a stranger tell what you build, for whom, and where, from the first screen?
2. Do your featured projects show sector, size, scope, delivery method, and your role?
3. Are the projects you feature the kind you want more of?
4. Is there a page on safety and quality with evidence rather than adjectives?
5. Can a visitor see the people who would run their project?
6. Is your service area stated plainly?
7. Does the site load quickly on a phone, and can you read it without zooming?
8. Is there an obvious way for an owner to start a conversation, and a separate one for bid invitations?
9. Does every form reach a named person who replies the same business day?
10. Is anything out of date: projects, staff, licenses, or the copyright year in the footer?

Every "no" is a fix. Start with the items closest to the shortlist decision: projects, people, and contact paths.

## Keep it current, like any document you submit

A website is not a one-time project. Assign one person to own it. Add each completed project while the photos and details are fresh, and make collecting them part of your closeout checklist: final photography, size, scope, delivery method, and a short note on what went well. Review the whole site each quarter, the way you would review your qualifications package before sending it out.

When an inquiry does arrive, what happens in the next hour matters as much as the website that produced it. We cover that in [Speed to lead: what happens in the first hour after an inquiry](/blog/speed-to-lead-the-first-hour).

## A second set of eyes

It is hard to read your own website the way a stranger does. If you would like an outside review written from the owner's side of the table, we are glad to talk it through. [Discuss a project](/contact) with us, and we will tell you plainly what we would fix first.$rococo_md$,
  null,
  null,
  'Rococo Creative',
  null,
  ARRAY['Strategy', 'Websites']::text[],
  null,
  'Your construction website is a bid package',
  'How owners and architects review a contractor''s website before shortlisting, what a credible construction website contains, and a checklist to test yours.',
  'published',
  '2026-09-15T14:00:00.000Z'::timestamptz,
  '2026-09-15T14:00:00.000Z'::timestamptz,
  '2026-09-15T14:00:00.000Z'::timestamptz
)
on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  body = excluded.body,
  cover_image_url = excluded.cover_image_url,
  cover_image_alt = excluded.cover_image_alt,
  author_name = excluded.author_name,
  author_role = excluded.author_role,
  tags = excluded.tags,
  reading_minutes = excluded.reading_minutes,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  status = excluded.status,
  published_at = excluded.published_at;

insert into public.posts (
  slug, title, excerpt, body, cover_image_url, cover_image_alt, author_name, author_role, tags, reading_minutes, seo_title, seo_description, status, published_at, created_at, updated_at
) values (
  'speed-to-lead-the-first-hour',
  'Speed to lead: what happens in the first hour after an inquiry',
  'Good work is often lost before the first conversation. How to map what happens to your inquiries today, build a response system that works after hours, and use AI where it helps while people stay in the loop.',
  $rococo_md$An inquiry is a perishable asset. The moment an owner submits a form or leaves a voicemail, they are paying attention to their project and, often, to more than one contractor. That attention fades quickly. A reply that arrives the next afternoon lands after they have already spoken to someone else, or after the urgency that prompted them to reach out has passed.

Many contractors lose these opportunities not on price or capability, but in the gap between the inquiry and the first real conversation. That gap is a process problem, and process problems can be fixed without adding headcount.

## Why inquiries go stale

Inquiries rarely arrive at convenient times. They come in while your estimator is finishing a bid, while your project managers are on site, after hours, and over the weekend. They land in a shared inbox where everyone assumes someone else will answer, or in a voicemail box nobody checks until Monday.

Meanwhile, the person on the other end keeps moving. A developer evaluating sites, a facilities manager with a failing roof, or a homeowner planning an addition will often contact several firms and talk to whoever responds first with something useful. Being first does not guarantee the work. Being late can remove you from consideration before anyone discusses your capabilities.

## Map what happens today

Before you design anything, find out what actually happens now. Pull the last twenty or thirty inquiries from every channel: website forms, phone calls, emails, referrals, and plan room invitations. For each one, record:

- When it arrived, and through which channel
- Who saw it first
- When the first reply went out, and whether a person or a system sent it
- What the reply said
- Whether a call, walkthrough, or site visit was booked
- How it ended: won, lost, no response, or unknown

Then test the system yourself. Submit an inquiry through your own website on a weekday afternoon and again on a Friday evening. Call your main number after hours. Note what happens and how long it takes.

You will likely find familiar problems: forms routed to an address nobody monitors, no clear owner for each inquiry, follow-up that depends on someone's memory, and a long list of opportunities with no recorded outcome. That map becomes your baseline.

## Design a response system

A good response system is simple enough to run during your busiest week. It has six parts.

### 1. Instant acknowledgment

Within a minute of an inquiry, send a short confirmation by email or text. Say who will follow up, by when, and what happens next. Write it in your own voice, not "Your submission has been received." A clear acknowledgment buys you time and tells the owner they are dealing with an organized firm.

### 2. Routing

Decide in advance who owns each type of inquiry. Commercial projects might go to a business development lead, residential work to a project coordinator, bid invitations to estimating, and vendor solicitations somewhere else entirely. Every inquiry needs one named owner, and a backup for the days that person is on site.

### 3. Qualification questions

Ask a few questions early so the first conversation is productive: project type, location, approximate size or budget range, timeline, delivery method, whether drawings exist, and who makes the decision. Keep the web form short and gather the rest on the first call. The goal is to understand fit quickly, not to put the owner through an application.

### 4. Booking links

Once an inquiry looks like a fit, offer a booking link for a call or a site visit, tied to real calendar availability. It removes days of phone tag and lets an owner commit while the project is top of mind.

### 5. Follow-up cadence

Many owners will not reply to the first message. Set a defined sequence: a personal reply the same day, a follow-up the next business day, another a few days later, and a final check-in the following week. Each message should add something, such as a relevant past project or a useful question. Stop the sequence as soon as they respond.

### 6. CRM hygiene

All of this depends on one place where every inquiry lives. Use pipeline stages that match how you actually sell: new, contacted, qualified, site visit, proposal, won, lost. Record the source of every inquiry and a reason for every loss. If an inquiry is not in the CRM, for planning purposes it did not happen.

## Where AI helps, and where people stay in the loop

AI is useful here, within clear limits. It handles the repetitive work that delays a response:

- **Drafting first responses** from templates you have approved, adjusted to the details of each inquiry
- **Summarizing inquiries**, long email threads, and voicemail transcripts into project type, location, timeline, and open questions
- **Flagging missing information** before the first call
- **Sending reminders** when a follow-up is due or an inquiry has gone quiet

People stay responsible for everything that involves judgment or commitment: deciding whether a project is a fit, discussing scope, pricing, and schedule, and anything that could be read as a promise. A simple rule works well: AI drafts, and a person approves anything that commits the company. Be honest with clients about which messages are automated, and keep every template in your own voice.

> Automation should make your people faster to respond, never harder to reach.

## How to measure it

Three measures tell you whether the system works:

- **Response time.** Track the median time from inquiry to first personal reply, separately for business hours and after hours. The automatic acknowledgment does not count.
- **Booked walkthroughs or site visits.** Track the share of qualified inquiries that reach a meeting. This shows whether your replies are useful, not just fast.
- **Win rate by source.** Track which channels produce signed work, not simply the most inquiries. A smaller source with a higher win rate may deserve more of your budget.

Add one housekeeping measure: the number of inquiries with no recorded outcome. It should trend toward zero. Review all four monthly on a single page, and change one thing at a time so you can see what made the difference.

## Start with one week

You do not need a new platform to begin. In the first week, name an owner for every inquiry channel, write an acknowledgment message and three reply templates, add a source field wherever you track leads, and set a Friday reminder to review response times. Improve from there.

A faster response pays off only when the inquiry was a good one to begin with. For what owners look at before they ever reach out, read [Your website is a bid package](/blog/your-website-is-a-bid-package).

## Talk it through

If you would like help mapping your current process or designing a response system that fits how your team works, we are glad to talk. [Discuss a project](/contact) with us, and we will start by looking at what happens to your inquiries today.$rococo_md$,
  null,
  null,
  'Rococo Creative',
  null,
  ARRAY['AI & automation', 'Lead generation']::text[],
  null,
  'Speed to lead: the first hour after an inquiry',
  'Why construction inquiries go stale, how to build a response system that works after hours, where AI helps, and how to measure response time and win rate.',
  'published',
  '2026-08-25T14:00:00.000Z'::timestamptz,
  '2026-08-25T14:00:00.000Z'::timestamptz,
  '2026-08-25T14:00:00.000Z'::timestamptz
)
on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  body = excluded.body,
  cover_image_url = excluded.cover_image_url,
  cover_image_alt = excluded.cover_image_alt,
  author_name = excluded.author_name,
  author_role = excluded.author_role,
  tags = excluded.tags,
  reading_minutes = excluded.reading_minutes,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  status = excluded.status,
  published_at = excluded.published_at;

insert into public.posts (
  slug, title, excerpt, body, cover_image_url, cover_image_alt, author_name, author_role, tags, reading_minutes, seo_title, seo_description, status, published_at, created_at, updated_at
) values (
  'local-search-for-contractors',
  'Local search for contractors: a field guide',
  'How owners search for builders in your market, and the fundamentals that decide whether they find you: your Google Business Profile, reviews, service and location pages, consistent listings, and tracking that ties search to real work.',
  $rococo_md$Search is where many construction projects begin, including the ones that start with a referral. An owner who hears your name from an architect will still look you up before calling. A facilities manager with an urgent need will search for a trade and a city, then call one of the first credible names.

Local search decides whether you appear in those moments, and whether you look worth calling when you do. It is less mysterious than it seems. A handful of fundamentals, done well and kept up, matter more than any trick.

## How owners search

Owners use search in two ways.

**Discovery searches** describe a need and a place: "commercial general contractor" with a city name, "concrete contractor near me," or "kitchen remodel" with a neighborhood.

**Verification searches** use your company name. The owner already knows of you and wants to check your reviews, photos, and projects, and whether you look established.

Discovery results usually show a map with a short list of local businesses, then websites, with ads above or between them. Google says local results are based mainly on relevance, distance, and prominence. You cannot change where a searcher is standing, but you can make your relevance unmistakable and build prominence through reviews, links, and real project evidence.

Verification searches are won or lost on what appears under your name. A commercial owner may go straight to your portfolio; a homeowner may decide from photos and reviews alone. Plan for both.

## Google Business Profile fundamentals

Your Google Business Profile is often the first thing an owner sees, before your website. Treat it as a primary asset, not a listing you set up once.

### Categories

The primary category matters most. Choose the most specific one that accurately describes your core business, such as General contractor, Roofing contractor, or Concrete contractor. Add secondary categories only for services you actually provide and want to be found for.

### Service areas

If you do not receive clients at your office, Google's guidelines ask you to hide your address and list the areas you serve instead. Either way, list only the places you genuinely work. A list of every town within driving distance reads as less credible.

### Real project photos

Upload photos of your own work regularly: completed projects, work in progress, crews in proper safety gear, and branded trucks and equipment. Skip stock photography. Real photos show what you build, and fresh ones show the business is active.

### Posts

Use posts for project completions, new capabilities, seasonal services, and hiring news, and link each one to the matching page on your website. A post every week or two keeps the profile current without becoming a chore.

### Questions and answers

Where your profile shows a questions and answers section, add the questions owners ask most and answer them yourself: service area, project types, licensing, bonding, and how your process starts. Google changes these features from time to time, so publish the same answers in a FAQ on your website, where they stay under your control.

### Accurate basics

Use your real business name without added keywords. Stuffing keywords into the name breaks Google's guidelines and can get a profile suspended. Keep your hours, phone number, and website link accurate, and verify the profile.

## Reviews

Reviews shape both visibility and decisions. Google notes that review count and rating factor into local ranking, and owners read reviews closely, replies included.

### Ask systematically

Reviews that arrive by accident arrive slowly. Build the request into your closeout process instead:

- Ask at a natural high point, such as the final walkthrough or the handover of closeout documents.
- Have the person who ran the job make the request, then send a direct review link by email or text the same day.
- Send one reminder a week later, and then let it go.
- Ask every client, not only the ones you expect to be happy. Google's policies prohibit selectively asking for positive reviews, and offering incentives in exchange for reviews is not permitted.

For commercial work, ask the owner's representative, property manager, or facilities lead you worked with. Their reviews speak to the projects future commercial clients are researching.

### Respond well

Respond to every review. Keep thanks brief and specific to the type of project, without sharing private details. When a review is critical, respond calmly, acknowledge the concern, state the facts without argument, and offer to continue the conversation directly.

> How you answer a hard review shows owners how you will handle a hard day on their project.

## Service and location pages backed by real project evidence

Your Business Profile points to your website, and the website has to confirm what the profile suggests. Build two kinds of pages:

- **Service pages**, one per core service, explaining what you do, for whom, how the process works, and which projects show it.
- **Location pages**, one per main market you actually serve, showing projects you have completed there, the building types and permitting authorities you know, and the people who serve the area.

The test for every page is evidence. A location page earns its place with projects you built in that market, not with the city's name repeated in every paragraph. Pages that repeat the same text with a different city swapped in can fall under what Google's spam policies call doorway abuse. If you do not yet have projects in a market, wait to build that page.

Link each project page to the relevant service and location pages, and link back. Every completed project then strengthens the pages most likely to be found.

## Citations and consistent name, address, and phone

Citations are mentions of your business on other sites: directories, map services, industry associations, chambers of commerce, supplier dealer locators, and plan room profiles. Search engines compare them with your Business Profile and website, so your name, address, and phone number should match everywhere.

Start with the listings that matter most: Google, Apple Business Connect, Bing Places, the main directories in your market, and the associations you belong to. Correct old addresses after a move and retire outdated phone numbers. If you use a call tracking number on your profile, keep your main number listed as an additional phone so the two stay connected.

## Track calls and forms

Visibility is useful only if it produces conversations. Set up measurement before you judge results:

- Review the performance reports in your Business Profile for calls, website clicks, and direction requests.
- Add tracking parameters to the website link in your profile, so your analytics can separate profile visits from other search traffic.
- Use call tracking on your website to see which pages and sources produce calls, and record form submissions as conversions.
- Send every call and form into your CRM with its source, so you can see which searches became site visits, proposals, and signed work.

That last step is where local search connects to revenue. We cover the response side in [Speed to lead](/blog/speed-to-lead-the-first-hour).

## Realistic timelines

Local search rewards consistency more than intensity. In our experience, profile and listing fixes can show up within weeks. Reviews build over months as projects close out. Service and location pages take longer to earn rankings, especially in competitive markets. Plan in quarters, and judge progress by calls, booked site visits, and won work rather than rankings alone.

Be wary of anyone who promises a specific ranking. Google's own guidance notes that no one can guarantee a top position in its results.

## Where to start

If you want a simple sequence:

1. **First month:** clean up your Business Profile and key citations, and set up call and form tracking.
2. **Second month:** build the review request into closeout, and rebuild your core service pages.
3. **Third month:** add location pages where you have real project evidence, and review your first numbers.

Then keep going: new projects, new photos, and new reviews every month.

## A conversation, not a pitch

If you would like a clear read on how your company shows up in local search today, and what to fix first, we would be glad to help. [Discuss a project](/contact) with us, and we will start with what owners in your market see when they look you up.$rococo_md$,
  null,
  null,
  'Rococo Creative',
  null,
  ARRAY['SEO', 'Lead generation']::text[],
  null,
  'Local SEO for contractors: a field guide',
  'How owners search for builders: Google Business Profile basics, reviews, service and location pages, consistent listings, call tracking, and timelines.',
  'published',
  '2026-08-04T14:00:00.000Z'::timestamptz,
  '2026-08-04T14:00:00.000Z'::timestamptz,
  '2026-08-04T14:00:00.000Z'::timestamptz
)
on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  body = excluded.body,
  cover_image_url = excluded.cover_image_url,
  cover_image_alt = excluded.cover_image_alt,
  author_name = excluded.author_name,
  author_role = excluded.author_role,
  tags = excluded.tags,
  reading_minutes = excluded.reading_minutes,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  status = excluded.status,
  published_at = excluded.published_at;

-- Case studies (3): PLACEHOLDERS
insert into public.case_studies (
  slug, client_name, title, summary, sector, location, services, challenge, approach, outcome, metrics, cover_image_url, cover_image_alt, website_url, year, featured, sort_order, status, published_at, created_at, updated_at
) values (
  'commercial-gc-brand-and-website',
  'TODO: Client name',
  'Brand and website for a commercial general contractor',
  'TODO: In one or two sentences, who the client is, the business problem, and the verified result. Placeholder structure only.',
  'Commercial general contractor',
  'TODO: City, State',
  ARRAY['Positioning & messaging', 'Brand identity', 'Website']::text[],
  $rococo_md$**TODO:** Describe the starting point in the client's words. What was the business problem, not the marketing problem?

- What work did the company want more of (sector, project size, delivery method), and what was it winning instead?
- Where were opportunities being lost: not invited to bid, not shortlisted, or losing at interview?
- How did owners, developers, and architects see the firm before the engagement, and how did that compare with its real capability?
- What had already been tried, and why did it fall short?
- What constraints shaped the work: budget, an upcoming pursuit, internal capacity, brand equity worth keeping?

Aim for 150 to 250 words. Use an approved client quote, or a paraphrase the client has signed off.$rococo_md$,
  $rococo_md$**TODO:** Describe what Rococo did and why, in the order it happened. Tie each decision back to the challenge.

### Survey: audit

- Which two or three findings shaped everything that followed?

### Foundation: strategy

- Which project types and clients did the strategy prioritize, and why?
- What positioning and key messages came out of it?

### Frame: build

- What changed in the identity, and what existing equity was kept?
- How was the website structured: project sheets with scope and size, safety and team pages, a separate path for bid invitations?

### Finish: grow

- What ongoing work followed launch, if any?

Credit the client's team where they did the work. Add two or three images with alt text, such as a before and after, a project page, or a jobsite application.$rococo_md$,
  $rococo_md$**TODO:** Describe verified results only. Every figure needs a source, a time period, and a comparison, and the client must approve it in writing.

- Business results first: invitations to bid, shortlists, interviews won, average project size, sector mix.
- Marketing measures second, and only where they explain a business result: qualified inquiries, site visits, search visibility.
- What did the client's team, prospective clients, or design partners say about the change? Approved quotes only.
- What is still in progress, and what comes next?

Match these results to the metrics listed for this case study. If a result cannot be verified, leave it out.$rococo_md$,
  '[{"label":"Qualified inquiries","value":"TODO","note":"TODO: Count inquiries that fit the target project profile. Compare the 6 months after launch with the 6 months before."},{"label":"Average project size","value":"TODO","note":"TODO: Average contract value of new awards. Compare the 12 months after launch with the 12 months before."}]'::jsonb,
  null,
  null,
  null,
  null,
  true,
  10,
  'published',
  '2026-09-01T14:00:00.000Z'::timestamptz,
  '2026-09-01T14:00:00.000Z'::timestamptz,
  '2026-09-01T14:00:00.000Z'::timestamptz
)
on conflict (slug) do update set
  client_name = excluded.client_name,
  title = excluded.title,
  summary = excluded.summary,
  sector = excluded.sector,
  location = excluded.location,
  services = excluded.services,
  challenge = excluded.challenge,
  approach = excluded.approach,
  outcome = excluded.outcome,
  metrics = excluded.metrics,
  cover_image_url = excluded.cover_image_url,
  cover_image_alt = excluded.cover_image_alt,
  website_url = excluded.website_url,
  year = excluded.year,
  featured = excluded.featured,
  sort_order = excluded.sort_order,
  status = excluded.status,
  published_at = excluded.published_at;

insert into public.case_studies (
  slug, client_name, title, summary, sector, location, services, challenge, approach, outcome, metrics, cover_image_url, cover_image_alt, website_url, year, featured, sort_order, status, published_at, created_at, updated_at
) values (
  'design-build-lead-system',
  'TODO: Client name',
  'Lead response and CRM system for a design-build firm',
  'TODO: In one or two sentences, who the client is, the business problem, and the verified result. Placeholder structure only.',
  'Design-build firm',
  'TODO: City, State',
  ARRAY['CRM & automation', 'Paid search', 'Reporting']::text[],
  $rococo_md$**TODO:** Describe the starting point in the client's words. What was the business problem, not the marketing problem?

- How were inquiries handled before: which channels, who answered, and how long replies took (measured, not estimated)?
- What was being lost: unanswered inquiries, slow follow-up, unknown lead sources, no record of outcomes?
- Which project types and budgets did the firm want, and which was it getting?
- What had already been tried, such as an answering service, a shared inbox, or a CRM nobody used?
- What constraints shaped the work: team size, existing software, sales process, seasonality?

Aim for 150 to 250 words. Use an approved client quote, or a paraphrase the client has signed off.$rococo_md$,
  $rococo_md$**TODO:** Describe what Rococo did and why, in the order it happened. Tie each decision back to the challenge.

### Survey: audit

- What did tracing recent inquiries and test submissions reveal? What was the measured baseline?

### Foundation: strategy

- What routing rules, qualification questions, and follow-up cadence were agreed?
- Where does AI draft or summarize, and where does a person review before anything is sent?

### Frame: build

- How were the CRM pipeline, instant acknowledgment, booking links, and call and form tracking set up?
- Which paid search campaigns and landing pages launched, and what did each target?

### Finish: grow

- What does the monthly review cover, and what has been adjusted since launch?

Describe the role of AI precisely and plainly. Add two or three images with alt text, such as a pipeline view with client data removed, or a landing page.$rococo_md$,
  $rococo_md$**TODO:** Describe verified results only. Every figure needs a source, a time period, and a comparison, and the client must approve it in writing.

- Response time from the CRM, for comparable periods before and after launch.
- Consultations or site visits booked from qualified inquiries.
- Signed work or win rate by source, if the client will share it.
- Paid search measured as cost per qualified inquiry, not cost per click.
- Effect on the team, such as time saved or fewer dropped inquiries, only where it was measured.

Match these results to the metrics listed for this case study. If a result cannot be verified, leave it out.$rococo_md$,
  '[{"label":"Median response time","value":"TODO","note":"TODO: Median time from inquiry to first personal reply, from the CRM. Compare the 90 days after launch with the 90 days before."},{"label":"Consultations booked","value":"TODO","note":"TODO: Consultations or site visits booked from qualified inquiries. Compare the 6 months after launch with the 6 months before."}]'::jsonb,
  null,
  null,
  null,
  null,
  true,
  20,
  'published',
  '2026-08-12T14:00:00.000Z'::timestamptz,
  '2026-08-12T14:00:00.000Z'::timestamptz,
  '2026-08-12T14:00:00.000Z'::timestamptz
)
on conflict (slug) do update set
  client_name = excluded.client_name,
  title = excluded.title,
  summary = excluded.summary,
  sector = excluded.sector,
  location = excluded.location,
  services = excluded.services,
  challenge = excluded.challenge,
  approach = excluded.approach,
  outcome = excluded.outcome,
  metrics = excluded.metrics,
  cover_image_url = excluded.cover_image_url,
  cover_image_alt = excluded.cover_image_alt,
  website_url = excluded.website_url,
  year = excluded.year,
  featured = excluded.featured,
  sort_order = excluded.sort_order,
  status = excluded.status,
  published_at = excluded.published_at;

insert into public.case_studies (
  slug, client_name, title, summary, sector, location, services, challenge, approach, outcome, metrics, cover_image_url, cover_image_alt, website_url, year, featured, sort_order, status, published_at, created_at, updated_at
) values (
  'specialty-trade-local-search',
  'TODO: Client name',
  'Local search program for a specialty trade contractor',
  'TODO: In one or two sentences, who the client is, the business problem, and the verified result. Placeholder structure only.',
  'Specialty trade contractor',
  'TODO: City, State',
  ARRAY['Local SEO', 'Website', 'Reporting']::text[],
  $rococo_md$**TODO:** Describe the starting point in the client's words. What was the business problem, not the marketing problem?

- Where did work come from before: referrals, general contractor relationships, search, repeat clients?
- What did an owner see when searching for this trade in the client's market, and where did the company appear?
- What state were the Business Profile, reviews, listings, and service pages in at the start?
- What was the business goal: more direct work, a new service line, a new market, or less reliance on a few general contractors?
- What constraints shaped the work: budget, crew capacity, seasonality, service area?

Aim for 150 to 250 words. Use an approved client quote, or a paraphrase the client has signed off.$rococo_md$,
  $rococo_md$**TODO:** Describe what Rococo did and why, in the order it happened. Tie each decision back to the challenge.

### Survey: audit

- What did the audit of the profile, listings, search results, and tracking find?

### Foundation: strategy

- Which services and markets were prioritized, and why?

### Frame: build

- What changed in the Business Profile and listings?
- Which service and location pages were built, and which real projects support each one?
- How was the review request built into closeout, and how were calls and forms tracked?

### Finish: grow

- What is the monthly routine: photos, posts, reviews, new project pages, reporting?

Add two or three images with alt text, such as project photography used on the profile, or a location page.$rococo_md$,
  $rococo_md$**TODO:** Describe verified results only. Every figure needs a source, a time period, and a comparison, and the client must approve it in writing.

- Tracked calls and forms from search, by source, for comparable periods before and after.
- Map visibility for priority searches in target markets. State how it was measured, which searches, and on which dates.
- Reviews gained over the period, and the current rating.
- Work won that can be traced to search, if the client will share it.

Match these results to the metrics listed for this case study. If a result cannot be verified, leave it out.$rococo_md$,
  '[{"label":"Map pack visibility","value":"TODO","note":"TODO: Share of priority searches that show the company in the map results across target markets. Compare the starting audit with month 6."},{"label":"Calls from search","value":"TODO","note":"TODO: Tracked calls from the Business Profile and organic search. Compare the 6 months after launch with the 6 months before."}]'::jsonb,
  null,
  null,
  null,
  null,
  false,
  30,
  'published',
  '2026-07-20T14:00:00.000Z'::timestamptz,
  '2026-07-20T14:00:00.000Z'::timestamptz,
  '2026-07-20T14:00:00.000Z'::timestamptz
)
on conflict (slug) do update set
  client_name = excluded.client_name,
  title = excluded.title,
  summary = excluded.summary,
  sector = excluded.sector,
  location = excluded.location,
  services = excluded.services,
  challenge = excluded.challenge,
  approach = excluded.approach,
  outcome = excluded.outcome,
  metrics = excluded.metrics,
  cover_image_url = excluded.cover_image_url,
  cover_image_alt = excluded.cover_image_alt,
  website_url = excluded.website_url,
  year = excluded.year,
  featured = excluded.featured,
  sort_order = excluded.sort_order,
  status = excluded.status,
  published_at = excluded.published_at;

-- Testimonials (2): PLACEHOLDERS
delete from public.testimonials where quote like 'TODO:%';

insert into public.testimonials (quote, author_name, author_title, company, case_study_id, featured, sort_order, status)
select
  'TODO: Add an approved client quote. The strongest testimonials name the problem, what changed, and a concrete result.' as quote,
  'TODO: Client name' as author_name,
  'TODO: Title' as author_title,
  'TODO: Company' as company,
  (select id from public.case_studies where slug = 'commercial-gc-brand-and-website') as case_study_id,
  true as featured,
  10 as sort_order,
  'published' as status
where not exists (
  select 1 from public.testimonials t
  where t.quote = 'TODO: Add an approved client quote. The strongest testimonials name the problem, what changed, and a concrete result.' and t.author_name = 'TODO: Client name'
);

insert into public.testimonials (quote, author_name, author_title, company, case_study_id, featured, sort_order, status)
select
  'TODO: Add a second approved client quote, ideally from a different sector or company size.' as quote,
  'TODO: Client name' as author_name,
  'TODO: Title' as author_title,
  'TODO: Company' as company,
  (select id from public.case_studies where slug = 'design-build-lead-system') as case_study_id,
  false as featured,
  20 as sort_order,
  'published' as status
where not exists (
  select 1 from public.testimonials t
  where t.quote = 'TODO: Add a second approved client quote, ideally from a different sector or company size.' and t.author_name = 'TODO: Client name'
);

commit;
