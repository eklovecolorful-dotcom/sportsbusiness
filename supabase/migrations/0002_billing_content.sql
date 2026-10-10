-- 0002 · Paid brief: profiles, Stripe subscriptions, paywalled content, push outbox
-- UC-02: Subscribe → Stripe Checkout → unlock articles. RLS is the paywall.

create table public.profiles (
  id                 uuid primary key references auth.users (id) on delete cascade,
  email              text,
  display_name       text,
  stripe_customer_id text unique,
  created_at         timestamptz not null default now()
);

-- Auto-create a profile for each new auth user.
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users for each row execute function public.handle_new_user();

-- Mirrors Stripe; written ONLY by the webhook (service role).
create table public.subscriptions (
  id                   text primary key,          -- Stripe subscription id
  user_id              uuid not null references auth.users (id) on delete cascade,
  status               text not null,             -- active / trialing / past_due / canceled / ...
  price_id             text,
  current_period_end   timestamptz,
  cancel_at_period_end boolean not null default false,
  updated_at           timestamptz not null default now()
);
create index subscriptions_user_idx on public.subscriptions (user_id);

create function public.has_active_subscription(uid uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.subscriptions s
    where s.user_id = uid and s.status in ('active', 'trialing')
  );
$$;

-- Weekly brief metadata + free excerpt (public).
create table public.briefs (
  slug         text primary key,                  -- '2026-41'
  title        text not null,
  takeaway     text not null,                     -- 本週一句話
  excerpt      text not null,                     -- free preview
  is_premium   boolean not null default true,
  published_at timestamptz,
  created_at   timestamptz not null default now()
);

-- Full body lives in its own table so RLS can gate it independently.
create table public.brief_bodies (
  slug text primary key references public.briefs (slug) on delete cascade,
  body text not null                              -- Markdown
);

-- Outbox for push/email notifications (e.g. postponed games, UC-01 alt flow).
create table public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  kind       text not null,                       -- 'game_postponed', ...
  ref_id     text not null,                       -- game id
  payload    jsonb not null default '{}',
  sent_at    timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, kind, ref_id)                  -- "exactly one push" per BDD scenario
);

alter table public.profiles      enable row level security;
alter table public.subscriptions enable row level security;
alter table public.briefs        enable row level security;
alter table public.brief_bodies  enable row level security;
alter table public.notifications enable row level security;

create policy "own profile select" on public.profiles for select using (auth.uid() = id);
create policy "own profile update" on public.profiles for update using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "own subscription select" on public.subscriptions for select using (auth.uid() = user_id);

create policy "published briefs readable" on public.briefs for select
  using (published_at is not null and published_at <= now());

-- THE PAYWALL: free bodies for everyone, premium bodies only for active subscribers.
create policy "brief body by entitlement" on public.brief_bodies for select using (
  exists (
    select 1 from public.briefs b
    where b.slug = brief_bodies.slug
      and b.published_at is not null and b.published_at <= now()
      and (not b.is_premium or public.has_active_subscription(auth.uid()))
  )
);

create policy "own notifications select" on public.notifications for select using (auth.uid() = user_id);
