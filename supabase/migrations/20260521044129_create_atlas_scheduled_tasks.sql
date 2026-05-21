-- Atlas scheduled tasks. Tasks targeted at a future calendar date.
--
-- Source of truth: this file. Applied to project xlvjagimbonemwijoiti on 2026-05-21
-- via the Supabase MCP `apply_migration` tool; recorded as migration version 20260521044129.
-- Subsequent `supabase db push` operations should recognize this version as already-applied.
--
-- Today's quick-add tasks still live in daily_state.payload.tasks (unchanged path) —
-- this table is only for tasks the user explicitly chose a date for (today or future).
-- At render time the client merges (state.current.tasks) UNION (atlas_scheduled_tasks
-- where due_date <= today AND NOT done) so overdue scheduled tasks surface in Today's
-- Focus until handled.

create table public.atlas_scheduled_tasks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  text        text not null,
  due_date    date not null,
  done        boolean not null default false,
  done_at     timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.atlas_scheduled_tasks is
  'Atlas Daily Planner — date-targeted tasks. Surfaces in Today''s Focus when due_date <= today AND NOT done. Open backlogs of future tasks live here but are hidden by default to avoid ADHD overwhelm; the "Upcoming (next 7 days)" collapsible reveals them.';

comment on column public.atlas_scheduled_tasks.done_at is
  'Server timestamp at the moment the task was first marked done. Null while still open. Useful later for "did this rock take a week?" analytics.';

-- Partial index — we only ever query open future tasks. Completed rows stay light.
create index atlas_scheduled_tasks_user_due_idx
  on public.atlas_scheduled_tasks (user_id, due_date)
  where not done;

-- Reuse the existing trigger function — same one-liner body.
create trigger atlas_scheduled_tasks_set_updated_at
  before insert or update on public.atlas_scheduled_tasks
  for each row execute function public.kenzie_touch_updated_at();

-- RLS: same 4-policy pattern as the other Atlas tables.
alter table public.atlas_scheduled_tasks enable row level security;

create policy "atlas_scheduled_tasks_select_own" on public.atlas_scheduled_tasks
  for select to authenticated using (user_id = (select auth.uid()));
create policy "atlas_scheduled_tasks_insert_own" on public.atlas_scheduled_tasks
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "atlas_scheduled_tasks_update_own" on public.atlas_scheduled_tasks
  for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "atlas_scheduled_tasks_delete_own" on public.atlas_scheduled_tasks
  for delete to authenticated using (user_id = (select auth.uid()));
