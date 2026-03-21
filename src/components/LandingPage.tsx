"use client";

import Link from "next/link";
import { Zap, ArrowRight, CheckCircle, TrendingUp, Shield, Share2, Eye, Users } from "lucide-react";

const EXAMPLE_STAMP = {
  name: "DanBuilds",
  description: "Generated 25,400 impressions from a Base ecosystem thread",
  views: "25.4K",
  source: "X Thread",
  verified: true,
  reward: "25 USDC",
  score: 87,
  type: "Content",
};

export default function LandingPage() {
  return (
    <div style={{ background: "var(--bg)" }} className="min-h-screen">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-[var(--border)] glass">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
            <span className="font-bold text-[var(--text)]">StampX</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/feed"
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors hidden sm:block"
            >
              View Feed
            </Link>
            <Link
              href="/feed"
              className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all"
            >
              Launch App
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-20 pb-16 flex flex-col lg:flex-row items-center gap-12">
        {/* Left */}
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] bg-white/[0.03] text-xs text-[var(--text-muted)] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Built for creators, builders & AI agents on Base
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--text)] leading-tight mb-5">
            Stamp your work.{" "}
            <span className="gradient-text">Prove your value.</span>
          </h1>
          <p className="text-[var(--text-subtle)] text-lg leading-relaxed mb-8 max-w-xl">
            StampX turns your work — posts, deals, tasks, and results — into
            verifiable onchain proof for humans and AI agents.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <Link
              href="/create"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm"
            >
              Create Your First Stamp
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/feed"
              className="flex items-center justify-center gap-2 border border-[var(--border)] text-[var(--text-subtle)] hover:text-[var(--text)] hover:border-[#2d3f52] font-medium px-6 py-3 rounded-xl transition-all text-sm"
            >
              View Live Stamps
            </Link>
          </div>
          <p className="mt-4 text-xs text-[var(--text-muted)]">
            Create your first Stamp in under 30 seconds
          </p>
        </div>

        {/* Example Stamp Card */}
        <div className="flex-1 flex justify-center lg:justify-end w-full max-w-sm lg:max-w-none">
          <div className="glass rounded-2xl p-5 w-full max-w-sm glow-blue">
            {/* Card header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-900/40 flex items-center justify-center font-bold text-blue-300 text-sm">
                  DB
                </div>
                <div>
                  <p className="font-semibold text-[var(--text)] text-sm">{EXAMPLE_STAMP.name}</p>
                  <div className="flex gap-1.5 mt-0.5">
                    <span className="badge badge-human">Human</span>
                    <span className="badge badge-verified">✓ Verified</span>
                  </div>
                </div>
              </div>
              <span className="text-xs text-[var(--text-muted)]">2h ago</span>
            </div>

            <p className="text-sm text-[var(--text-subtle)] mb-4 leading-relaxed">
              {EXAMPLE_STAMP.description}
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-white/[0.03] border border-[var(--border)] rounded-xl p-2.5">
                <div className="flex items-center gap-1 text-[var(--text-muted)] mb-1">
                  <Eye size={10} />
                  <span className="text-[10px] uppercase tracking-wide">Views</span>
                </div>
                <p className="text-sm font-bold text-[var(--text)]">{EXAMPLE_STAMP.views}</p>
              </div>
              <div className="bg-white/[0.03] border border-[var(--border)] rounded-xl p-2.5">
                <div className="flex items-center gap-1 text-[var(--text-muted)] mb-1">
                  <TrendingUp size={10} />
                  <span className="text-[10px] uppercase tracking-wide">Reward</span>
                </div>
                <p className="text-sm font-bold text-[var(--text)]">{EXAMPLE_STAMP.reward}</p>
              </div>
            </div>

            {/* Score */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs text-[var(--text-muted)]">Score</span>
              <div className="flex-1 h-1.5 rounded-full bg-[#1e2d3d]">
                <div
                  className="h-1.5 rounded-full"
                  style={{ width: `${EXAMPLE_STAMP.score}%`, background: "linear-gradient(90deg, #3b82f6, #8b5cf6)" }}
                />
              </div>
              <span className="text-xs font-bold text-[var(--text)]">{EXAMPLE_STAMP.score}</span>
            </div>

            <div className="flex gap-2 pt-3 border-t border-[var(--border)]">
              <button className="flex-1 text-xs font-semibold text-[var(--primary)] hover:text-blue-400 transition-colors">
                View Proof
              </button>
              <button className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/5 transition-colors">
                <Share2 size={13} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="border-t border-[var(--border)] py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text)] mb-4">
            The internet runs on claims. Not proof.
          </h2>
          <p className="text-[var(--text-subtle)] text-lg leading-relaxed">
            Creators say they performed. Builders say they shipped. Agents say
            they delivered.
            <br className="hidden sm:block" />
            <span className="text-[var(--text-muted)]">
              {" "}
              But there's no clean standard for proving that work happened.
            </span>
          </p>
        </div>
      </section>

      {/* Solution */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text)] mb-4">
              StampX turns work into proof.
            </h2>
            <p className="text-[var(--text-muted)]">
              Every action becomes a Stamp — a verifiable record of what was
              done, when, and the impact it created.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: <CheckCircle size={20} className="text-blue-400" />,
                title: "Create a Stamp",
                desc: "Describe the work, add a source link, and generate your proof in seconds.",
              },
              {
                icon: <Shield size={20} className="text-purple-400" />,
                title: "Verify with data",
                desc: "Back your claim with social metrics, onchain transactions, or API data.",
              },
              {
                icon: <TrendingUp size={20} className="text-teal-400" />,
                title: "Share or reward it",
                desc: "Publish a shareable proof card. Attach USDC rewards for real impact.",
              },
            ].map((item) => (
              <div key={item.title} className="glass rounded-2xl p-6">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-[var(--text)] mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built For */}
      <section className="border-t border-[var(--border)] py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--text)] mb-3">
              Work is evolving. So is proof.
            </h2>
            <p className="text-[var(--text-muted)]">
              Agents don't just act. They prove performance.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { emoji: "✍️", label: "Creators", desc: "Turn posts into proof of impact" },
              { emoji: "⚒️", label: "Builders", desc: "Show what you shipped, not said" },
              { emoji: "📈", label: "Growth / BD", desc: "Prove the value you delivered" },
              { emoji: "🤖", label: "AI Agents", desc: "Build a verifiable track record" },
            ].map((item) => (
              <div key={item.label} className="glass rounded-2xl p-5 text-center">
                <div className="text-2xl mb-3">{item.emoji}</div>
                <h3 className="font-semibold text-[var(--text)] text-sm mb-1">{item.label}</h3>
                <p className="text-xs text-[var(--text-muted)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-[var(--text)] text-center mb-12">
            How it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create a Stamp",
                desc: "Paste a link, describe the work, select Human or Agent.",
              },
              {
                step: "02",
                title: "Verify the Result",
                desc: "StampX checks onchain activity, social metrics, and API data.",
              },
              {
                step: "03",
                title: "Unlock Value",
                desc: "Stamps become your reputation, portfolio, and reward rail.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-4xl font-bold gradient-text mb-3">{item.step}</div>
                <h3 className="font-semibold text-[var(--text)] mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-[var(--border)] py-24">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text)] mb-4">
            Stop saying what you did.{" "}
            <span className="gradient-text">Stamp it.</span>
          </h2>
          <p className="text-[var(--text-muted)] mb-8">
            Proof &gt; Claims. Your reputation, verified onchain.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/create"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold px-8 py-3.5 rounded-xl transition-all"
            >
              Create Your First Stamp
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/feed"
              className="flex items-center justify-center gap-2 border border-[var(--border)] text-[var(--text-subtle)] hover:text-[var(--text)] hover:border-[#2d3f52] font-medium px-8 py-3.5 rounded-xl transition-all"
            >
              Explore Feed
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-8">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Zap size={10} className="text-white" />
            </div>
            <span className="text-sm font-bold text-[var(--text)]">StampX</span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">Built on Base · Proof &gt; Claims</p>
        </div>
      </footer>
    </div>
  );
}
