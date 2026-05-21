-- Atlas Daily OS: cloud sync table.
-- One row per user per calendar date. Mirrors the atlas_os_v1 freshDay() shape in payload.
--
-- Source of truth: this file. Applied to project xlvjagimbonemwijoiti on 2026-05-20
-- via the Supabase MCP `apply_migration` tool; recorded as migration version 20260520233234.
-- Subsequent `supabase db push` operations should recognize this version as already-applied.

create table public.daily_state (
  user_id     uuid not null references auth.users(id) on delete cascade,
  date        date not null,
  mode        text not null check (mode in ('weekday','weekend')),
  payload     jsonb not null,
  closed      boolean not null default false,
  updated_at  timestamptz not null default now(),
  primary key (user_id, date)
);

comment on table public.daily_state is
  'Atlas Daily OS — one row per user per calendar date. payload mirrors the atlas_os_v1 freshDay() shape (checks, mvd, tasks, top3, nextTop3, closed). Derived fields like pct/pillars/insight are NOT stored; they are recomputed client-side by buildRecord().';

comment on column public.daily_state.payload is
  'jsonb mirror of state.current / state.history[date] raw inputs only';
comment on column public.daily_state.closed is
  'Duplicated out of payload.closed for cheap filtering and stat queries';
comment on column public.daily_state.updated_at is
  'Server-stamped on every write via trigger. Conflict resolution uses this column.';

create index daily_state_user_updated_idx
  on public.daily_state (user_id, updated_at desc);

-- Server-stamped updated_at defeats device-clock skew for last-write-wins.
create or replace function public.daily_state_touch_updated_at()
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

create trigger daily_state_set_updated_at
before insert or update on public.daily_state
for each row execute function public.daily_state_touch_updated_at();

-- Row-Level Security: only the authenticated user can see/touch their own rows.
alter table public.daily_state enable row level security;

create policy "daily_state_select_own"
  on public.daily_state for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy "daily_state_insert_own"
  on public.daily_state for insert
  to authenticated
  with check (user_id = (select auth.uid()));

create policy "daily_state_update_own"
  on public.daily_state for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "daily_state_delete_own"
  on public.daily_state for delete
  to authenticated
  using (user_id = (select auth.uid()));
