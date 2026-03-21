"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bot, Loader2, Zap } from "lucide-react";
import { createAgent } from "@/lib/actions";

const PLATFORMS = [
  "Virtuals",
  "Custom",
  "Base",
  "Coinbase CDP",
  "Gaia",
  "Other",
];

export default function AddAgentForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [indexing, setIndexing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    wallet: "",
    platform: "Custom",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) return setError("Agent name is required.");
    if (!form.wallet.trim()) return setError("Wallet address is required.");
    if (!/^0x[a-fA-F0-9]{40}$/.test(form.wallet.trim())) {
      return setError("Invalid wallet address format.");
    }

    setLoading(true);
    const { data: agent, error: createErr } = await createAgent({
      name: form.name.trim(),
      wallet: form.wallet.trim().toLowerCase(),
      platform: form.platform || undefined,
      description: form.description.trim() || undefined,
    });

    if (createErr || !agent) {
      setError(createErr || "Failed to register agent.");
      setLoading(false);
      return;
    }

    // Trigger first index run
    setIndexing(true);
    try {
      await fetch("/api/index-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId: agent.id }),
      });
    } catch {
      // Non-fatal — agent is registered, indexing can retry
    }

    router.push(`/agent/${agent.id}`);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(139,92,246,0.15)" }}
        >
          <Bot size={18} className="text-purple-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[var(--text)]">Register Agent</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Add an AI agent to auto-index its Base activity
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-[var(--text)] mb-2">
            Agent Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. TradePilot, ScoutAgent"
            className="w-full rounded-xl px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none transition-all"
            style={{
              background: "rgba(17,23,32,0.8)",
              border: "1px solid var(--border)",
            }}
          />
        </div>

        {/* Wallet */}
        <div>
          <label className="block text-sm font-semibold text-[var(--text)] mb-2">
            Base Wallet Address
          </label>
          <input
            type="text"
            value={form.wallet}
            onChange={(e) => setForm({ ...form, wallet: e.target.value })}
            placeholder="0x..."
            className="w-full rounded-xl px-4 py-3 text-sm font-mono text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none transition-all"
            style={{
              background: "rgba(17,23,32,0.8)",
              border: "1px solid var(--border)",
            }}
          />
          <p className="text-xs text-[var(--text-muted)] mt-1.5">
            Transactions from this wallet on Base will be auto-indexed.
          </p>
        </div>

        {/* Platform */}
        <div>
          <label className="block text-sm font-semibold text-[var(--text)] mb-2">
            Platform
          </label>
          <select
            value={form.platform}
            onChange={(e) => setForm({ ...form, platform: e.target.value })}
            className="w-full rounded-xl px-4 py-3 text-sm text-[var(--text)] outline-none transition-all appearance-none cursor-pointer"
            style={{
              background: "rgba(17,23,32,0.8)",
              border: "1px solid var(--border)",
            }}
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-[var(--text)] mb-2">
            Description{" "}
            <span className="text-[var(--text-muted)] font-normal">(optional)</span>
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="What does this agent do?"
            rows={3}
            className="w-full rounded-xl px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none resize-none transition-all"
            style={{
              background: "rgba(17,23,32,0.8)",
              border: "1px solid var(--border)",
            }}
          />
        </div>

        {/* Error */}
        {error && (
          <div
            className="rounded-xl px-4 py-3 text-sm text-red-400"
            style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
            }}
          >
            {error}
          </div>
        )}

        {/* Info */}
        <div
          className="rounded-xl px-4 py-3 flex items-start gap-2.5"
          style={{
            background: "rgba(139,92,246,0.05)",
            border: "1px solid rgba(139,92,246,0.15)",
          }}
        >
          <Zap size={14} className="text-purple-400 mt-0.5 shrink-0" />
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            After registration, StampX will immediately run the first index of this wallet's
            Base transactions. Subsequent indexing happens every 24h automatically.
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || indexing}
          className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all text-sm"
        >
          {loading || indexing ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              {indexing ? "Running first index..." : "Registering..."}
            </>
          ) : (
            <>
              <Bot size={14} />
              Register & Start Indexing
            </>
          )}
        </button>
      </form>
    </div>
  );
}
