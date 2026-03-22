"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Bot,
  Users,
  FileText,
  TrendingUp,
  Clock,
  Zap,
  Shield,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  getOpenIncidents,
  getCTOReports,
  resolveIncident,
} from "@/lib/actions";
import { computeCTOMetrics } from "@/lib/metrics";
import { CTOMetrics, SystemIncident, CTOReport } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

// ─── Severity colours ──────────────────────────────────────────────────────

const SEVERITY_STYLE: Record<string, { bg: string; text: string; border: string; label: string }> = {
  high: {
    bg: "rgba(239,68,68,0.08)",
    text: "#f87171",
    border: "rgba(239,68,68,0.2)",
    label: "High",
  },
  medium: {
    bg: "rgba(245,158,11,0.08)",
    text: "#fbbf24",
    border: "rgba(245,158,11,0.2)",
    label: "Medium",
  },
  low: {
    bg: "rgba(59,130,246,0.08)",
    text: "#60a5fa",
    border: "rgba(59,130,246,0.2)",
    label: "Low",
  },
};

// ─── Sub-components ────────────────────────────────────────────────────────

function MetricCard({
  label,
  value,
  sub,
  icon,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  accent?: string;
}) {
  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-2"
      style={{ background: "rgba(17,23,32,0.7)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-widest text-[var(--text-muted)]">{label}</span>
        <span style={{ color: accent || "var(--text-muted)" }}>{icon}</span>
      </div>
      <p className="text-2xl font-bold" style={{ color: accent || "var(--text)" }}>
        {value}
      </p>
      {sub && <p className="text-xs text-[var(--text-muted)]">{sub}</p>}
    </div>
  );
}

function IncidentRow({
  incident,
  onResolve,
}: {
  incident: SystemIncident;
  onResolve: (id: string) => void;
}) {
  const s = SEVERITY_STYLE[incident.severity] || SEVERITY_STYLE.low;
  const [resolving, setResolving] = useState(false);

  const handleResolve = async () => {
    setResolving(true);
    await resolveIncident(incident.id);
    onResolve(incident.id);
  };

  return (
    <div
      className="rounded-xl p-4 flex items-start gap-3"
      style={{ background: s.bg, border: `1px solid ${s.border}` }}
    >
      <AlertTriangle size={15} style={{ color: s.text }} className="mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-semibold text-[var(--text)]">{incident.title}</span>
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase"
            style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}
          >
            {s.label}
          </span>
        </div>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">{incident.description}</p>
        <p className="text-[11px] text-[var(--text-muted)] mt-1">{timeAgo(incident.created_at)}</p>
      </div>
      <button
        onClick={handleResolve}
        disabled={resolving}
        className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
        style={{
          background: "rgba(16,185,129,0.08)",
          border: "1px solid rgba(16,185,129,0.2)",
          color: "#10b981",
        }}
      >
        {resolving ? <RefreshCw size={11} className="animate-spin" /> : <CheckCircle size={11} />}
        Resolve
      </button>
    </div>
  );
}

function ReportRow({ report }: { report: CTOReport }) {
  const [expanded, setExpanded] = useState(false);
  const recs = report.recommendations_json || [];

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: "1px solid var(--border)" }}
    >
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <FileText size={14} className="text-[var(--text-muted)]" />
          <div>
            <span className="text-sm font-semibold text-[var(--text)] capitalize">
              {report.report_type} Report
            </span>
            <p className="text-[11px] text-[var(--text-muted)]">{timeAgo(report.created_at)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {recs.length > 0 && (
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full"
              style={{
                background: "rgba(245,158,11,0.08)",
                color: "#fbbf24",
                border: "1px solid rgba(245,158,11,0.2)",
              }}
            >
              {recs.length} action{recs.length !== 1 ? "s" : ""}
            </span>
          )}
          {expanded ? (
            <ChevronUp size={14} className="text-[var(--text-muted)]" />
          ) : (
            <ChevronDown size={14} className="text-[var(--text-muted)]" />
          )}
        </div>
      </button>
      {expanded && (
        <div
          className="px-4 pb-4"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <pre className="text-xs text-[var(--text-subtle)] leading-relaxed whitespace-pre-wrap font-mono mt-3">
            {report.summary}
          </pre>
        </div>
      )}
    </div>
  );
}

