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

export interface Stamp {
  id: string;
  creator_name: string;
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
}
