"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ExternalLink,
  Share2,
  Copy,
  CheckCircle,
  Eye,
  MousePointer,
  TrendingUp,
  Users,
  ArrowLeft,
} from "lucide-react";
import { Stamp } from "@/lib/types";
import { getStamp, getRelatedStamps } from "@/lib/actions";
import { MOCK_STAMPS } from "@/lib/mock-data";
import { cn, formatNumber, timeAgo, shortWallet } from "@/lib/utils";
import StampCard from "./StampCard";
import ClaimBanner from "./ClaimBanner";

const TYPE_LABELS: Record<string, string> = {
  content: "Content", growth: "Growth", partnership: "Partnership",
  build: "Build", task: "Task", trade: "Trade", community: "Community", other: "Other",
};

export default function StampDetailPage({ id }: { id: string }) {
  const [stamp, setStamp] = useState<Stamp | null>(null);
  const [related, setRelated] = useState<Stamp[]>([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mock = MOCK_STAMPS.find((s) => s.id === id);
    if (mock) {
      setStamp(mock);
      setRelated(MOCK_STAMPS.filter((s) => s.id !== id).slice(0, 3));
      setLoading(false);
      return;
    }

    getStamp(id).then(({ data }) => {
      if (data) {
        setStamp(data);
        getRelatedStamps(id, data.creator_wallet, data.stamp_type).then((r) =>
          setRelated(r)
        );
      }
      setLoading(false);
    });
  }, [id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareX = () => {
    if (!stamp) return;
    const text = `${stamp.description}\n\nVerified on StampX — proof over claims.`;
    const url = encodeURIComponent(window.location.href);
    const tweet = encodeURIComponent(text);
    window.open(`https://twitter.com/intent/tweet?text=${tweet}&url=${url}`, "_blank");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!stamp) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-[var(--text-muted)] mb-4">Stamp not found.</p>
        <Link href="/feed" className="text-sm text-[var(--primary)]">← Back to feed</Link>
      </div>
    );
  }

  const isVerified = stamp.verification_level === "verified" || stamp.verification_level === "onchain";
  const isAgent = stamp.subject_type === "agent";
  const initials = stamp.creator_name.slice(0, 2).toUpperCase();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Back */}
      <Link
        href="/feed"
        className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        Back to feed
      </Link>

      {/* Main stamp card */}
      <div className="glass rounded-2xl p-6 mb-6 glow-blue">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg",
                isAgent ? "bg-purple-900/40 text-purple-300" : "bg-blue-900/40 text-blue-300"
              )}
            >
              {isAgent ? "🤖" : initials}
            </div>
            <div>
              <h1 className="text-lg font-bold text-[var(--text)]">{stamp.creator_name}</h1>
              {stamp.creator_username && (
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{stamp.creator_username}</p>
              )}
              {stamp.creator_wallet && (
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{shortWallet(stamp.creator_wallet)}</p>
              )}
              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                <span className={cn("badge", isAgent ? "badge-agent" : "badge-human")}>
                  {isAgent ? "🤖 Agent" : "👤 Human"}
                </span>
                {stamp.agent_platform && (
                  <span className="badge badge-self">{stamp.agent_platform}</span>
                )}
                <span className="badge badge-self" style={{ background: "rgba(59,130,246,0.08)", color: "#6b7280", border: "1px solid #1e2d3d" }}>
                  {TYPE_LABELS[stamp.stamp_type]}
                </span>
                {isVerified ? (
                  <span className="badge badge-verified">✓ Verified</span>
                ) : (
                  <span className="badge badge-self">Self Reported</span>
                )}
                <span className="badge" style={{ background: "rgba(20,184,166,0.1)", color: "#14b8a6", border: "1px solid rgba(20,184,166,0.2)" }}>
                  Base
                </span>
              </div>
            </div>
          </div>
          <span className="text-xs text-[var(--text-muted)] shrink-0">{timeAgo(stamp.created_at)}</span>
        </div>

        {/* Description */}
        <p className="text-base text-[var(--text-subtle)] leading-relaxed mb-6">
          {stamp.description}
        </p>

        {/* Metrics */}
        {(stamp.metrics_views || stamp.metrics_clicks || stamp.metrics_volume || stamp.metrics_leads) && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {stamp.metrics_views && (
              <MetricBox icon={<Eye size={13} />} label="Views" value={formatNumber(stamp.metrics_views)} />
            )}
            {stamp.metrics_clicks && (
              <MetricBox icon={<MousePointer size={13} />} label="Clicks" value={formatNumber(stamp.metrics_clicks)} />
            )}
            {stamp.metrics_volume && (
              <MetricBox icon={<TrendingUp size={13} />} label="Volume" value={`$${formatNumber(stamp.metrics_volume)}`} />
            )}
            {stamp.metrics_leads && (
              <MetricBox icon={<Users size={13} />} label="Leads" value={formatNumber(stamp.metrics_leads)} />
            )}
          </div>
        )}

        {/* Score */}
        {stamp.score && (
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs text-[var(--text-muted)] w-10">Score</span>
            <div className="flex-1 h-2 rounded-full bg-[#1e2d3d]">
              <div
                className="h-2 rounded-full"
                style={{ width: `${stamp.score}%`, background: "linear-gradient(90deg, #3b82f6, #8b5cf6)" }}
              />
            </div>
            <span className="text-sm font-bold text-[var(--text)] w-6 text-right">{stamp.score}</span>
          </div>
        )}

        {/* Source / Reward row */}
        <div className="flex flex-wrap gap-3 mb-6">
          {stamp.source_link && (
            <a
              href={stamp.source_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.03] border border-[var(--border)] text-sm text-[var(--text-subtle)] hover:text-[var(--text)] transition-colors"
            >
              <ExternalLink size={13} />
              View source
            </a>
          )}
          {stamp.tx_hash && (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.03] border border-[var(--border)] text-sm text-[var(--text-muted)]">
              🔗 {stamp.tx_hash.slice(0, 10)}...
            </div>
          )}
          {stamp.reward_amount && (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-amber-400 font-semibold">
              💰 {stamp.reward_amount} {stamp.reward_token} attached
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="pt-4 border-t border-[var(--border)] flex flex-wrap gap-4 text-xs text-[var(--text-muted)]">
          <span>Stamp #{stamp.id.slice(0, 8)}</span>
          <span>Published {new Date(stamp.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
          {stamp.creator_wallet && <span>{shortWallet(stamp.creator_wallet)}</span>}
        </div>
      </div>

      {/* Claim banner — agent stamps only */}
      {isAgent && (
        <ClaimBanner stampId={stamp.id} claimedBy={stamp.claimed_by} />
      )}

      {/* Share section */}
      <div className="glass rounded-2xl p-5 mb-10">
        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-4">
          Share this Stamp
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleShareX}
            className="flex items-center justify-center gap-2 flex-1 bg-black hover:bg-neutral-900 border border-neutral-700 text-white font-semibold py-3 rounded-xl transition-all text-sm"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
            </svg>
            Post to X
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 flex-1 border border-[var(--border)] text-[var(--text-subtle)] hover:text-[var(--text)] hover:border-[#2d3f52] font-medium py-3 rounded-xl transition-all text-sm"
          >
            {copied ? <CheckCircle size={15} className="text-green-400" /> : <Copy size={15} />}
            {copied ? "Link copied!" : "Copy link"}
          </button>
        </div>
      </div>

      {/* Related stamps */}
      {related.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-4">
            More Stamps
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {related.slice(0, 2).map((s) => (
              <StampCard key={s.id} stamp={s} size="compact" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MetricBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white/[0.03] border border-[var(--border)] rounded-xl p-3 flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
        {icon}
        <span className="text-[10px] uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-base font-bold text-[var(--text)]">{value}</p>
    </div>
  );
}
