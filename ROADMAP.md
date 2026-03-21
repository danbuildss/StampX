# StampX — Product Roadmap

## One-liner
StampX is the proof layer for work — where humans and AI agents generate, verify, and get paid for real outcomes onchain.

## Core Thesis
The internet runs on claims. StampX converts:
- claims → proof
- proof → reputation
- reputation → money

---

## Core Entities

### Users
- Creators
- Builders
- BD / Growth
- DAO contributors

### AI Agents
- Trading agents
- Content agents
- BD agents
- Automation agents (Virtuals ecosystem)

### Proofs ("Stamps") — The Core Primitive
Each Stamp represents: work done, outcome achieved, verification level, optional reward.

**Stamp Schema:**
```
Stamp {
  id
  creator (wallet)
  subject (human | agent)
  type (content | growth | trade | task)
  description
  source_link (tweet / tx / github)
  metrics {
    views
    clicks
    volume
    leads
  }
  verification_level (self | api | onchain)
  score (0–100)         // from Spawn later
  reward {
    token
    amount
    condition
  }
  timestamp
}
```

---

## Product Architecture

| Layer | Name | Description |
|-------|------|-------------|
| 1 | Proof Creation | Manual (MVP) → Auto via agents (later) |
| 2 | Verification | Self-reported → API verified → Onchain verified |
| 3 | Reputation | Stamp history, performance scoring, agent trust (Spawn) |
| 4 | Reward Rails | USDC/ETH payouts, conditional rewards, campaign bounties (DropIN) |
| 5 | Distribution | Shareable proof cards, Farcaster Frames, X embeds, Telegram bot |

---

## AI Agent Integration
Agents can: generate stamps, verify stamps, trigger payments, rank other agents.

---

## Key Use Cases

1. **Creator** — "I made a thread that got 50k views" → Stamp created → Verified via API → Reward unlocked
2. **BD** — "I brought $100k TVL to protocol" → Onchain verification → Proof stored → Used as portfolio
3. **AI Agent** — "Executed 20 profitable trades" → Auto-stamped → Performance tracked → Ranked
4. **Protocol** — "We only reward verified contributors" → Filter by stamps → Pay automatically

---

## Monetization
- Stamp mint fee ($0.5–$2)
- Pro accounts ($10–$50/month)
- Protocol dashboards ($99–$500/month)
- API for agents/tools
- Featured profiles

---

## Tech Stack
- **Frontend:** Next.js + Tailwind
- **Backend:** Supabase / Firebase
- **Wallet:** Base Smart Wallet / Privy
- **Chain:** Base
- **Storage:** JSON + IPFS later
- **Bot:** Telegram
- **AI:** Claude / OpenAI for parsing proofs

> **ERC-8183:** Skip for V1, integrate in Phase 5 for agent identity + machine-readable stamps.

---

## Roadmap

### Phase 0 — 48–72 Hours (MVP)
**Goal:** Something people can USE immediately
- [ ] Create Stamp (form)
- [ ] Generate Proof Card (clean UI)
- [ ] Shareable link
- [ ] Tag: human or agent

**Output:** "Dan generated 20k views — Stamp #001"

---

### Phase 1 — Week 1
- [ ] Wallet connect (Base)
- [ ] Save stamps to user profile
- [ ] Basic feed (latest stamps)
- [ ] Telegram bot: `/stamp` → generate proof

---

### Phase 2 — Week 2–3
- [ ] Verification layer: Twitter/X metrics, onchain tx detection
- [ ] Stamp levels: Self / Verified
- [ ] Simple scoring

---

### Phase 3 — Week 3–4
- [ ] Attach USDC rewards
- [ ] Conditional reward unlock
- [ ] Protocol campaigns: "Reward top stamps"

---

### Phase 4 — Month 2
- [ ] Auto-stamp generation via AI agents
- [ ] Agent profiles
- [ ] Agent leaderboards

---

### Phase 5 — Month 2–3
- [ ] Spawn integration (trust scores)
- [ ] ERC-8183 integration
- [ ] API for external tools

---

## Product Feel
**NOT:** boring dashboard, dev tool
**YES:** Onchain achievements + proof flex

- Dark, clean, premium
- Share-worthy proof cards
- "Stamp your work. Prove your value. Get rewarded automatically."

## Critical Rule
Start with proof cards that look so good people WANT to share them. That's the distribution.

## Ecosystem Advantage
- **DropIN** → rewards
- **Spawn** → trust
- **Why Base** → distribution
- **StampX** = the glue
