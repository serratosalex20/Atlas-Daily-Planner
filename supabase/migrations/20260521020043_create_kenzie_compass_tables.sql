-- Kenzie Compass: three tables backing the parenting-OS sibling page.
-- Same auth.users identity as daily_state (one anonymous user covers both pages).
-- Curriculum content itself lives client-side; these tables only track Alex's interactions.
--
-- Source of truth: this file. Applied to project xlvjagimbonemwijoiti on 2026-05-21
-- via the Supabase MCP `apply_migration` tool; recorded as migration version 20260521020043.
-- Subsequent `supabase db push` operations should recognize this version as already-applied.

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. kenzie_progress — milestone & activity completion tracking
-- ─────────────────────────────────────────────────────────────────────────────
create table public.kenzie_progress (
  user_id      uuid not null references auth.users(id) on delete cascade,
  item_key     text not null,
  status       text not null default 'not_started'
               check (status in ('not_started','in_progress','done','skipped')),
  notes        text,
  completed_at timestamptz,
  updated_at   timestamptz not null default now(),
  primary key (user_id, item_key)
);

comment on table  public.kenzie_progress is
  'Per-user completion tracking for curriculum activities and age milestones. item_key is a stable slug like "activity:emotional:calm_down_kit" or "milestone:age12:open_bank_account".';
comment on column public.kenzie_progress.item_key is
  'Stable slug. Format: "<kind>:<group>:<slug>" where kind ∈ {activity, milestone}, group is the section or age band.';

create index kenzie_progress_user_status_idx
  on public.kenzie_progress (user_id, status);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. kenzie_journal — date-stamped parenting log entries
-- ─────────────────────────────────────────────────────────────────────────────
create table public.kenzie_journal (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  entry_date  date not null,
  section     text,   -- one of the 8 part-slugs, or null for general
  body        text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.kenzie_journal is
  'Parenting log. Free-form body, tagged by curriculum section and entry_date. entry_date is when the moment happened; created_at is when the entry was written.';

create index kenzie_journal_user_date_idx
  on public.kenzie_journal (user_id, entry_date desc);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. kenzie_settings — singleton per user (birthday, prefs)
-- ─────────────────────────────────────────────────────────────────────────────
create table public.kenzie_settings (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  birthday    date,
  payload     jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

comment on table public.kenzie_settings is
  'Per-user singleton row. birthday drives the age band on the timeline; payload holds free-form prefs (focus override, last viewed section, etc.).';

-- ─────────────────────────────────────────────────────────────────────────────
-- Shared updated_at trigger (same hardening as daily_state's)
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.kenzie_touch_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger kenzie_progress_set_updated_at
  before insert or update on public.kenzie_progress
  for each row execute function public.kenzie_touch_updated_at();

create trigger kenzie_journal_set_updated_at
  before insert or update on public.kenzie_journal
  for each row execute function public.kenzie_touch_updated_at();

create trigger kenzie_settings_set_updated_at
  before insert or update on public.kenzie_settings
  for each row execute function public.kenzie_touch_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- RLS: 4 explicit policies per table, all scoped to auth.uid()
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.kenzie_progress enable row level security;
alter table public.kenzie_journal  enable row level security;
alter table public.kenzie_settings enable row level security;

-- kenzie_progress
create policy "kenzie_progress_select_own" on public.kenzie_progress
  for select to authenticated using (user_id = (select auth.uid()));
create policy "kenzie_progress_insert_own" on public.kenzie_progress
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "kenzie_progress_update_own" on public.kenzie_progress
  for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "kenzie_progress_delete_own" on public.kenzie_progress
  for delete to authenticated using (user_id = (select auth.uid()));

-- kenzie_journal
create policy "kenzie_journal_select_own" on public.kenzie_journal
  for select to authenticated using (user_id = (select auth.uid()));
create policy "kenzie_journal_insert_own" on public.kenzie_journal
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "kenzie_journal_update_own" on public.kenzie_journal
  for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "kenzie_journal_delete_own" on public.kenzie_journal
  for delete to authenticated using (user_id = (select auth.uid()));

-- kenzie_settings
create policy "kenzie_settings_select_own" on public.kenzie_settings
  for select to authenticated using (user_id = (select auth.uid()));
create policy "kenzie_settings_insert_own" on public.kenzie_settings
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "kenzie_settings_update_own" on public.kenzie_settings
  for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "kenzie_settings_delete_own" on public.kenzie_settings
  for delete to authenticated using (user_id = (select auth.uid()));
