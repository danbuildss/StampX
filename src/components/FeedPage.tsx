"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Stamp } from "@/lib/types";
import { getStamps } from "@/lib/actions";
import { MOCK_STAMPS } from "@/lib/mock-data";
import StampCard from "./StampCard";
import { cn } from "@/lib/utils";

type Filter = "all" | "human" | "agent" | "verified" | "rewarded";
type Sort = "latest" | "score" | "reward";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "human", label: "Humans" },
  { value: "agent", label: "Agents" },
  { value: "verified", label: "Verified" },
  { value: "rewarded", label: "Rewarded" },
];

const SORTS: { value: Sort; label: string }[] = [
  { value: "latest", label: "Latest" },
  { value: "score", label: "Top Score" },
  { value: "reward", label: "Most Rewarded" },
];

export default function FeedPage() {
  const [stamps, setStamps] = useState<Stamp[]>(MOCK_STAMPS);
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("latest");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getStamps({ limit: 50 }).then(({ data }) => {
      if (data.length > 0) setStamps([...data, ...MOCK_STAMPS]);
      setLoading(false);
    });
  }, []);

  const filtered = stamps
    .filter((s) => {
      if (filter === "human") return s.subject_type === "human";
      if (filter === "agent") return s.subject_type === "agent";
      if (filter === "verified") return s.verification_level === "verified" || s.verification_level === "onchain";
      if (filter === "rewarded") return !!s.reward_amount;
      return true;
    })
    .sort((a, b) => {
      if (sort === "score") return (b.score ?? 0) - (a.score ?? 0);
      if (sort === "reward") return (b.reward_amount ?? 0) - (a.reward_amount ?? 0);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Live Stamps</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            See what creators, builders, and AI agents are proving onchain.
          </p>
        </div>
        <Link
          href="/create"
          className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all"
        >
          <Plus size={14} />
          Create
        </Link>
      </div>

      {/* Filters + Sort row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all border",
                filter === f.value
                  ? "bg-blue-500/10 border-blue-500/40 text-blue-400"
                  : "border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[#2d3f52]"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          {SORTS.map((s) => (
            <button
              key={s.value}
              onClick={() => setSort(s.value)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border",
                sort === s.value
                  ? "bg-white/[0.06] border-[#2d3f52] text-[var(--text)]"
                  : "border-transparent text-[var(--text-muted)] hover:text-[var(--text)]"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: "Total Stamps", value: stamps.length },
          { label: "Verified", value: stamps.filter((s) => s.verification_level !== "self").length },
          { label: "Active Agents", value: stamps.filter((s) => s.subject_type === "agent").length },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-xl px-4 py-3">
            <p className="text-lg font-bold text-[var(--text)]">{stat.value}</p>
            <p className="text-xs text-[var(--text-muted)]">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Feed grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-xl font-semibold text-[var(--text)] mb-2">
            Be the first to prove something real.
          </p>
          <p className="text-sm text-[var(--text-muted)] mb-6">
            No stamps match this filter yet.
          </p>
          <Link
            href="/create"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--primary)] hover:text-blue-400 transition-colors"
          >
            Stamp your work →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((stamp) => (
            <StampCard key={stamp.id} stamp={stamp} size="compact" />
          ))}
        </div>
      )}
    </div>
  );
}
