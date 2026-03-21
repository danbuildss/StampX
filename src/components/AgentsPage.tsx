"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Bot, Zap, Clock, Activity } from "lucide-react";
import { Agent } from "@/lib/types";
import { getAgents } from "@/lib/actions";
import { timeAgo, shortWallet } from "@/lib/utils";

function AgentRow({ agent, index }: { agent: Agent; index: number }) {
  return (
    <Link href={`/agent/${agent.id}`}>
      <div
        className="stamp-card rounded-2xl p-5 flex items-center gap-4 cursor-pointer"
        style={{
          background: "rgba(26, 14, 40, 0.6)",
          border: "1px solid rgba(139, 92, 246, 0.18)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Rank */}
        <div className="w-8 text-center">
          <span className="text-sm font-bold text-[var(--text-muted)]">
            #{index + 1}
          </span>
        </div>

        {/* Avatar */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0"
          style={{ background: "rgba(139, 92, 246, 0.15)" }}
        >
          <Bot size={20} className="text-purple-400" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="font-semibold text-[var(--text)] truncate">{agent.name}</p>
            {agent.platform && (
              <span className="badge badge-agent shrink-0">{agent.platform}</span>
            )}
          </div>
          <p className="text-xs text-[var(--text-muted)] font-mono">
            {shortWallet(agent.wallet)}
          </p>
        </div>

        {/* Stats */}
        <div className="hidden sm:flex items-center gap-6 text-right">
          <div>
            <p className="text-xs text-[var(--text-muted)]">Last Active</p>
            <p className="text-sm font-semibold text-[var(--text)]">
              {agent.last_indexed ? timeAgo(agent.last_indexed) : "Never"}
            </p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-muted)]">Status</p>
            <div className="flex items-center gap-1 justify-end">
              <div
                className="w-1.5 h-1.5 rounded-full"
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
          </div>
        </div>

        {/* Arrow */}
        <div className="text-[var(--text-muted)]">
          <Zap size={14} className="text-purple-400/50" />
        </div>
      </div>
    </Link>
  );
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAgents().then(({ data }) => {
      setAgents(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bot size={20} className="text-purple-400" />
            <h1 className="text-2xl font-bold text-[var(--text)]">Agents</h1>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            AI agents being tracked on Base. Activity auto-indexed every 24h.
          </p>
        </div>
        <Link
          href="/agents/add"
          className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all"
        >
          <Plus size={14} />
          Register Agent
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          {
            icon: <Bot size={16} className="text-purple-400" />,
            label: "Registered",
            value: agents.length,
          },
          {
            icon: <Activity size={16} className="text-green-400" />,
            label: "Active",
            value: agents.filter((a) => a.last_indexed).length,
          },
          {
            icon: <Clock size={16} className="text-[var(--text-muted)]" />,
            label: "Pending",
            value: agents.filter((a) => !a.last_indexed).length,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl px-4 py-3 flex items-center gap-3"
            style={{
              background: "rgba(17,23,32,0.6)",
              border: "1px solid var(--border)",
            }}
          >
            {stat.icon}
            <div>
              <p className="text-lg font-bold text-[var(--text)]">{stat.value}</p>
              <p className="text-xs text-[var(--text-muted)]">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Agent list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
        </div>
      ) : agents.length === 0 ? (
        <div className="text-center py-24">
          <Bot size={40} className="text-purple-400/30 mx-auto mb-4" />
          <p className="text-lg font-semibold text-[var(--text)] mb-2">
            No agents registered yet.
          </p>
          <p className="text-sm text-[var(--text-muted)] mb-6">
            Register the first AI agent to start auto-indexing its Base activity.
          </p>
          <Link
            href="/agents/add"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors"
          >
            Register an Agent →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {agents.map((agent, i) => (
            <AgentRow key={agent.id} agent={agent} index={i} />
          ))}
        </div>
      )}

      {/* Info box */}
      <div
        className="mt-8 rounded-2xl p-5"
        style={{
          background: "rgba(139,92,246,0.05)",
          border: "1px solid rgba(139,92,246,0.15)",
        }}
      >
        <div className="flex items-start gap-3">
          <Zap size={16} className="text-purple-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-[var(--text)] mb-1">
              Auto-indexing on Base
            </p>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Every 24h, StampX fetches each agent's onchain activity from Base via Basescan
              and auto-generates indexed stamps. Wallet transactions are aggregated into
              daily proof records — no manual input needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
