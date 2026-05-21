-- Atlas daily planner journal. Mirrors kenzie_journal's shape so the client code path
-- can be the same with only the section vocabulary changing (6 Atlas pillars + null).
--
-- Source of truth: this file. Applied to project xlvjagimbonemwijoiti on 2026-05-21
-- via the Supabase MCP `apply_migration` tool; recorded as migration version 20260521034543.
-- Subsequent `supabase db push` operations should recognize this version as already-applied.

create table public.atlas_journal (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  entry_date  date not null,
  section     text,   -- one of: body, mind, spirit, family, money, rest, or null for general
  body        text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.atlas_journal is
  'End-of-day reflection entries for Atlas Daily Planner. Free-form body, optionally tagged with one of the six Atlas pillars (body/mind/spirit/family/money/rest). entry_date is when the moment happened.';

create index atlas_journal_user_date_idx
  on public.atlas_journal (user_id, entry_date desc);

-- Reuse the kenzie_touch_updated_at function — same body, no need to redefine.
create trigger atlas_journal_set_updated_at
  before insert or update on public.atlas_journal
  for each row execute function public.kenzie_touch_updated_at();

-- RLS: same 4-policy-per-table pattern as the other tables.
alter table public.atlas_journal enable row level security;

create policy "atlas_journal_select_own" on public.atlas_journal
  for select to authenticated using (user_id = (select auth.uid()));
create policy "atlas_journal_insert_own" on public.atlas_journal
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "atlas_journal_update_own" on public.atlas_journal
  for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "atlas_journal_delete_own" on public.atlas_journal
  for delete to authenticated using (user_id = (select auth.uid()));
