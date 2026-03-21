-- StampX Supabase Schema
-- Run this in your Supabase SQL editor

create table if not exists stamps (
  id uuid primary key default gen_random_uuid(),
  creator_name text not null,
  creator_wallet text,
  subject_type text not null check (subject_type in ('human', 'agent')),
  agent_platform text,
  stamp_type text not null check (stamp_type in ('content','growth','partnership','build','task','trade','community','other')),
  description text not null,
  source_link text,
  tx_hash text,
  metrics_views integer,
  metrics_clicks integer,
  metrics_volume numeric,
  metrics_leads integer,
  metrics_revenue numeric,
  metrics_custom text,
  verification_level text not null default 'self' check (verification_level in ('self','verified','onchain')),
  reward_token text,
  reward_amount numeric,
  reward_note text,
  score integer check (score >= 0 and score <= 100),
  created_at timestamptz not null default now()
);

-- Enable public read access
alter table stamps enable row level security;

create policy "Anyone can read stamps"
  on stamps for select using (true);

create policy "Anyone can insert stamps"
  on stamps for insert with check (true);
