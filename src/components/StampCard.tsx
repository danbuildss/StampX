"use client";

import Link from "next/link";
import { ExternalLink, Share2, Eye, MousePointer, TrendingUp, Users, Zap } from "lucide-react";
import { Stamp } from "@/lib/types";
import { cn, formatNumber, timeAgo } from "@/lib/utils";

const TYPE_LABELS: Record<string, string> = {
  content: "Content",
  growth: "Growth",
  partnership: "Partnership",
  build: "Build",
  task: "Task",
  trade: "Trade",
  community: "Community",
  other: "Other",
};

interface StampCardProps {
  stamp: Stamp;
  size?: "compact" | "full";
  showActions?: boolean;
}

function getVerificationBadge(stamp: Stamp) {
  if (stamp.index_status === "indexed" || stamp.index_status === "claimed") {
    return <span className="badge badge-indexed">⬡ Indexed</span>;
  }
  if (stamp.verification_level === "onchain") {
    return <span className="badge badge-onchain">⬡ Onchain</span>;
  }
  if (stamp.verification_level === "verified") {
    return <span className="badge badge-verified">✓ Verified</span>;
  }
  if (stamp.source_link) {
    return <span className="badge badge-linked">⬡ Linked Source</span>;
  }
  return <span className="badge badge-self-reported">○ Self Reported</span>;
}

export default function StampCard({
  stamp,
  size = "compact",
  showActions = true,
}: StampCardProps) {
  const isAgent = stamp.subject_type === "agent";
  const hasReward = !!stamp.reward_amount;
  const isIndexed = stamp.index_status === "indexed" || stamp.index_status === "claimed";

  const handleShare = () => {
    const url = `${window.location.origin}/stamp/${stamp.id}`;
    navigator.clipboard.writeText(url);
  };

  const initials = stamp.creator_name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Card background based on type
  let cardStyle: React.CSSProperties;
  if (isIndexed && isAgent) {
    cardStyle = {
      background: "rgba(20, 30, 30, 0.85)",
      border: "1px solid rgba(20, 184, 166, 0.22)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
    };
  } else if (isAgent) {
    cardStyle = {
      background: "rgba(26, 14, 40, 0.85)",
      border: "1px solid rgba(139, 92, 246, 0.22)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
    };
  } else {
    cardStyle = {
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
    };
  }

  return (
    <div
      className={cn("stamp-card rounded-2xl p-5 flex flex-col gap-4", size === "full" && "p-6")}
      style={cardStyle}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className={cn(
              "rounded-xl flex items-center justify-center font-bold text-sm shrink-0",
              size === "full" ? "w-12 h-12 text-base" : "w-10 h-10",
              isIndexed && isAgent
                ? "bg-teal-900/40 text-teal-300"
                : isAgent
                ? "bg-purple-900/50 text-purple-300"
                : "bg-blue-900/40 text-blue-300"
            )}
          >
            {isAgent ? (isIndexed ? <Zap size={16} /> : "⬡") : initials}
          </div>
          <div>
            <p className="font-semibold text-[var(--text)] leading-tight">
              {stamp.creator_name}
            </p>
            {stamp.creator_username && (
              <p className="text-[11px] text-[var(--text-muted)] leading-tight mb-0.5">
                {stamp.creator_username}
              </p>
            )}
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <span className={cn("badge", isAgent ? "badge-agent" : "badge-human")}>
                {isAgent ? "Agent" : "Human"}
              </span>
              <span
                className="badge badge-self"
                style={{
                  background: "rgba(59,130,246,0.06)",
                  color: "var(--text-muted)",
                  border: "1px solid var(--border)",
                }}
              >
                {TYPE_LABELS[stamp.stamp_type] || stamp.stamp_type}
              </span>
              {getVerificationBadge(stamp)}
            </div>
          </div>
        </div>
        <span className="text-xs text-[var(--text-muted)] shrink-0 mt-1">
          {timeAgo(stamp.created_at)}
        </span>
      </div>

      {/* Description */}
      <p
        className={cn(
          "text-[var(--text-subtle)] leading-relaxed",
          size === "full" ? "text-base" : "text-sm"
        )}
      >
        {stamp.description}
      </p>

      {/* Metrics */}
      {(stamp.metrics_views || stamp.metrics_clicks || stamp.metrics_volume || stamp.metrics_leads) && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {stamp.metrics_views && (
            <MetricBox icon={<Eye size={12} />} label="Views" value={formatNumber(stamp.metrics_views)} />
          )}
          {stamp.metrics_clicks && (
            <MetricBox icon={<MousePointer size={12} />} label="Clicks" value={formatNumber(stamp.metrics_clicks)} />
          )}
          {stamp.metrics_volume && (
            <MetricBox icon={<TrendingUp size={12} />} label="Volume" value={`$${formatNumber(stamp.metrics_volume)}`} />
          )}
          {stamp.metrics_leads && (
            <MetricBox icon={<Users size={12} />} label="Leads" value={formatNumber(stamp.metrics_leads)} />
          )}
        </div>
      )}

      {/* Reward block */}
      {hasReward && (
        <div
          className="rounded-xl px-3 py-2.5 flex items-center justify-between"
          style={{
            background: "rgba(245,158,11,0.07)",
            border: "1px solid rgba(245,158,11,0.22)",
            boxShadow: "0 0 14px rgba(245,158,11,0.07)",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-base">💰</span>
            <span className="text-sm font-bold text-amber-400">
              {stamp.reward_amount} {stamp.reward_token}
            </span>
          </div>
          <span className="text-[11px] text-amber-600 font-medium">Reward attached</span>
        </div>
      )}

      {/* Score bar */}
      {stamp.score && (
        <div className="flex items-center gap-3">
          <span className="text-xs text-[var(--text-muted)]">Score</span>
          <div className="flex-1 h-1.5 rounded-full bg-[#1e2d3d]">
            <div
              className="h-1.5 rounded-full"
              style={{
                width: `${stamp.score}%`,
                background: isIndexed
                  ? "linear-gradient(90deg, #0d9488, #2dd4bf)"
                  : isAgent
                  ? "linear-gradient(90deg, #7c3aed, #a78bfa)"
                  : "linear-gradient(90deg, #3b82f6, #8b5cf6)",
              }}
            />
          </div>
          <span className="text-xs font-bold text-[var(--text)]">{stamp.score}</span>
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex items-center gap-2 pt-1 border-t border-[var(--border)]">
          <Link
            href={`/stamp/${stamp.id}`}
            className="flex-1 text-center text-xs font-semibold text-[var(--primary)] hover:text-blue-400 transition-colors py-1.5"
          >
            View Proof
          </Link>
          {stamp.source_link && (
            <a
              href={stamp.source_link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/5 transition-colors"
            >
              <ExternalLink size={13} />
            </a>
          )}
          <button
            onClick={handleShare}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/5 transition-colors"
            title="Copy link"
          >
            <Share2 size={13} />
          </button>
        </div>
      )}
    </div>
  );
}

function MetricBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white/[0.03] border border-[var(--border)] rounded-xl p-2.5 flex flex-col gap-1">
      <div className="flex items-center gap-1 text-[var(--text-muted)]">
        {icon}
        <span className="text-[10px] uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-base font-bold text-[var(--text)]">{value}</p>
    </div>
  );
}
