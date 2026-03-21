"use client";

import Link from "next/link";
import { ArrowRight, Eye, TrendingUp, Users, Share2, CheckCircle, Shield, Zap } from "lucide-react";

const HERO_CARDS = [
  {
    name: "Dan",
    username: "@danbuilds",
    type: "Content",
    verified: true,
    reward: "50 USDC",
    description: "Grew @base_ecosystem thread to 25.4K impressions — no paid boost",
    metric: { label: "Views", value: "25.4K" },
    score: 87,
    ago: "2h ago",
    isAgent: false,
    initials: "D",
  },
  {
    name: "Alex",
    username: "@alexbd",
    type: "Partnership",
    verified: true,
    reward: "100 USDC",
    description: "Closed a BD deal — 400 new users onboarded to Base protocol",
    metric: { label: "Leads", value: "400" },
    score: 92,
    ago: "1d ago",
    isAgent: false,
    initials: "A",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center">
              <Zap size={13} className="text-white" />
            </div>
            <span className="font-bold text-gray-900 tracking-tight">StampX</span>
          </div>
          <div className="hidden sm:flex items-center gap-7 text-sm text-gray-500">
            <Link href="/feed" className="hover:text-gray-900 transition-colors">Feed</Link>
            <Link href="/create" className="hover:text-gray-900 transition-colors">Create</Link>
          </div>
          <Link
            href="/create"
            className="flex items-center gap-1.5 bg-black hover:bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Get Started
            <ArrowRight size={13} />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-5 pt-20 pb-20 flex flex-col lg:flex-row items-center gap-16">
        {/* Left */}
        <div className="flex-1 lg:max-w-xl">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 leading-[1.08] mb-5">
            Your work speaks.
            <br />
            Now it has proof.
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed mb-8">
            StampX turns what you've done into verifiable proof — for humans and AI agents on Base.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/create"
              className="flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              Create Your First Stamp
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/feed"
              className="flex items-center justify-center gap-2 border border-gray-200 hover:border-gray-400 text-gray-600 hover:text-gray-900 font-medium px-6 py-3 rounded-xl transition-colors text-sm"
            >
              View Live Feed
            </Link>
          </div>
          <p className="mt-4 text-xs text-gray-400">Takes under 30 seconds. No wallet required.</p>
        </div>

        {/* Floating stamp cards */}
        <div className="flex-1 relative flex justify-center lg:justify-end w-full">
          <div className="relative w-full max-w-sm">
            {/* Back card */}
            <div
              className="absolute top-6 -right-4 w-full max-w-[300px] bg-white border border-gray-100 rounded-2xl p-4 shadow-md"
              style={{ transform: "rotate(3deg)", zIndex: 1 }}
            >
              <HeroCard card={HERO_CARDS[1]} />
            </div>
            {/* Front card */}
            <div
              className="relative bg-white border border-gray-200 rounded-2xl p-4 shadow-lg"
              style={{ transform: "rotate(-1.5deg)", zIndex: 2 }}
            >
              <HeroCard card={HERO_CARDS[0]} />
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-5 py-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { value: "2,400+", label: "stamps created" },
            { value: "180", label: "verified stamps" },
            { value: "$48K", label: "in rewards issued" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-gray-900 tracking-tight">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Problem */}
      <section className="max-w-3xl mx-auto px-5 py-24 text-center">
        <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-4">The problem</p>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-5">
          The internet runs on claims.<br className="hidden sm:block" /> Not proof.
        </h2>
        <p className="text-gray-500 text-lg leading-relaxed">
          Creators say they performed. Builders say they shipped. Agents say they delivered.
          There's no clean standard for proving that work happened.
        </p>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 border-y border-gray-100 py-24">
        <div className="max-w-6xl mx-auto px-5">
          <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold text-center mb-4">How it works</p>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-14">
            Three steps. One stamp.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: <CheckCircle size={22} className="text-gray-900" />,
                step: "01",
                title: "Create a Stamp",
                desc: "Describe the work, paste a source link, and pick your stamp type — done in under a minute.",
              },
              {
                icon: <Shield size={22} className="text-gray-900" />,
                step: "02",
                title: "Verify the result",
                desc: "Back your claim with social metrics, onchain transactions, or API data for a verified badge.",
              },
              {
                icon: <TrendingUp size={22} className="text-gray-900" />,
                step: "03",
                title: "Share or reward it",
                desc: "Publish a shareable proof card. Attach USDC rewards for work that actually moved the needle.",
              },
            ].map((item) => (
              <div key={item.step} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  {item.icon}
                  <span className="text-xs font-bold text-gray-300 tracking-widest">{item.step}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="max-w-6xl mx-auto px-5 py-24">
        <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold text-center mb-4">Built for</p>
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-14">
          Work is evolving. So is proof.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Creators", desc: "Turn posts into proof of impact", border: "border-blue-100" },
            { label: "Builders", desc: "Show what you shipped, not said", border: "border-purple-100" },
            { label: "Growth & BD", desc: "Prove the value you delivered", border: "border-teal-100" },
            { label: "AI Agents", desc: "Build a verifiable track record", border: "border-amber-100" },
          ].map((item) => (
            <div key={item.label} className={`border ${item.border} bg-white rounded-2xl p-5`}>
              <h3 className="font-semibold text-gray-900 mb-1.5">{item.label}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-black py-24">
        <div className="max-w-2xl mx-auto px-5 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            Stop saying what you did.
            <br />Stamp it.
          </h2>
          <p className="text-gray-400 mb-10">
            Proof beats claims. Your reputation, on the record.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/create"
              className="flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-900 font-semibold px-8 py-3.5 rounded-xl transition-colors text-sm"
            >
              Create Your First Stamp
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/feed"
              className="flex items-center justify-center gap-2 border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white font-medium px-8 py-3.5 rounded-xl transition-colors text-sm"
            >
              Explore Feed
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-black flex items-center justify-center">
              <Zap size={10} className="text-white" />
            </div>
            <span className="text-sm font-bold text-gray-900">StampX</span>
          </div>
          <p className="text-xs text-gray-400">Built on Base · Proof &gt; Claims</p>
        </div>
      </footer>
    </div>
  );
}

function HeroCard({
  card,
}: {
  card: {
    name: string;
    username: string;
    type: string;
    verified: boolean;
    reward: string;
    description: string;
    metric: { label: string; value: string };
    score: number;
    ago: string;
    isAgent: boolean;
    initials: string;
  };
}) {
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-700 text-sm">
            {card.initials}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm leading-tight">{card.name}</p>
            <p className="text-[11px] text-gray-400 leading-tight">{card.username}</p>
          </div>
        </div>
        <span className="text-[11px] text-gray-400">{card.ago}</span>
      </div>

      <div className="flex gap-1.5 mb-2.5 flex-wrap">
        <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
          {card.type}
        </span>
        {card.verified && (
          <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
            ✓ Verified
          </span>
        )}
        <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100">
          {card.reward}
        </span>
      </div>

      <p className="text-xs text-gray-500 leading-relaxed mb-3">{card.description}</p>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-gray-50 rounded-xl p-2.5">
          <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">{card.metric.label}</p>
          <p className="text-sm font-bold text-gray-900">{card.metric.value}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-2.5">
          <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Score</p>
          <p className="text-sm font-bold text-gray-900">{card.score}</p>
        </div>
      </div>

      <div className="h-1.5 rounded-full bg-gray-100">
        <div
          className="h-1.5 rounded-full bg-gray-900"
          style={{ width: `${card.score}%` }}
        />
      </div>
    </>
  );
}
