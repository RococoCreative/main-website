-- =============================================================================
-- Rococo Creative: tighten public grants
--
-- Supabase's default privileges give anon and authenticated every table
-- privilege on new tables in public. RLS already blocks writes through the
-- Data API (content tables only have SELECT policies), but the website only
-- ever reads content, so the grants should say so too. Defense in depth.
-- =============================================================================

-- Content tables: read only.
revoke insert, update, delete, truncate, references, trigger
  on public.posts, public.case_studies, public.testimonials
  from anon, authenticated;

-- Supabase's optional "auto-enable RLS" event trigger function is
-- SECURITY DEFINER and exposed at /rest/v1/rpc/rls_auto_enable. The event
-- trigger does not need callers to hold EXECUTE, so nobody should.
do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
  end if;
end;
$$;

-- Cover the testimonials -> case_studies foreign key (advisor 0001).
create index if not exists testimonials_case_study_id_idx
  on public.testimonials (case_study_id);
