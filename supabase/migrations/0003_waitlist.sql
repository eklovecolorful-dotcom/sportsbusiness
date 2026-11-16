-- 0003 · Waitlist (UC-02 in BILLING_MODE=waitlist) — docs/02-strategy.md §4, §7
-- Payments are off at launch. Readers join a free waitlist and state a payment intent.
-- The list is P1 behavioural evidence and the 90-day primary metric (500 sign-ups).

create table public.waitlist_signups (
  id              uuid primary key default gen_random_uuid(),
  email           text not null check (email = lower(btrim(email)) and length(email) <= 254),
  willing_to_pay  text not null
                  check (willing_to_pay in ('monthly_150', 'yearly_1500', 'would_pay_less', 'free_only')),
  interests       text[] not null default '{brief}'
                  check (interests <@ array['brief', 'trips', 'b2b']::text[]),
  utm_source      text check (length(utm_source) <= 100),
  utm_medium      text check (length(utm_medium) <= 100),
  utm_campaign    text check (length(utm_campaign) <= 100),
  landing_path    text check (length(landing_path) <= 200),
  consent_at      timestamptz not null,                  -- privacy-policy consent (PDPA)
  user_id         uuid references auth.users (id) on delete set null,
  welcomed_at     timestamptz,                           -- welcome email sent once
  unsubscribed_at timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Emails are stored normalized, so a plain unique index dedupes.
create unique index waitlist_signups_email_uq on public.waitlist_signups (email);
create index waitlist_signups_created_idx on public.waitlist_signups (created_at);

-- RLS on, and deliberately NO policies: anon/authenticated can neither read nor write.
-- Only the validated server action (service role) writes; stats come from a service-role script.
alter table public.waitlist_signups enable row level security;
