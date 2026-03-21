-- StampX Supabase Schema
-- Run this in your Supabase SQL editor

-- =============================================
-- AGENTS TABLE (new)
-- =============================================
create table if not exists agents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  wallet text not null,
  platform text,
  description text,
  created_at timestamptz not null default now(),
  last_indexed timestamptz
);

-- Unique wallet per agent
create unique index if not exists agents_wallet_idx on agents(wallet);

-- Enable RLS
alter table agents enable row level security;

create policy "Anyone can read agents"
  on agents for select using (true);

create policy "Anyone can insert agents"
  on agents for insert with check (true);

create policy "Anyone can update agents"
  on agents for update using (true);

-- =============================================
-- STAMPS TABLE
-- =============================================
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
  created_at timestamptz not null default now(),

  -- Auto-indexing fields (new)
  index_status text not null default 'manual' check (index_status in ('manual','indexed','claimed')),
  source_type text not null default 'manual' check (source_type in ('manual','onchain')),
  source_id text,    -- dedup key e.g. "{agentId}_{YYYY-MM-DD}"
  indexed_at timestamptz,
  agent_id uuid references agents(id) on delete set null
);

-- Unique constraint for dedup (only where source_id is set)
create unique index if not exists stamps_source_id_idx on stamps(source_id) where source_id is not null;

-- Enable public read access
alter table stamps enable row level security;

create policy "Anyone can read stamps"
  on stamps for select using (true);

create policy "Anyone can insert stamps"
  on stamps for insert with check (true);

create policy "Anyone can update stamps"
  on stamps for update using (true);
