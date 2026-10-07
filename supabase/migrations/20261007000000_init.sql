-- =============================================================================
-- Rococo Creative: content + lead capture schema
-- Apply with the Supabase CLI (`supabase db push`) or paste into the SQL editor.
--
-- Security model
--   * The website reads with the public anon/publishable key.
--   * Row Level Security is ON for every table.
--   * Content tables: the public can read rows where status = 'published'
--     (and, for dated content, published_at <= now()). Drafts stay private.
--   * contact_submissions: the public can INSERT a limited set of columns and
--     can never read, update, or delete. Review leads in the Supabase dashboard.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Shared: updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Blog posts
-- ---------------------------------------------------------------------------
create table if not exists public.posts (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique
                     check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title            text not null check (char_length(title) between 1 and 200),
  excerpt          text not null default '' check (char_length(excerpt) <= 400),
  body             text not null default '',           -- Markdown (GFM)
  cover_image_url  text,                                -- e.g. Supabase Storage public URL
  cover_image_alt  text,
  author_name      text not null default 'Rococo Creative',
  author_role      text,
  tags             text[] not null default '{}',
  reading_minutes  integer check (reading_minutes is null or reading_minutes between 1 and 120), -- optional override
  word_count       integer generated always as (
                     coalesce(array_length(regexp_split_to_array(btrim(body), '\s+'), 1), 0)
                   ) stored,
  seo_title        text check (seo_title is null or char_length(seo_title) <= 70),
  seo_description  text check (seo_description is null or char_length(seo_description) <= 200),
  status           text not null default 'draft' check (status in ('draft', 'published')),
  published_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint posts_published_has_date check (status = 'draft' or published_at is not null)
);

create index if not exists posts_published_idx
  on public.posts (status, published_at desc);

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Case studies
-- ---------------------------------------------------------------------------
create table if not exists public.case_studies (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique
                     check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  client_name      text not null check (char_length(client_name) between 1 and 160),
  title            text not null check (char_length(title) between 1 and 200),
  summary          text not null default '' check (char_length(summary) <= 600),
  sector           text,                                -- e.g. 'Commercial general contractor'
  location         text,
  services         text[] not null default '{}',        -- e.g. {'Strategy','Website','Local SEO'}
  challenge        text not null default '',           -- Markdown
  approach         text not null default '',           -- Markdown
  outcome          text not null default '',           -- Markdown
  -- [{ "label": "Qualified inquiries", "value": "+40%", "note": "Q1 vs prior Q1" }]
  metrics          jsonb not null default '[]'::jsonb check (jsonb_typeof(metrics) = 'array'),
  cover_image_url  text,
  cover_image_alt  text,
  website_url      text,
  year             integer check (year is null or year between 2000 and 2100),
  featured         boolean not null default false,
  sort_order       integer not null default 100,
  status           text not null default 'draft' check (status in ('draft', 'published')),
  published_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint case_studies_published_has_date check (status = 'draft' or published_at is not null)
);

create index if not exists case_studies_published_idx
  on public.case_studies (status, featured desc, sort_order, published_at desc);

drop trigger if exists case_studies_set_updated_at on public.case_studies;
create trigger case_studies_set_updated_at
  before update on public.case_studies
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Testimonials
-- ---------------------------------------------------------------------------
create table if not exists public.testimonials (
  id               uuid primary key default gen_random_uuid(),
  quote            text not null check (char_length(quote) between 1 and 1000),
  author_name      text not null check (char_length(author_name) between 1 and 120),
  author_title     text,
  company          text,
  case_study_id    uuid references public.case_studies (id) on delete set null,
  featured         boolean not null default false,
  sort_order       integer not null default 100,
  status           text not null default 'draft' check (status in ('draft', 'published')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists testimonials_published_idx
  on public.testimonials (status, featured desc, sort_order);

drop trigger if exists testimonials_set_updated_at on public.testimonials;
create trigger testimonials_set_updated_at
  before update on public.testimonials
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Contact form submissions (write-only from the website)
-- ---------------------------------------------------------------------------
create table if not exists public.contact_submissions (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  name          text not null check (char_length(name) between 1 and 120),
  email         text not null check (
                  char_length(email) between 3 and 254
                  and email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
                ),
  company       text check (company is null or char_length(company) <= 160),
  role          text check (role is null or char_length(role) <= 120),
  phone         text check (phone is null or char_length(phone) <= 40),
  company_type  text check (company_type is null or char_length(company_type) <= 80),
  services      text[] not null default '{}'
                  check (
                    cardinality(services) <= 12
                    and char_length(array_to_string(services, '|')) <= 1000
                  ),
  budget        text check (budget is null or char_length(budget) <= 60),
  timeline      text check (timeline is null or char_length(timeline) <= 60),
  message       text not null check (char_length(message) between 10 and 5000),
  source_path   text check (source_path is null or char_length(source_path) <= 300),
  consent       boolean not null default false,
  status        text not null default 'new'
                  check (status in ('new', 'contacted', 'qualified', 'closed', 'spam'))
);

create index if not exists contact_submissions_created_idx
  on public.contact_submissions (created_at desc);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.posts               enable row level security;
alter table public.case_studies        enable row level security;
alter table public.testimonials        enable row level security;
alter table public.contact_submissions enable row level security;

drop policy if exists "Published posts are public" on public.posts;
create policy "Published posts are public"
  on public.posts for select
  to anon, authenticated
  using (status = 'published' and published_at <= now());

drop policy if exists "Published case studies are public" on public.case_studies;
create policy "Published case studies are public"
  on public.case_studies for select
  to anon, authenticated
  using (status = 'published' and published_at <= now());

drop policy if exists "Published testimonials are public" on public.testimonials;
create policy "Published testimonials are public"
  on public.testimonials for select
  to anon, authenticated
  using (status = 'published');

drop policy if exists "Website visitors can submit the contact form" on public.contact_submissions;
create policy "Website visitors can submit the contact form"
  on public.contact_submissions for insert
  to anon, authenticated
  with check (status = 'new' and consent = true);

-- ---------------------------------------------------------------------------
-- Grants (explicit, so the Data API works whether or not the project
-- auto-exposes new tables). RLS still filters every row.
-- ---------------------------------------------------------------------------
grant usage on schema public to anon, authenticated;

grant select on public.posts, public.case_studies, public.testimonials to anon, authenticated;

revoke all on public.contact_submissions from anon, authenticated;
grant insert (
  name, email, company, role, phone, company_type, services,
  budget, timeline, message, source_path, consent
) on public.contact_submissions to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Storage: public bucket for blog covers and case study imagery.
-- Upload through the dashboard; the website only reads public URLs.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;
