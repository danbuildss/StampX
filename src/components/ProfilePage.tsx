"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Share2, Plus, Copy, CheckCircle } from "lucide-react";
import { Stamp } from "@/lib/types";
import { getStampsByWallet } from "@/lib/actions";
import { MOCK_STAMPS } from "@/lib/mock-data";
import { cn, formatNumber } from "@/lib/utils";
import StampCard from "./StampCard";

type Tab = "all" | "verified" | "rewarded" | "agents";

const TABS: { value: Tab; label: string }[] = [
  { value: "all", label: "All Stamps" },
  { value: "verified", label: "Verified" },
  { value: "rewarded", label: "Rewarded" },
  { value: "agents", label: "Agents" },
];

// Demo profile for /profile/demo
const DEMO_PROFILE = {
  name: "Dan",
  username: "@danbuilds",
  bio: "Creator · Builder · BD — stamping work across Base, media, and agent systems",
  wallet: "0x1234...abcd",
};

export default function ProfilePage({ wallet }: { wallet: string }) {
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [tab, setTab] = useState<Tab>("all");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const isDemo = wallet === "demo";

  useEffect(() => {
    if (isDemo) {
      setStamps(MOCK_STAMPS.filter((s) => s.subject_type === "human").slice(0, 4));
      setLoading(false);
      return;
    }
    getStampsByWallet(wallet).then(({ data }) => {
      setStamps(data.length > 0 ? data : MOCK_STAMPS.slice(0, 3));
      setLoading(false);
    });
  }, [wallet, isDemo]);

  const filtered = stamps.filter((s) => {
    if (tab === "verified") return s.verification_level !== "self";
    if (tab === "rewarded") return !!s.reward_amount;
    if (tab === "agents") return s.subject_type === "agent";
    return true;
  });

  const totalViews = stamps.reduce((acc, s) => acc + (s.metrics_views || 0), 0);
  const totalRewards = stamps.reduce((acc, s) => acc + (s.reward_amount || 0), 0);
  const verifiedCount = stamps.filter((s) => s.verification_level !== "self").length;

  const displayName = isDemo ? DEMO_PROFILE.name : wallet.slice(0, 12) + "...";
  const displayUsername = isDemo ? DEMO_PROFILE.username : null;
  const displayBio = isDemo ? DEMO_PROFILE.bio : "StampX contributor";

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile header */}
      <div className="glass rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center font-bold text-xl text-white">
              {displayName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--text)]">{displayName}</h1>
              {displayUsername && (
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{displayUsername}</p>
              )}
              <p className="text-sm text-[var(--text-muted)] mt-1 max-w-sm">{displayBio}</p>
              {!isDemo && (
                <p className="text-xs text-[var(--text-muted)] mt-1 font-mono">{wallet}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[#2d3f52] transition-all text-sm"
            >
              {copied ? <CheckCircle size={13} className="text-green-400" /> : <Copy size={13} />}
              {copied ? "Copied" : "Share"}
            </button>
            <Link
              href="/create"
              className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all"
            >
              <Plus size={13} />
              New Stamp
            </Link>
          </div>
        </div>

        {/* Onchain Resume Stats */}
        <div>
          <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-3">
            Onchain Resume
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Stamps", value: stamps.length.toString() },
              {
                label: "Verified Rate",
                value: stamps.length > 0 ? `${Math.round((verifiedCount / stamps.length) * 100)}%` : "—",
              },
              { label: "Rewards", value: totalRewards > 0 ? `${totalRewards} USDC` : "—" },
              { label: "Total Reach", value: totalViews > 0 ? formatNumber(totalViews) : "—" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/[0.03] border border-[var(--border)] rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-[var(--text)]">{stat.value}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all border",
              tab === t.value
                ? "bg-blue-500/10 border-blue-500/40 text-blue-400"
                : "border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[#2d3f52]"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Stamps list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 glass rounded-2xl">
          <p className="text-[var(--text-muted)] mb-3">No stamps in this category yet.</p>
          <Link href="/create" className="text-sm text-[var(--primary)]">
            Create your first Stamp →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((stamp) => (
            <StampCard key={stamp.id} stamp={stamp} size="compact" />
          ))}
        </div>
      )}
    </div>
  );
}
