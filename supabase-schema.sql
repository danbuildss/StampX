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
  agent_id uuid references agents(id) on delete set null,
  claimed_by text   -- wallet address of the human who claimed this agent stamp
);

-- Migration: add claimed_by if upgrading an existing DB
-- alter table stamps add column if not exists claimed_by text;

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

-- =============================================
-- CTO AGENT TABLES
-- =============================================

-- review_actions: tracks every approve/reject moderation decision
create table if not exists review_actions (
  id uuid primary key default gen_random_uuid(),
  stamp_id uuid not null,
  action text not null check (action in ('approved', 'rejected')),
  acted_at timestamptz not null default now(),
  reason text,
  actor text not null default 'admin'
);

alter table review_actions enable row level security;
create policy "Anyone can read review_actions" on review_actions for select using (true);
create policy "Anyone can insert review_actions" on review_actions for insert with check (true);

-- system_incidents: warnings and alerts raised by the rule engine
create table if not exists system_incidents (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  severity text not null check (severity in ('low', 'medium', 'high')),
  title text not null,
  description text not null,
  status text not null default 'open' check (status in ('open', 'resolved')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

alter table system_incidents enable row level security;
create policy "Anyone can read system_incidents" on system_incidents for select using (true);
create policy "Anyone can insert system_incidents" on system_incidents for insert with check (true);
create policy "Anyone can update system_incidents" on system_incidents for update using (true);

-- cto_reports: generated daily/weekly reports
create table if not exists cto_reports (
  id uuid primary key default gen_random_uuid(),
  report_type text not null check (report_type in ('daily', 'weekly', 'incident')),
  summary text not null,
  metrics_json jsonb,
  recommendations_json jsonb,
  created_at timestamptz not null default now()
);

alter table cto_reports enable row level security;
create policy "Anyone can read cto_reports" on cto_reports for select using (true);
create policy "Anyone can insert cto_reports" on cto_reports for insert with check (true);

-- Migrations for existing DBs:
-- (run these if upgrading an existing database)
-- alter table stamps add column if not exists claimed_by text;
