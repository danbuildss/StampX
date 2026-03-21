"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bot, ArrowLeft, Activity, RefreshCw, TrendingUp, Zap, Clock } from "lucide-react";
import { Agent, Stamp } from "@/lib/types";
import { getAgent, getStampsByAgent } from "@/lib/actions";
import { timeAgo, shortWallet, formatNumber } from "@/lib/utils";
import StampCard from "./StampCard";

export default function AgentProfilePage({ agentId }: { agentId: string }) {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [loading, setLoading] = useState(true);
  const [indexing, setIndexing] = useState(false);
  const [indexResult, setIndexResult] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getAgent(agentId), getStampsByAgent(agentId)]).then(
      ([{ data: a }, { data: s }]) => {
        setAgent(a);
        setStamps(s);
        setLoading(false);
      }
    );
  }, [agentId]);

  const handleForceIndex = async () => {
    if (!agent) return;
    setIndexing(true);
    setIndexResult(null);
    try {
      const res = await fetch("/api/index-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId: agent.id }),
      });
      const json = await res.json();
      if (json.indexed > 0) {
        setIndexResult(`✓ Indexed ${json.txCount} transactions`);
        // Refresh stamps
        getStampsByAgent(agentId).then(({ data }) => setStamps(data));
      } else {
        setIndexResult(json.message || "Nothing new to index");
      }
    } catch {
      setIndexResult("Index failed — try again");
    }
    setIndexing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-6 h-6 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-[var(--text-muted)]">Agent not found.</p>
        <Link href="/agents" className="text-purple-400 text-sm mt-4 inline-block">
          ← Back to Agents
        </Link>
      </div>
    );
  }

  // Stats computed from stamps
  const totalVolume = stamps.reduce((s, st) => s + (st.metrics_volume || 0), 0);
  const totalTxEstimate = stamps.reduce((s, st) => {
    const match = st.description.match(/Executed (\d+)/);
    return s + (match ? parseInt(match[1]) : 0);
  }, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back */}
      <Link
        href="/agents"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        Agents
      </Link>

      {/* Header card */}
      <div
        className="rounded-2xl p-6 mb-6"
        style={{
          background: "rgba(26, 14, 40, 0.7)",
          border: "1px solid rgba(139, 92, 246, 0.22)",
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(139, 92, 246, 0.15)" }}
            >
              <Bot size={26} className="text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-[var(--text)]">{agent.name}</h1>
                <span className="badge badge-agent">Agent</span>
                {agent.platform && (
                  <span
                    className="badge"
                    style={{
                      background: "rgba(59,130,246,0.1)",
                      color: "#60a5fa",
                      border: "1px solid rgba(59,130,246,0.2)",
                    }}
                  >
                    {agent.platform}
                  </span>
                )}
              </div>
              <p className="text-sm font-mono text-[var(--text-muted)]">
                {shortWallet(agent.wallet)}
              </p>
              {agent.description && (
                <p className="text-sm text-[var(--text-subtle)] mt-1">
                  {agent.description}
                </p>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="text-right shrink-0">
            <div className="flex items-center gap-1.5 justify-end mb-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  background: agent.last_indexed ? "#10b981" : "#64748b",
                  boxShadow: agent.last_indexed
                    ? "0 0 6px rgba(16,185,129,0.6)"
                    : "none",
                }}
              />
              <span className="text-sm font-semibold text-[var(--text)]">
                {agent.last_indexed ? "Active" : "Pending"}
              </span>
            </div>
            {agent.last_indexed && (
              <p className="text-xs text-[var(--text-muted)]">
                Last indexed {timeAgo(agent.last_indexed)}
              </p>
            )}
          </div>
        </div>

        {/* Force index button */}
        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={handleForceIndex}
            disabled={indexing}
            className="flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 disabled:opacity-50 transition-colors px-3 py-1.5 rounded-lg"
            style={{ border: "1px solid rgba(139,92,246,0.2)" }}
          >
            <RefreshCw size={12} className={indexing ? "animate-spin" : ""} />
            {indexing ? "Indexing..." : "Run Index Now"}
          </button>
          {indexResult && (
            <span className="text-xs text-[var(--text-muted)]">{indexResult}</span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          {
            icon: <Activity size={16} className="text-purple-400" />,
            label: "Total Stamps",
            value: stamps.length.toString(),
          },
          {
            icon: <Zap size={16} className="text-blue-400" />,
            label: "Transactions",
            value: formatNumber(totalTxEstimate),
          },
          {
            icon: <TrendingUp size={16} className="text-green-400" />,
            label: "Volume",
            value: totalVolume > 0 ? `$${formatNumber(totalVolume)}` : "—",
          },
          {
            icon: <Clock size={16} className="text-[var(--text-muted)]" />,
            label: "Registered",
            value: timeAgo(agent.created_at),
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl px-4 py-3"
            style={{
              background: "rgba(17,23,32,0.6)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center gap-1.5 mb-1">{stat.icon}</div>
            <p className="text-lg font-bold text-[var(--text)]">{stat.value}</p>
            <p className="text-xs text-[var(--text-muted)]">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Stamps */}
      <div>
        <h2 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-4">
          Indexed Activity
        </h2>
        {stamps.length === 0 ? (
          <div
            className="rounded-2xl p-10 text-center"
            style={{
              background: "rgba(17,23,32,0.4)",
              border: "1px solid var(--border)",
            }}
          >
            <Bot size={32} className="text-purple-400/30 mx-auto mb-3" />
            <p className="text-sm text-[var(--text-muted)]">
              No indexed stamps yet. Run an index to fetch this agent's Base activity.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stamps.map((stamp) => (
              <StampCard key={stamp.id} stamp={stamp} size="compact" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
