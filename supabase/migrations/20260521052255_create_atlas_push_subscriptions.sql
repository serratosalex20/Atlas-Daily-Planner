-- Atlas Web Push subscriptions. One row per device per user.
--
-- Source of truth: this file. Applied to project xlvjagimbonemwijoiti on 2026-05-21
-- via the Supabase MCP `apply_migration` tool; recorded as migration version 20260521052255.
-- Subsequent `supabase db push` operations should recognize this version as already-applied.
--
-- The (endpoint) is opaque to us — it's the URL the push service (FCM/APNs/Mozilla)
-- assigned to that device. p256dh + auth are the device's encryption keys; the
-- Edge Function needs them to encrypt push payloads (RFC 8291).

create table public.atlas_push_subscriptions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  endpoint    text not null,
  p256dh      text not null,
  auth        text not null,
  user_agent  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique(user_id, endpoint)
);

comment on table public.atlas_push_subscriptions is
  'Web Push subscriptions for Atlas Daily OS. One row per device per anonymous user. Edge Function send-push reads from this to fan out notifications. 410/404 responses from push services prune dead rows automatically.';

create index atlas_push_subscriptions_user_idx
  on public.atlas_push_subscriptions (user_id);

create trigger atlas_push_subscriptions_set_updated_at
  before insert or update on public.atlas_push_subscriptions
  for each row execute function public.kenzie_touch_updated_at();

alter table public.atlas_push_subscriptions enable row level security;

create policy "atlas_push_subscriptions_select_own" on public.atlas_push_subscriptions
  for select to authenticated using (user_id = (select auth.uid()));
create policy "atlas_push_subscriptions_insert_own" on public.atlas_push_subscriptions
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "atlas_push_subscriptions_update_own" on public.atlas_push_subscriptions
  for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "atlas_push_subscriptions_delete_own" on public.atlas_push_subscriptions
  for delete to authenticated using (user_id = (select auth.uid()));
