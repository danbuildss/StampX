# StampX — Build Roadmap (Feature by Feature)

## Core Rule
> Ship something usable in 72 hours. Then layer complexity.

---

## PHASE 0 — FOUNDATION (Day 1–2)
**Goal:** Get something live people can interact with

### Features

**1. Landing Page (conversion first)**
- Hero + CTA
- Problem → Solution
- Example Stamp (fake data)
- "Create Stamp" button

> This is your distribution entry point

**2. Create Stamp (NO wallet yet)**
Form fields:
- Name (auto or manual)
- Description
- Link (tweet / tx / github)
- Type (Human / Agent)

**3. Generate Stamp Card (CORE FEATURE)**
Output:
- Clean card UI
- Metrics placeholder
- "Verified: Self"

> THIS is your product

**4. Shareable Link**
- `/stamp/{id}`
- Public view page

### Stack
- Next.js (v0.dev)
- Supabase (DB)
- No smart contract yet

**Output:** "I can create and share a proof"

---

## PHASE 1 — IDENTITY + FEED (Day 3–5)
**Goal:** Make it feel like a product, not a tool

### Features

**1. Wallet Connect (Base)**
- Use Privy or RainbowKit
- Store wallet as user ID

**2. User Profile Page**
- Total stamps
- List of stamps
- Basic stats

**3. Feed (VERY IMPORTANT)**
- Latest stamps
- Simple sorting (newest)

> This becomes your Product Hunt / Twitter feed

**4. Telegram Bot (optional but strong)**
- `/stamp` → returns link

**Output:** "People can see what others are doing" → network effect starts

---

## PHASE 2 — VERIFICATION (Week 2)
**Goal:** Turn fake → real

### Features

**1. Verification Levels**
- Self (default)
- Verified (API)
- Onchain (later)

**2. X (Twitter) Integration**
- Fetch: views, likes, engagement

**3. Onchain Detection (Basic)**
- Paste tx hash
- Show: value, chain, wallet

**4. Stamp Upgrade UI**
- "Verify this stamp" flow

**Output:** "This is not just claims anymore"

---

## PHASE 3 — REWARDS (Week 3)
**Goal:** Attach MONEY

### Features

**1. Add Reward to Stamp**
- Input USDC amount
- Condition (optional)

**2. Claim Flow**
- Button → simulate claim (no contract yet OR basic contract)

**3. Reward Badge UI**
- Shows on stamp card

> DropIN synergy starts here

**Output:** "Proof → Money" — now it's powerful

---

## PHASE 4 — AGENT LAYER (Week 4–5)
**Goal:** Differentiate completely

### Features

**1. Agent Profiles**
- Same as users but tagged "Agent"

**2. Auto Stamp (basic)**
- Input wallet / X account
- Auto-generate sample stamp

**3. Agent Leaderboard**
- Top performing agents

**4. Task → Proof Flow**
- "Agent completed task" → generate stamp automatically

**Output:** "Agents have track records" — this is your category edge

---

## PHASE 5 — TRUST + SCALE (Month 2)
**Goal:** Become infrastructure

### Features

**1. Spawn Integration**
- Trust score per stamp
- Risk flags

**2. Smart Contracts (add NOW)**
- Store stamp hash on Base
- Optional mint (NFT or attestation)

**3. ERC-8183 Integration**
- Agent identity
- Agent-to-agent reputation

**4. API**
- Let other apps use StampX

**Output:** "Other apps depend on you"

---

## Landing Page → App Funnel
```
Landing Page
    ↓
"Create Stamp" CTA
    ↓
Stamp Generator (no login friction)
    ↓
Share page
    ↓
Ask for wallet connect
```

> CRITICAL: Don't gate creation behind login

---

## App Routes
```
/                   → Landing
/create             → Create Stamp
/stamp/[id]         → Stamp page
/feed               → Feed
/profile/[wallet]   → Profile
/agent/[id]         → Agent page (Phase 4)
```

---

## UI Build Order
1. Stamp Card (most important)
2. Create page
3. Stamp view page
4. Feed
5. Profile

---

## What to IGNORE for Now
- Complex smart contracts
- Full AI agent automation
- Advanced analytics
- Perfect verification

---

## Day-by-Day Execution (Phase 0)
- **Day 1:** Landing page + Stamp card UI
- **Day 2:** Create flow + Shareable page
- **Day 3:** Deploy + Start posting stamps yourself

---

## Launch Strategy
Don't "announce" StampX. **Use it publicly.**

Example: *"Just stamped this — 20k views in 24h (link)"*

That becomes your growth loop.

---

## Timeline Summary
- **Week 1** → usable product
- **Week 3** → valuable product
- **Month 2** → infrastructure
