"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Bot, TrendingUp, Clock, Zap, RefreshCw } from "lucide-react";
import { Stamp } from "@/lib/types";
import { getPendingStamps, approveStamp, rejectStamp } from "@/lib/actions";
import { timeAgo, formatNumber, shortWallet } from "@/lib/utils";

type ItemState = "idle" | "approving" | "rejecting" | "done";

function PendingStampRow({
  stamp,
  onApprove,
  onReject,
}: {
  stamp: Stamp;
  onApprove: () => void;
  onReject: () => void;
}) {
  const [state, setState] = useState<ItemState>("idle");

  const handleApprove = async () => {
    setState("approving");
    await approveStamp(stamp.id);
    setState("done");
    onApprove();
  };

  const handleReject = async () => {
    setState("rejecting");
    await rejectStamp(stamp.id);
    setState("done");
    onReject();
  };

  if (state === "done") return null;

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "rgba(17,23,32,0.7)",
        border: "1px solid var(--border)",
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(20,184,166,0.12)" }}
          >
            <Bot size={17} className="text-teal-400" />
          </div>
          <div>
            <p className="font-semibold text-[var(--text)] leading-tight">{stamp.creator_name}</p>
            {stamp.creator_wallet && (
              <p className="text-[11px] font-mono text-[var(--text-muted)] leading-tight">
                {shortWallet(stamp.creator_wallet)}
              </p>
            )}
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <span
                className="badge"
                style={{
                  background: "rgba(139,92,246,0.12)",
                  color: "#a78bfa",
                  border: "1px solid rgba(139,92,246,0.2)",
                }}
              >
                Agent
              </span>
              {stamp.agent_platform && (
                <span
                  className="badge"
                  style={{
                    background: "rgba(59,130,246,0.08)",
                    color: "#60a5fa",
                    border: "1px solid rgba(59,130,246,0.15)",
                  }}
                >
                  {stamp.agent_platform}
                </span>
              )}
              <span
                className="badge badge-indexed"
              >
                ⬡ Pending Review
              </span>
            </div>
          </div>
        </div>

        {/* Timestamp */}
        <div className="text-right shrink-0">
          <p className="text-xs text-[var(--text-muted)]">
            {stamp.indexed_at ? timeAgo(stamp.indexed_at) : timeAgo(stamp.created_at)}
          </p>
          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Indexed</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-[var(--text-subtle)] leading-relaxed mb-3">
        {stamp.description}
      </p>

      {/* Metrics row */}
      {stamp.metrics_volume && (
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl mb-4 w-fit"
          style={{
            background: "rgba(20,184,166,0.06)",
            border: "1px solid rgba(20,184,166,0.15)",
          }}
        >
          <TrendingUp size={12} className="text-teal-400" />
          <span className="text-xs font-semibold text-teal-400">
            ${formatNumber(stamp.metrics_volume)} volume
          </span>
        </div>
      )}

      {/* Actions */}
      <div
        className="flex items-center gap-3 pt-3"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <button
          onClick={handleApprove}
          disabled={state !== "idle"}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
          style={{
            background: "rgba(16,185,129,0.12)",
            border: "1px solid rgba(16,185,129,0.3)",
            color: "#10b981",
          }}
        >
          {state === "approving" ? (
            <RefreshCw size={13} className="animate-spin" />
          ) : (
            <CheckCircle size={13} />
          )}
          Approve — Go Live
        </button>

        <button
          onClick={handleReject}
          disabled={state !== "idle"}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
            color: "#f87171",
          }}
        >
          {state === "rejecting" ? (
            <RefreshCw size={13} className="animate-spin" />
          ) : (
            <XCircle size={13} />
          )}
          Reject
        </button>
      </div>
    </div>
  );
}

export default function ReviewPage() {
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);

  const load = () => {
    setLoading(true);
    getPendingStamps().then(({ data }) => {
      setStamps(data);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const handleApprove = (id: string) => {
    setStamps((prev) => prev.filter((s) => s.id !== id));
    setApprovedCount((n) => n + 1);
  };

  const handleReject = (id: string) => {
    setStamps((prev) => prev.filter((s) => s.id !== id));
    setRejectedCount((n) => n + 1);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap size={18} className="text-teal-400" />
            <h1 className="text-2xl font-bold text-[var(--text)]">Review Queue</h1>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            Auto-indexed stamps pending approval before going live in the feed.
          </p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text)] transition-colors px-3 py-1.5 rounded-lg"
          style={{ border: "1px solid var(--border)" }}
        >
          <RefreshCw size={12} />
          Refresh
        </button>
      </div>

      {/* Session stats */}
      {(approvedCount > 0 || rejectedCount > 0) && (
        <div
          className="flex items-center gap-4 px-4 py-3 rounded-xl mb-6 text-sm"
          style={{
            background: "rgba(17,23,32,0.6)",
            border: "1px solid var(--border)",
          }}
        >
          <span className="text-[var(--text-muted)]">This session:</span>
          {approvedCount > 0 && (
            <span className="font-semibold text-emerald-400">
              ✓ {approvedCount} approved
            </span>
          )}
          {rejectedCount > 0 && (
            <span className="font-semibold text-red-400">
              ✗ {rejectedCount} rejected
            </span>
          )}
        </div>
      )}

      {/* Queue count */}
      {!loading && stamps.length > 0 && (
        <div className="flex items-center gap-2 mb-5">
          <span
            className="text-xs font-bold px-2 py-1 rounded-full"
            style={{
              background: "rgba(20,184,166,0.12)",
              color: "#2dd4bf",
              border: "1px solid rgba(20,184,166,0.25)",
            }}
          >
            {stamps.length} pending
          </span>
          <span className="text-xs text-[var(--text-muted)]">
            Review each carefully before approving
          </span>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
        </div>
      ) : stamps.length === 0 ? (
        <div
          className="text-center py-20 rounded-2xl"
          style={{
            background: "rgba(17,23,32,0.4)",
            border: "1px solid var(--border)",
          }}
        >
          <CheckCircle size={36} className="text-emerald-400/40 mx-auto mb-3" />
          <p className="font-semibold text-[var(--text)] mb-1">Queue is clear</p>
          <p className="text-sm text-[var(--text-muted)]">
            No pending stamps right now. Check back after the next index run.
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-[var(--text-muted)]">
            <Clock size={12} />
            Auto-indexing runs every 6 hours
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {stamps.map((stamp) => (
            <PendingStampRow
              key={stamp.id}
              stamp={stamp}
              onApprove={() => handleApprove(stamp.id)}
              onReject={() => handleReject(stamp.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
