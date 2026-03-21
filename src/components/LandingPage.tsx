"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle, Shield, TrendingUp, Zap, Bot, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

function NavThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const stored = localStorage.getItem("stampx-theme") as "dark" | "light" | null;
    const current = document.documentElement.getAttribute("data-theme") as "dark" | "light";
    setTheme(stored || current || "dark");
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("stampx-theme", next);
  };

  return (
    <button
      onClick={toggle}
      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
      title="Toggle theme"
    >
      {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}

const HERO_STAMPS = [
  {
    name: "DanBuilds",
    username: "@danbuilds",
    type: "Content",
    badge: "Verified",
    badgeColor: "text-emerald-400",
    badgeBg: "rgba(16,185,129,0.12)",
    badgeBorder: "rgba(16,185,129,0.25)",
    reward: "50 USDC",
    description: "Grew @base_ecosystem thread to 25.4K impressions — no paid boost",
    metric: { label: "Views", value: "25.4K" },
    score: 87,
    ago: "2h ago",
    isAgent: false,
    initials: "D",
    avatarBg: "rgba(59,130,246,0.15)",
    avatarColor: "#93c5fd",
    cardBg: "rgba(17, 23, 32, 0.9)",
    cardBorder: "rgba(59,130,246,0.18)",
  },
  {
    name: "TradePilot",
    username: "Agent · Virtuals",
    type: "Trade",
    badge: "Indexed",
    badgeColor: "text-teal-400",
    badgeBg: "rgba(20,184,166,0.12)",
    badgeBorder: "rgba(20,184,166,0.25)",
    reward: null,
    description: "Executed 14 transactions on Base · Volume: $3,420",
    metric: { label: "Volume", value: "$3.4K" },
    score: 62,
    ago: "5h ago",
    isAgent: true,
    initials: "⬡",
    avatarBg: "rgba(20,184,166,0.12)",
    avatarColor: "#2dd4bf",
    cardBg: "rgba(14, 26, 26, 0.9)",
    cardBorder: "rgba(20,184,166,0.2)",
  },
];

function HeroStampCard({ card }: { card: (typeof HERO_STAMPS)[0] }) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: card.cardBg,
        border: `1px solid ${card.cardBorder}`,
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm"
            style={{ background: card.avatarBg, color: card.avatarColor }}
          >
            {card.initials}
          </div>
          <div>
            <p className="font-semibold text-[var(--text)] text-sm leading-tight">{card.name}</p>
            <p className="text-[11px] text-[var(--text-muted)] leading-tight">{card.username}</p>
          </div>
        </div>
        <span className="text-[11px] text-[var(--text-muted)]">{card.ago}</span>
      </div>

      <div className="flex gap-1.5 mb-2.5 flex-wrap">
        <span
          className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full"
          style={{
            background: "rgba(59,130,246,0.1)",
            color: "#60a5fa",
            border: "1px solid rgba(59,130,246,0.2)",
          }}
        >
          {card.type}
        </span>
        <span
          className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full"
          style={{
            background: card.badgeBg,
            color: card.badgeColor,
            border: `1px solid ${card.badgeBorder}`,
          }}
        >
          {card.badge}
        </span>
        {card.reward && (
          <span
            className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(245,158,11,0.1)",
              color: "#fbbf24",
              border: "1px solid rgba(245,158,11,0.2)",
            }}
          >
            {card.reward}
          </span>
        )}
      </div>

      <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-3">{card.description}</p>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div
          className="rounded-xl p-2.5"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide mb-0.5">
            {card.metric.label}
          </p>
          <p className="text-sm font-bold text-[var(--text)]">{card.metric.value}</p>
        </div>
        <div
          className="rounded-xl p-2.5"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide mb-0.5">Score</p>
          <p className="text-sm font-bold text-[var(--text)]">{card.score}</p>
        </div>
      </div>

      <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div
          className="h-1.5 rounded-full"
          style={{
            width: `${card.score}%`,
            background: card.isAgent
              ? "linear-gradient(90deg, #0d9488, #2dd4bf)"
              : "linear-gradient(90deg, #3b82f6, #8b5cf6)",
          }}
        />
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>
      {/* Nav */}
      <nav
        className="sticky top-0 z-50"
        style={{
          background: "var(--glass-bg)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Zap size={13} className="text-white" />
            </div>
            <span className="font-bold text-[var(--text)] tracking-tight">StampX</span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm">
            <Link href="/feed" className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
              Feed
            </Link>
            <Link href="/agents" className="flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
              <Bot size={13} />
              Agents
            </Link>
            <Link href="/create" className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
              Create
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <NavThemeToggle />
            <Link
              href="/create"
              className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all"
            >
              Get Started
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-5 pt-20 pb-20 flex flex-col lg:flex-row items-center gap-16">
        {/* Left */}
        <div className="flex-1 lg:max-w-xl">
          {/* Tag */}
          <div
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full mb-6"
            style={{
              background: "rgba(139,92,246,0.1)",
              border: "1px solid rgba(139,92,246,0.2)",
              color: "#a78bfa",
            }}
          >
            <Bot size={11} />
            Agent auto-indexing live on Base
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.08] mb-5">
            <span className="text-[var(--text)]">Your work is</span>
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              already happening.
            </span>
          </h1>
          <p className="text-lg leading-relaxed mb-8" style={{ color: "var(--text-subtle)" }}>
            StampX finds your work and turns it into proof. Track, claim, and verify
            what humans build and agents execute on Base.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/create"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm"
            >
              Create Your First Stamp
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/agents"
              className="flex items-center justify-center gap-2 font-medium px-6 py-3 rounded-xl transition-colors text-sm"
              style={{
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
              }}
            >
              <Bot size={14} />
              Register an Agent
            </Link>
          </div>
          <p className="mt-4 text-xs" style={{ color: "var(--text-muted)" }}>
            Takes under 30 seconds. No wallet required for humans.
          </p>
        </div>

        {/* Hero cards */}
        <div className="flex-1 relative flex justify-center lg:justify-end w-full">
          <div className="relative w-full max-w-sm">
            <div
              className="absolute top-6 -right-4 w-full max-w-[300px]"
              style={{ transform: "rotate(3deg)", zIndex: 1 }}
            >
              <HeroStampCard card={HERO_STAMPS[1]} />
            </div>
            <div
              className="relative"
              style={{ transform: "rotate(-1.5deg)", zIndex: 2 }}
            >
              <HeroStampCard card={HERO_STAMPS[0]} />
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-6xl mx-auto px-5 py-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { value: "2,400+", label: "stamps created" },
            { value: "180", label: "verified stamps" },
            { value: "$48K", label: "in rewards issued" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-[var(--text)] tracking-tight">{s.value}</p>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Problem */}
      <section className="max-w-3xl mx-auto px-5 py-24 text-center">
        <p className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: "var(--text-muted)" }}>
          The problem
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text)] leading-tight mb-5">
          The internet runs on claims.
          <br className="hidden sm:block" /> Not proof.
        </h2>
        <p className="text-lg leading-relaxed" style={{ color: "var(--text-subtle)" }}>
          Creators say they performed. Builders say they shipped. Agents say they delivered.
          There's no clean standard for proving that work actually happened.
        </p>
      </section>

      {/* Two lanes */}
      <section
        className="py-24"
        style={{
          background: "rgba(255,255,255,0.015)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="max-w-6xl mx-auto px-5">
          <p className="text-xs uppercase tracking-widest font-semibold text-center mb-4" style={{ color: "var(--text-muted)" }}>
            Two lanes
          </p>
          <h2 className="text-3xl font-bold text-[var(--text)] text-center mb-14">
            Built for humans. Wired for agents.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Human lane */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: "rgba(59,130,246,0.04)",
                border: "1px solid rgba(59,130,246,0.15)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold"
                  style={{ background: "rgba(59,130,246,0.15)", color: "#60a5fa" }}
                >
                  👤
                </div>
                <div>
                  <p className="font-semibold text-[var(--text)]">Humans</p>
                  <span
                    className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded"
                    style={{ color: "#60a5fa", background: "rgba(59,130,246,0.1)" }}
                  >
                    Manual
                  </span>
                </div>
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-subtle)" }}>
                Curated, high-intent stamps. You decide what to publish — your content,
                your partnerships, your builds. Attach rewards, link sources, tell the story.
              </p>
              <ul className="space-y-2">
                {["Create proof in 30 seconds", "Attach USDC rewards", "Link social or onchain sources"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
                    <CheckCircle size={13} className="text-blue-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Agent lane */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: "rgba(139,92,246,0.04)",
                border: "1px solid rgba(139,92,246,0.15)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(139,92,246,0.15)", color: "#a78bfa" }}
                >
                  <Bot size={16} />
                </div>
                <div>
                  <p className="font-semibold text-[var(--text)]">AI Agents</p>
                  <span
                    className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded"
                    style={{ color: "#2dd4bf", background: "rgba(20,184,166,0.1)" }}
                  >
                    Auto-Indexed
                  </span>
                </div>
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-subtle)" }}>
                Register your agent's wallet. StampX monitors Base transactions every 24h
                and auto-generates indexed stamps — no manual input needed.
              </p>
              <ul className="space-y-2">
                {["Register wallet once", "Daily auto-indexing from Base", "Verifiable onchain activity"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
                    <Zap size={13} className="text-purple-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-5">
          <p className="text-xs uppercase tracking-widest font-semibold text-center mb-4" style={{ color: "var(--text-muted)" }}>
            How it works
          </p>
          <h2 className="text-3xl font-bold text-[var(--text)] text-center mb-14">
            Three steps. One stamp.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: <CheckCircle size={20} className="text-blue-400" />,
                step: "01",
                title: "Create or Register",
                desc: "Humans create stamps manually. Agents register a wallet and get auto-indexed.",
              },
              {
                icon: <Shield size={20} className="text-purple-400" />,
                step: "02",
                title: "Prove the result",
                desc: "Back your claim with metrics, onchain tx, or API data for a verified badge.",
              },
              {
                icon: <TrendingUp size={20} className="text-emerald-400" />,
                step: "03",
                title: "Share or reward it",
                desc: "Publish a shareable proof card. Attach USDC rewards for work that moved the needle.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-2xl p-6"
                style={{
                  background: "rgba(17,23,32,0.6)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="flex items-center justify-between mb-5">
                  {item.icon}
                  <span className="text-xs font-bold tracking-widest" style={{ color: "var(--text-muted)" }}>
                    {item.step}
                  </span>
                </div>
                <h3 className="font-semibold text-[var(--text)] mb-2">{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-subtle)" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section
        className="py-24"
        style={{
          background: "rgba(255,255,255,0.015)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="max-w-6xl mx-auto px-5">
          <p className="text-xs uppercase tracking-widest font-semibold text-center mb-4" style={{ color: "var(--text-muted)" }}>
            Built for
          </p>
          <h2 className="text-3xl font-bold text-[var(--text)] text-center mb-14">
            Work is evolving. So is proof.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Creators", desc: "Turn posts into proof of impact", color: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.2)" },
              { label: "Builders", desc: "Show what you shipped, not said", color: "rgba(139,92,246,0.12)", border: "rgba(139,92,246,0.2)" },
              { label: "Growth & BD", desc: "Prove the value you delivered", color: "rgba(20,184,166,0.12)", border: "rgba(20,184,166,0.2)" },
              { label: "AI Agents", desc: "Build a verifiable track record", color: "rgba(245,158,11,0.10)", border: "rgba(245,158,11,0.2)" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl p-5"
                style={{ background: item.color, border: `1px solid ${item.border}` }}
              >
                <h3 className="font-semibold text-[var(--text)] mb-1.5">{item.label}</h3>
                <p className="text-sm" style={{ color: "var(--text-subtle)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="py-24"
        style={{
          background: "linear-gradient(135deg, rgba(59,130,246,0.05), rgba(139,92,246,0.05))",
        }}
      >
        <div className="max-w-2xl mx-auto px-5 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text)] mb-4 leading-tight">
            Stop saying what you did.
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Stamp it.
            </span>
          </h2>
          <p className="mb-10 text-lg" style={{ color: "var(--text-muted)" }}>
            Proof beats claims. Your reputation, on the record.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/create"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold px-8 py-3.5 rounded-xl transition-all text-sm"
            >
              Create Your First Stamp
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/feed"
              className="flex items-center justify-center gap-2 font-medium px-8 py-3.5 rounded-xl transition-colors text-sm"
              style={{
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
              }}
            >
              Explore Feed
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border)" }} className="py-8">
        <div className="max-w-6xl mx-auto px-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Zap size={10} className="text-white" />
            </div>
            <span className="text-sm font-bold text-[var(--text)]">StampX</span>
          </div>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Built on Base · Proof &gt; Claims</p>
        </div>
      </footer>
    </div>
  );
}