// ─── Main dashboard ────────────────────────────────────────────────────────

export default function CTODashboard() {
  const [metrics, setMetrics] = useState<CTOMetrics | null>(null);
  const [incidents, setIncidents] = useState<SystemIncident[]>([]);
  const [reports, setReports] = useState<CTOReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [m, { data: inc }, { data: reps }] = await Promise.all([
      computeCTOMetrics(),
      getOpenIncidents(),
      getCTOReports(10),
    ]);
    setMetrics(m);
    setIncidents(inc);
    setReports(reps);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleGenerateReport = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/cto/report", { method: "POST" });
      const json = await res.json();
      if (json.report) {
        setReports((prev) => [json.report, ...prev]);
        setLastGenerated(new Date().toISOString());
        // Reload incidents — new ones may have been created
        const { data: inc } = await getOpenIncidents();
        setIncidents(inc);
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleResolve = (id: string) => {
    setIncidents((prev) => prev.filter((i) => i.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const m = metrics!;
  const approvalPct = m.approval_rate;
  const humanPct =
    m.stamps_today > 0
      ? Math.round((m.human_stamps_today / m.stamps_today) * 100)
      : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield size={18} className="text-blue-400" />
            <h1 className="text-2xl font-bold text-[var(--text)]">CTO Agent</h1>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
              style={{
                background: "rgba(16,185,129,0.1)",
                color: "#10b981",
                border: "1px solid rgba(16,185,129,0.2)",
              }}
            >
              Phase 1 · Observer
            </span>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            System health · product intelligence · feed quality
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text)] transition-colors px-3 py-1.5 rounded-lg"
            style={{ border: "1px solid var(--border)" }}
          >
            <RefreshCw size={12} />
            Refresh
          </button>
          <button
            onClick={handleGenerateReport}
            disabled={generating}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-60"
            style={{
              background: "rgba(59,130,246,0.12)",
              border: "1px solid rgba(59,130,246,0.25)",
              color: "#60a5fa",
            }}
          >
            {generating ? (
              <RefreshCw size={13} className="animate-spin" />
            ) : (
              <Zap size={13} />
            )}
            {generating ? "Generating…" : "Generate Report"}
          </button>
        </div>
      </div>

      {lastGenerated && (
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl mb-6 text-xs"
          style={{
            background: "rgba(16,185,129,0.06)",
            border: "1px solid rgba(16,185,129,0.15)",
          }}
        >
          <CheckCircle size={12} className="text-emerald-400" />
          <span className="text-emerald-300 font-semibold">Report generated</span>
          <span className="text-[var(--text-muted)]">— {timeAgo(lastGenerated)}</span>
        </div>
      )}

      {/* ── Product Metrics ── */}
      <Section title="Product Metrics" icon={<TrendingUp size={14} />}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <MetricCard
            label="Live Stamps"
            value={m.live_stamps}
            sub="index_status: claimed"
            icon={<Activity size={14} />}
            accent="#10b981"
          />
          <MetricCard
            label="Stamps Today"
            value={m.stamps_today}
            sub={`${humanPct}% human`}
            icon={<FileText size={14} />}
          />
          <MetricCard
            label="Pending Review"
            value={m.pending_review}
            sub="awaiting moderation"
            icon={<Clock size={14} />}
            accent={m.pending_review > 10 ? "#fbbf24" : undefined}
          />
          <MetricCard
            label="Total Stamps"
            value={m.total_stamps}
            sub="all time"
            icon={<FileText size={14} />}
          />
        </div>
      </Section>

      {/* ── Review Metrics ── */}
      <Section title="Review Quality" icon={<CheckCircle size={14} />}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <MetricCard
            label="Approved"
            value={m.approved_total}
            sub="all time"
            icon={<CheckCircle size={14} />}
            accent="#10b981"
          />
          <MetricCard
            label="Rejected"
            value={m.rejected_total}
            sub="all time"
            icon={<XCircle size={14} />}
            accent="#f87171"
          />
          <MetricCard
            label="Approval Rate"
            value={`${approvalPct}%`}
            sub={approvalPct < 65 && m.approved_total + m.rejected_total > 5 ? "⚠ below target" : "of reviewed stamps"}
            icon={<TrendingUp size={14} />}
            accent={approvalPct < 65 && m.approved_total + m.rejected_total > 5 ? "#fbbf24" : "#10b981"}
          />
        </div>
      </Section>

      {/* ── Agent Metrics ── */}
      <Section title="Agent Health" icon={<Bot size={14} />}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <MetricCard
            label="Registered"
            value={m.total_agents}
            sub="total agents"
            icon={<Bot size={14} />}
          />
          <MetricCard
            label="Active (24h)"
            value={m.active_agents_24h}
            sub="recently indexed"
            icon={<Activity size={14} />}
            accent="#10b981"
          />
          <MetricCard
            label="Stale (>48h)"
            value={m.inactive_agents_48h}
            sub="no recent indexing"
            icon={<Clock size={14} />}
            accent={m.inactive_agents_48h > 0 ? "#fbbf24" : undefined}
          />
        </div>
      </Section>

      {/* ── Feed Split ── */}
      <Section title="Feed Composition" icon={<Users size={14} />}>
        <div
          className="rounded-xl p-4"
          style={{ background: "rgba(17,23,32,0.5)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center justify-between mb-3 text-xs text-[var(--text-muted)]">
            <span>Human <strong className="text-[var(--text)]">{m.human_stamps_today}</strong></span>
            <span>Today&apos;s stamps</span>
            <span>Agent <strong className="text-[var(--text)]">{m.agent_stamps_today}</strong></span>
          </div>
          <div className="h-3 rounded-full overflow-hidden bg-[#1e2d3d] flex">
            <div
              className="h-full rounded-l-full transition-all"
              style={{
                width: `${humanPct}%`,
                background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
              }}
            />
            <div
              className="h-full rounded-r-full transition-all"
              style={{
                width: `${100 - humanPct}%`,
                background: "linear-gradient(90deg, #7c3aed, #a78bfa)",
              }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-[10px] text-[var(--text-muted)]">
            <span className="text-blue-400">{humanPct}% human</span>
            <span className="text-purple-400">{100 - humanPct}% agent</span>
          </div>
        </div>
      </Section>

      {/* ── Open Incidents ── */}
      <Section
        title="Open Incidents"
        icon={<AlertTriangle size={14} />}
        count={incidents.length}
        countColor={incidents.length > 0 ? "#fbbf24" : "#10b981"}
      >
        {incidents.length === 0 ? (
          <div
            className="rounded-xl px-4 py-6 text-center"
            style={{ background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.12)" }}
          >
            <CheckCircle size={24} className="text-emerald-400/40 mx-auto mb-2" />
            <p className="text-sm text-[var(--text-muted)]">No open incidents</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {incidents.map((i) => (
              <IncidentRow key={i.id} incident={i} onResolve={handleResolve} />
            ))}
          </div>
        )}
      </Section>

      {/* ── Reports ── */}
      <Section
        title="Reports"
        icon={<FileText size={14} />}
        count={reports.length}
      >
        {reports.length === 0 ? (
          <div
            className="rounded-xl px-4 py-6 text-center"
            style={{ background: "rgba(17,23,32,0.4)", border: "1px solid var(--border)" }}
          >
            <FileText size={24} className="text-[var(--text-muted)]/40 mx-auto mb-2" />
            <p className="text-sm text-[var(--text-muted)]">No reports yet</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Click &ldquo;Generate Report&rdquo; to create the first one.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {reports.map((r) => (
              <ReportRow key={r.id} report={r} />
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}

// ─── Section wrapper ───────────────────────────────────────────────────────

function Section({
  title,
  icon,
  children,
  count,
  countColor,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  count?: number;
  countColor?: string;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[var(--text-muted)]">{icon}</span>
        <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
          {title}
        </h2>
        {count !== undefined && (
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
            style={{
              background: "rgba(255,255,255,0.05)",
              color: countColor || "var(--text-muted)",
            }}
          >
            {count}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
