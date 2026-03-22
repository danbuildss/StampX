export type StampType =
  | "content"
  | "growth"
  | "partnership"
  | "build"
  | "task"
  | "trade"
  | "community"
  | "other";

export type SubjectType = "human" | "agent";

export type VerificationLevel = "self" | "verified" | "onchain";

export type IndexStatus = "manual" | "indexed" | "claimed";

export type SourceType = "manual" | "onchain";

export interface Stamp {
  id: string;
  creator_name: string;
  creator_username?: string;
  creator_wallet?: string;
  subject_type: SubjectType;
  agent_platform?: string;
  stamp_type: StampType;
  description: string;
  source_link?: string;
  tx_hash?: string;
  metrics_views?: number;
  metrics_clicks?: number;
  metrics_volume?: number;
  metrics_leads?: number;
  metrics_revenue?: number;
  metrics_custom?: string;
  verification_level: VerificationLevel;
  reward_token?: string;
  reward_amount?: number;
  reward_note?: string;
  score?: number;
  created_at: string;
  // Auto-indexing fields
  index_status?: IndexStatus;
  source_type?: SourceType;
  source_id?: string;
  indexed_at?: string;
  agent_id?: string;
  // Claim fields
  claimed_by?: string;
}

export interface Agent {
  id: string;
  name: string;
  wallet: string;
  platform?: string;
  description?: string;
  created_at: string;
  last_indexed?: string;
}

// =============================================
// CTO AGENT TYPES
// =============================================

export interface ReviewAction {
  id: string;
  stamp_id: string;
  action: "approved" | "rejected";
  acted_at: string;
  reason?: string;
  actor: string;
}

export type IncidentSeverity = "low" | "medium" | "high";
export type IncidentStatus = "open" | "resolved";

export interface SystemIncident {
  id: string;
  type: string;
  severity: IncidentSeverity;
  title: string;
  description: string;
  status: IncidentStatus;
  created_at: string;
  resolved_at?: string;
}

export interface CTOReport {
  id: string;
  report_type: "daily" | "weekly" | "incident";
  summary: string;
  metrics_json?: CTOMetrics;
  recommendations_json?: string[];
  created_at: string;
}

export interface CTOMetrics {
  // Product
  total_stamps: number;
  stamps_today: number;
  human_stamps_today: number;
  agent_stamps_today: number;
  pending_review: number;
  live_stamps: number;
  // Review
  approved_total: number;
  rejected_total: number;
  approval_rate: number;
  // Agents
  total_agents: number;
  active_agents_24h: number;
  inactive_agents_48h: number;
}
