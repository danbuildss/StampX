"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, TrendingUp, Users, MousePointer, Zap, Share2 } from "lucide-react";
import { cn, formatNumber, timeAgo } from "@/lib/utils";
import { Stamp, StampType, SubjectType } from "@/lib/types";
import { createStamp } from "@/lib/actions";

const STAMP_TYPES: { value: StampType; label: string }[] = [
  { value: "content", label: "Content" },
  { value: "growth", label: "Growth" },
  { value: "partnership", label: "Partnership" },
  { value: "build", label: "Build / Product" },
  { value: "task", label: "Task Completion" },
  { value: "trade", label: "Trade / Strategy" },
  { value: "community", label: "Community" },
  { value: "other", label: "Other" },
];

const INITIAL: Partial<Stamp> = {
  subject_type: "human",
  stamp_type: "content",
  verification_level: "self",
  creator_name: "",
  description: "",
  source_link: "",
  metrics_views: undefined,
  metrics_clicks: undefined,
  metrics_volume: undefined,
  metrics_leads: undefined,
  reward_amount: undefined,
  reward_token: "USDC",
};

export default function CreateStampForm() {
  const router = useRouter();
  const [form, setForm] = useState<Partial<Stamp>>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof Stamp, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!form.creator_name || !form.description) {
      setError("Name and description are required.");
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error: err } = await createStamp({
      creator_name: form.creator_name!,
      creator_wallet: form.creator_wallet,
      subject_type: form.subject_type as SubjectType,
      agent_platform: form.agent_platform,
      stamp_type: form.stamp_type as StampType,
      description: form.description!,
      source_link: form.source_link,
      tx_hash: form.tx_hash,
      metrics_views: form.metrics_views,
      metrics_clicks: form.metrics_clicks,
      metrics_volume: form.metrics_volume,
      metrics_leads: form.metrics_leads,
      metrics_revenue: form.metrics_revenue,
      metrics_custom: form.metrics_custom,
      verification_level: "self",
      reward_token: form.reward_amount ? form.reward_token : undefined,
      reward_amount: form.reward_amount,
      reward_note: form.reward_note,
    });
    setLoading(false);
    if (err || !data) {
      setError(err || "Failed to create stamp. Please try again.");
      return;
    }
    router.push(`/stamp/${data.id}`);
  };

  const initials = form.creator_name
    ? form.creator_name.slice(0, 2).toUpperCase()
    : "??";
  const isAgent = form.subject_type === "agent";

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text)]">Stamp your work.</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Proof over claims — describe what you did, back it with data, publish it.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT — Form */}
        <div className="flex flex-col gap-5">
          {/* Section A — Subject */}
          <FormSection title="Who is this stamp for?">
            <div className="flex gap-2">
              {(["human", "agent"] as SubjectType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => set("subject_type", type)}
                  className={cn(
                    "flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all capitalize",
                    form.subject_type === type
                      ? "border-blue-500 bg-blue-500/10 text-blue-400"
                      : "border-[var(--border)] text-[var(--text-muted)] hover:border-[#2d3f52]"
                  )}
                >
                  {type === "human" ? "👤 Human" : "🤖 AI Agent"}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder={isAgent ? "Agent name" : "Your name or handle"}
              value={form.creator_name || ""}
              onChange={(e) => set("creator_name", e.target.value)}
              className="input-field"
            />
            {isAgent && (
              <input
                type="text"
                placeholder="Platform (Virtuals, Custom, Base...)"
                value={form.agent_platform || ""}
                onChange={(e) => set("agent_platform", e.target.value)}
                className="input-field"
              />
            )}
            <input
              type="text"
              placeholder="Wallet address (optional)"
              value={form.creator_wallet || ""}
              onChange={(e) => set("creator_wallet", e.target.value)}
              className="input-field"
            />
          </FormSection>

          {/* Section B — Type */}
          <FormSection title="What kind of work is this?">
            <select
              value={form.stamp_type || "content"}
              onChange={(e) => set("stamp_type", e.target.value as StampType)}
              className="input-field"
            >
              {STAMP_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </FormSection>

          {/* Section C — Description */}
          <FormSection title="What happened?">
            <div className="flex gap-2 flex-wrap mb-1">
              {[
                "I posted a thread that generated [X] impressions",
                "I closed a deal — [X] new users onboarded",
                "I shipped [product] with [feature]",
              ].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => set("description", t)}
                  className="text-[11px] px-2.5 py-1 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[#2d3f52] transition-all"
                >
                  {t.length > 30 ? t.slice(0, 30) + "…" : t}
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              placeholder="Describe what you did and the result it created..."
              value={form.description || ""}
              onChange={(e) => set("description", e.target.value)}
              className="input-field resize-none"
            />
          </FormSection>

          {/* Section D — Source */}
          <FormSection title="Add proof source">
            <input
              type="url"
              placeholder="Paste a tweet link, tx hash, GitHub link, or task URL"
              value={form.source_link || ""}
              onChange={(e) => set("source_link", e.target.value)}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Transaction hash (optional)"
              value={form.tx_hash || ""}
              onChange={(e) => set("tx_hash", e.target.value)}
              className="input-field"
            />
          </FormSection>

          {/* Section E — Metrics */}
          <FormSection title="Add measurable impact (optional)">
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: "metrics_views", label: "Views" },
                { key: "metrics_clicks", label: "Clicks" },
                { key: "metrics_volume", label: "Volume ($)" },
                { key: "metrics_leads", label: "Leads" },
              ].map(({ key, label }) => (
                <input
                  key={key}
                  type="number"
                  placeholder={label}
                  value={(form as Record<string, unknown>)[key] as number || ""}
                  onChange={(e) =>
                    set(
                      key as keyof Stamp,
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className="input-field"
                />
              ))}
            </div>
          </FormSection>

          {/* Section G — Reward */}
          <FormSection title="Attach a reward? (optional)">
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Amount"
                value={form.reward_amount || ""}
                onChange={(e) =>
                  set("reward_amount", e.target.value ? Number(e.target.value) : undefined)
                }
                className="input-field flex-1"
              />
              <select
                value={form.reward_token || "USDC"}
                onChange={(e) => set("reward_token", e.target.value)}
                className="input-field w-28"
              >
                <option>USDC</option>
                <option>ETH</option>
              </select>
            </div>
          </FormSection>

          {error && (
            <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-all text-base"
          >
            <Zap size={16} />
            {loading ? "Stamping..." : "Stamp It"}
          </button>
        </div>

        {/* RIGHT — Live Preview */}
        <div className="lg:sticky lg:top-24 h-fit">
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest mb-3 font-semibold">
            Live Preview
          </p>
          <div className="glass rounded-2xl p-5 glow-blue">
            {/* Preview header */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm",
                    isAgent ? "bg-purple-900/40 text-purple-300" : "bg-blue-900/40 text-blue-300"
                  )}
                >
                  {isAgent ? "🤖" : initials}
                </div>
                <div>
                  <p className="font-semibold text-[var(--text)] text-sm">
                    {form.creator_name || "Your name"}
                  </p>
                  <div className="flex gap-1.5 mt-0.5 flex-wrap">
                    <span className={cn("badge", isAgent ? "badge-agent" : "badge-human")}>
                      {isAgent ? "Agent" : "Human"}
                    </span>
                    <span className="badge badge-self" style={{ background: "rgba(59,130,246,0.08)", color: "#6b7280", border: "1px solid #1e2d3d" }}>
                      {STAMP_TYPES.find((t) => t.value === form.stamp_type)?.label || "Content"}
                    </span>
                    <span className="badge badge-self">Self Reported</span>
                  </div>
                </div>
              </div>
              <span className="text-xs text-[var(--text-muted)] shrink-0">Just now</span>
            </div>

            <p className="text-sm text-[var(--text-subtle)] mb-4 leading-relaxed min-h-[40px]">
              {form.description || "Your stamp description will appear here..."}
            </p>

            {/* Metrics preview */}
            {(form.metrics_views || form.metrics_clicks || form.metrics_volume || form.metrics_leads) && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {form.metrics_views && (
                  <div className="bg-white/[0.03] border border-[var(--border)] rounded-xl p-2.5">
                    <div className="flex items-center gap-1 text-[var(--text-muted)] mb-1">
                      <Eye size={10} /><span className="text-[10px] uppercase">Views</span>
                    </div>
                    <p className="text-sm font-bold text-[var(--text)]">{formatNumber(form.metrics_views)}</p>
                  </div>
                )}
                {form.metrics_clicks && (
                  <div className="bg-white/[0.03] border border-[var(--border)] rounded-xl p-2.5">
                    <div className="flex items-center gap-1 text-[var(--text-muted)] mb-1">
                      <MousePointer size={10} /><span className="text-[10px] uppercase">Clicks</span>
                    </div>
                    <p className="text-sm font-bold text-[var(--text)]">{formatNumber(form.metrics_clicks)}</p>
                  </div>
                )}
                {form.metrics_volume && (
                  <div className="bg-white/[0.03] border border-[var(--border)] rounded-xl p-2.5">
                    <div className="flex items-center gap-1 text-[var(--text-muted)] mb-1">
                      <TrendingUp size={10} /><span className="text-[10px] uppercase">Volume</span>
                    </div>
                    <p className="text-sm font-bold text-[var(--text)]">${formatNumber(form.metrics_volume)}</p>
                  </div>
                )}
                {form.metrics_leads && (
                  <div className="bg-white/[0.03] border border-[var(--border)] rounded-xl p-2.5">
                    <div className="flex items-center gap-1 text-[var(--text-muted)] mb-1">
                      <Users size={10} /><span className="text-[10px] uppercase">Leads</span>
                    </div>
                    <p className="text-sm font-bold text-[var(--text)]">{formatNumber(form.metrics_leads)}</p>
                  </div>
                )}
              </div>
            )}

            {/* Reward preview */}
            {form.reward_amount && (
              <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <span className="text-amber-400 text-xs font-semibold">
                  💰 {form.reward_amount} {form.reward_token} attached
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 pt-3 border-t border-[var(--border)]">
              <button className="flex-1 text-xs font-semibold text-[var(--primary)]">
                View Proof
              </button>
              <button className="p-1.5 rounded-lg text-[var(--text-muted)]">
                <Share2 size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .input-field {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 13px;
          color: var(--text);
          outline: none;
          transition: border-color 0.2s;
        }
        .input-field:focus {
          border-color: #2d3f52;
        }
        .input-field::placeholder {
          color: var(--text-muted);
        }
        option {
          background: #111720;
        }
      `}</style>
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest">
        {title}
      </label>
      {children}
    </div>
  );
}
