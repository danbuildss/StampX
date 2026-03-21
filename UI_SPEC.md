# StampX — UI Specification

## Core Principle
> "Your UI will determine if StampX spreads or dies."

The product is NOT the backend. It's: **how good does the proof look when shared?**

---

## UI Direction

**Hybrid of:** Twitter Post + Stripe Receipt + Web3 Dashboard

NOT:
- boring admin panel
- complex DeFi UI

YES:
- clean
- card-based
- social + premium

---

## Design Style (Locked)

### Colors
- **Background:** `#0B0F14` (deep navy/black)
- **Primary:** electric blue / teal
- **Accent:** purple / neon green (highlights)

### Typography
- **Headings:** Inter / Satoshi
- **Numbers:** bold + large (critical)

### Effects
- Soft shadows
- Glow on important metrics
- Subtle animations
- Glassmorphism / slight blur on cards
- Subtle gradients

---

## Screens Breakdown

### 1. Home / Feed
Think: Twitter feed but cleaner

Sections:
- Trending Stamps
- Top Agents
- Top Builders

Layout: Bento / feed grid

---

### 2. Stamp Card — MOST IMPORTANT SCREEN (viral loop)

```
[ Avatar ]  DanBuilds
Generated 25,000 impressions for Base ecosystem
──────────────
📊 25K views
🔗 Source: X thread
✅ Verified
💰 Reward: $50 USDC
🏆 Score: 87

[ View Proof ]  [ Share ]
```

**Design rules:**
- Rounded cards (`rounded-2xl`)
- Glassmorphism / slight blur
- Subtle gradients
- Big numbers on metrics
- Must feel: collectible, shareable, clean

---

### 3. Profile Page — "Onchain Resume"

Sections:
- Total Stamps
- Total Value Generated
- Score (Spawn integration later)
- Stamp history

---

### 4. Agent Page

Same as profile but shows:
- Success rate
- Tasks completed
- Earnings generated
- Verified performance

---

### 5. Create Stamp Page — Keep Minimal

Fields:
- Description (text input)
- Source link (paste)
- Type: Human / Agent (toggle)
- Reward: optional USDC attach

---

## What Makes StampX UI Different

Most Web3 apps: data heavy, confusing, ugly.

StampX = **"Proof as a social asset"**

The test: *"I want to post this on X"* — if they don't think that, distribution is dead.

---

## Dribbble Search Prompts

- `web3 dashboard dark ui`
- `saas card ui dark minimal`
- `achievement card gamification ui`
- `crypto dashboard glassmorphism`
- `bento grid dashboard ui`

---

## Build Order

1. Pick 1 dashboard style + 1 card style
2. Design: Stamp Card (main) → Feed page
3. Ship UI fast → backend later
