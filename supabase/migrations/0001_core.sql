-- 0001 · Core sports data (P3 · docs/05-data-model.md)
-- Times stored in UTC; display converts to Asia/Taipei.
-- Data comes ONLY from licensed providers (docs/adr/0001-licensed-data-only.md).

create table public.leagues (
  id   text primary key check (id in ('NFL', 'NBA', 'MLB')),
  name text not null,
  name_zh text not null
);

create table public.teams (
  id         text primary key,                 -- e.g. 'MLB-NYY'
  league_id  text not null references public.leagues (id),
  abbr       text not null,                    -- provider abbreviation, e.g. 'NYY'
  name       text not null,                    -- English name (text only — no logos, P4)
  name_zh    text,
  city       text not null,
  venue_tz   text not null default 'America/New_York',  -- IANA zone of home venue
  color_chip text not null default '#64748b',  -- neutral chip, NOT an official team colour
  unique (league_id, abbr)
);

create table public.games (
  id          text primary key,                -- '<league>-<provider game id>'
  league_id   text not null references public.leagues (id),
  season      int  not null,
  home_id     text not null references public.teams (id),
  away_id     text not null references public.teams (id),
  start_utc   timestamptz,                     -- null while TBD
  venue_tz    text not null default 'America/New_York',
  status      text not null default 'scheduled'
              check (status in ('scheduled', 'live', 'final', 'postponed')),
  home_score  int,
  away_score  int,
  source      text not null default 'mock',    -- provider name, for licensing audits
  updated_at  timestamptz not null default now()
);
create index games_start_idx on public.games (start_utc);
create index games_league_start_idx on public.games (league_id, start_utc);

create table public.players (
  id           text primary key,
  team_id      text references public.teams (id),
  name_zh      text not null,
  name_en      text not null,
  position     text,
  level        text not null default 'MLB',    -- MLB / AAA / AA / ... / NBA / NFL
  is_taiwanese boolean not null default false,
  note         text
);
create index players_taiwanese_idx on public.players (is_taiwanese) where is_taiwanese;

create table public.follows (
  user_id     uuid not null references auth.users (id) on delete cascade,
  target_type text not null check (target_type in ('team', 'player', 'league')),
  target_id   text not null,
  created_at  timestamptz not null default now(),
  primary key (user_id, target_type, target_id)
);

create table public.trip_inquiries (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users (id) on delete set null,
  name       text not null,
  email      text not null,
  league_id  text not null references public.leagues (id),
  date_from  date not null,
  date_to    date not null,
  party_size int  not null check (party_size between 1 and 50),
  message    text,
  status     text not null default 'new'
             check (status in ('new', 'waitlist', 'forwarded', 'closed')),
  created_at timestamptz not null default now(),
  check (date_to >= date_from)
);

-- ─── Row Level Security ─────────────────────────────────────────
alter table public.leagues        enable row level security;
alter table public.teams          enable row level security;
alter table public.games          enable row level security;
alter table public.players        enable row level security;
alter table public.follows        enable row level security;
alter table public.trip_inquiries enable row level security;

-- Public reference data: anyone may read; only the service role writes.
create policy "public read leagues" on public.leagues for select using (true);
create policy "public read teams"   on public.teams   for select using (true);
create policy "public read games"   on public.games   for select using (true);
create policy "public read players" on public.players for select using (true);

-- Follows: owner only.
create policy "own follows select" on public.follows for select using (auth.uid() = user_id);
create policy "own follows insert" on public.follows for insert with check (auth.uid() = user_id);
create policy "own follows delete" on public.follows for delete using (auth.uid() = user_id);

-- Trip inquiries: written by a validated server action (service role);
-- signed-in users can see their own.
create policy "own inquiries select" on public.trip_inquiries for select using (auth.uid() = user_id);
