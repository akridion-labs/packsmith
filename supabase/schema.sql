create extension if not exists "pgcrypto";

create table if not exists public.waitlist_leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text not null default 'packsmith',
  consent_version text not null default '2026-07-02',
  privacy_accepted_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create unique index if not exists waitlist_leads_email_unique
  on public.waitlist_leads (lower(email));

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.template_packs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  preset_id text not null,
  brief_json jsonb not null,
  pack_json jsonb not null,
  notion_payload_json jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.launch_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pack_id uuid references public.template_packs(id) on delete set null,
  channel text not null,
  asset_type text not null,
  content_json jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  anonymous_id text not null,
  event_type text not null,
  page text,
  metadata_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_user_created_idx
  on public.analytics_events (user_id, created_at desc);

create index if not exists analytics_events_anonymous_created_idx
  on public.analytics_events (anonymous_id, created_at desc);

create index if not exists analytics_events_type_created_idx
  on public.analytics_events (event_type, created_at desc);

alter table public.waitlist_leads enable row level security;
alter table public.profiles enable row level security;
alter table public.template_packs enable row level security;
alter table public.launch_events enable row level security;
alter table public.analytics_events enable row level security;

create policy "Anyone can join waitlist"
  on public.waitlist_leads for insert
  with check (true);

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can upsert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users can delete own profile"
  on public.profiles for delete
  using (auth.uid() = id);

create policy "Users can read own packs"
  on public.template_packs for select
  using (auth.uid() = user_id);

create policy "Users can create own packs"
  on public.template_packs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own packs"
  on public.template_packs for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own packs"
  on public.template_packs for delete
  using (auth.uid() = user_id);

create policy "Users can read own launch events"
  on public.launch_events for select
  using (auth.uid() = user_id);

create policy "Users can create own launch events"
  on public.launch_events for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own launch events"
  on public.launch_events for delete
  using (auth.uid() = user_id);

create policy "Anyone can create analytics events"
  on public.analytics_events for insert
  with check (user_id is null or auth.uid() = user_id);

create policy "Users can read own analytics events"
  on public.analytics_events for select
  using (auth.uid() = user_id);

create policy "Users can delete own analytics events"
  on public.analytics_events for delete
  using (auth.uid() = user_id);
