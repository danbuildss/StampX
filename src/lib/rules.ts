import { CTOMetrics } from "./types";

export interface RuleResult {
  type: string;
  severity: "low" | "medium" | "high";
  title: string;
  description: string;
}

export function runRules(metrics: CTOMetrics): RuleResult[] {
  const incidents: RuleResult[] = [];

  // Review backlog
  if (metrics.pending_review > 20) {
    incidents.push({
      type: "review_backlog",
      severity: "medium",
      title: "Review backlog is too large",
      description: `${metrics.pending_review} stamps are pending review. Clear the queue before the next indexing cycle to keep the feed fresh.`,
    });
  } else if (metrics.pending_review > 10) {
    incidents.push({
      type: "review_backlog",
      severity: "low",
      title: "Review queue is building up",
      description: `${metrics.pending_review} stamps are waiting for review.`,
    });
  }

  // Low approval rate (only meaningful after enough reviews)
  if (
    metrics.approval_rate < 65 &&
    metrics.approved_total + metrics.rejected_total > 5
  ) {
    incidents.push({
      type: "low_approval_rate",
      severity: "medium",
      title: "Stamp approval rate is low",
      description: `Approval rate is ${metrics.approval_rate}%. Over a third of indexed stamps are being rejected — review indexing quality or tighten the feed filter.`,
    });
  }

  // Feed imbalance — humans underrepresented
  const humanPct =
    metrics.stamps_today > 0
      ? Math.round((metrics.human_stamps_today / metrics.stamps_today) * 100)
      : 0;
  if (humanPct < 20 && metrics.stamps_today > 5) {
    incidents.push({
      type: "feed_imbalance",
      severity: "low",
      title: "Human stamps underrepresented today",
      description: `Only ${humanPct}% of today's stamps are from humans (${metrics.human_stamps_today} of ${metrics.stamps_today}). Consider promoting manual creation.`,
    });
  }

  // Stale agents
  if (metrics.inactive_agents_48h > 0 && metrics.total_agents > 0) {
    const plural = metrics.inactive_agents_48h === 1 ? "agent has" : "agents have";
    incidents.push({
      type: "stale_agents",
      severity: "low",
      title: `${metrics.inactive_agents_48h} ${plural} not been indexed in 48h`,
      description: `These agents may have stale data. Trigger a manual index or check their wallet activity.`,
    });
  }

  // Empty feed
  if (metrics.live_stamps === 0) {
    incidents.push({
      type: "empty_feed",
      severity: "high",
      title: "Feed is empty",
      description: "No approved stamps are live. Approve pending stamps or trigger indexing.",
    });
  }

  return incidents;
}
