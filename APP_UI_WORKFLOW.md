# StampX — App UI Workflow

## Goal
Make StampX feel like a social proof product, not a boring dashboard.
- clean · dark · card-first · easy to navigate
- built around: **create → verify → share**

---

## Core User Journey
```
Landing Page → Create Stamp → Stamp Preview → Publish Stamp
→ Public Stamp Page → Feed / Profile
→ (later) Verify / Reward / Agent Mode
```

---

## App Screens (All)

| # | Screen | Route | V1? |
|---|--------|--------|-----|
| 1 | Landing Page | `/` | ✅ |
| 2 | Create Stamp | `/create` | ✅ |
| 3 | Stamp Preview | `/create/preview` | ✅ |
| 4 | Published Stamp | `/stamp/[id]` | ✅ |
| 5 | Feed | `/feed` | ✅ |
| 6 | Profile | `/profile/[wallet]` | ✅ |
| 7 | Agent Profile | `/agent/[id]` | later |
| 8 | Verification | `/verify/[stamp-id]` | later |
| 9 | Rewards | `/rewards/[stamp-id]` | later |
| 10 | Dashboard/Settings | `/settings` | later |

**Ship V1 with screens 1–6 only.**

---

## 1. Landing Page `/`

### Navbar
- Left: StampX logo
- Right: View Feed · How it Works · Create Stamp · Connect Wallet

### Hero
**Headline:** Stamp your work. Prove your value.
**Subtext:** Turn posts, tasks, deals, and outcomes into verifiable proof for humans and AI agents on Base.

**CTAs:**
- `Create Your First Stamp` (primary)
- `View Live Stamps` (secondary)

**Trust text:** "Built for creators, builders, operators, and AI agents" · "Proof > claims"

### Example Stamp Showcase (hero or just below)
```
DanBuilds
Generated 25,400 impressions from a Base ecosystem thread
Source: X post · Status: Verified · Type: Human · Reward: 25 USDC · Score: 87
[ View Stamp ]
```

### Problem Section
**Headline:** The internet runs on claims, not proof.
Creators say they performed. Builders say they shipped. Agents say they delivered. But there's no clean standard for proving that work happened.

### Solution Section
**Headline:** StampX turns work into proof.
3 cards: Create a Stamp · Verify with data · Share or reward it

### Built For Section
4 boxes: Creators · Builders · Growth / BD · AI Agents

### Final CTA
**Headline:** Stop saying what you did. Stamp it.
- `Create Your First Stamp`
- `Explore Feed`

---

## 2. Create Stamp Page `/create`

### Goal
Create a stamp in under 1 minute. Very clean, not overloaded.

### Layout
- **Left:** form
- **Right:** live stamp preview (updates as user types)

### Header
**Title:** Create a Stamp
**Subtitle:** Capture work, attach proof, and publish a shareable record.

### Form Sections

**A — Subject:** Who is this stamp for?
- Toggle: Human / AI Agent
- If Human: name/handle + wallet (optional)
- If Agent: agent name + wallet (optional) + platform (Virtuals / custom / other)

**B — Stamp Type:** What kind of work is this?
Dropdown: Content · Growth · Partnership · Build/Product · Task Completion · Trade/Strategy · Community · Other

**C — Description:** What happened?
Textarea placeholder examples:
- "Wrote a thread that generated 25k impressions for Base builders"
- "Closed a partnership that brought new users to a protocol"
- "AI agent completed 12 trading actions with positive outcome"

**D — Source:** Add proof source
- Source link (tweet / tx / github / task URL)
- Optional tx hash
- Optional platform tag

**E — Metrics:** Add measurable impact (optional in V1)
Fields: Views · Clicks · Volume · Leads · Revenue · Custom metric

**F — Verification:** Verification level
- Self Reported (default)
- Request Verification → "coming soon" in V1

**G — Reward:** Attach a reward? (optional, display-only in V1)
- Token type · Amount · Reward note

### Buttons
- `Preview Stamp`
- `Publish Stamp`

### Right Side — Live Preview Card
Updates in real time as user types:
```
[Avatar] DanBuilds
Generated 25,400 impressions for Base ecosystem builders
Type: Content · Source: X Post · Status: Self Reported · Reward: 25 USDC · Time: Just now
[ Publish ] [ Reset ]
```

---

## 3. Stamp Preview Page

### Goal
Final polished card before publish. Should feel premium.

### Layout
Center aligned, card-focused.

**Header:** Preview your Stamp
**Subtext:** This is how your proof will appear publicly.

### Main Card (full size)
```
DanBuilds
Generated 25,400 impressions for Base ecosystem builders

Type        Content
Source      X Thread
Metrics     25.4K views · 380 likes · 72 reposts
Verified    Self Reported
Reward      25 USDC
Created     March 21, 2026
```

### Buttons below card
- `Publish Stamp` (primary)
- `Edit Stamp`
- `Save Draft` (later)
- `Share` (after publish)

---

## 4. Published Stamp Page `/stamp/[id]`

### Goal
Public proof page people can share. This is the viral unit.

### Top Bar
Logo · Create Stamp · View Feed · Profile

### Main Stamp Area (large, centered)
```
DanBuilds
Generated 25,400 impressions for Base ecosystem builders

Badges: Human · Content · Self Reported / Verified · Base

Metrics: Views · Clicks · Volume · Leads

Source: [link] · Tx hash (if available)
Reward: 25 USDC attached

Published by: [wallet]
Timestamp · Stamp ID
```

### Buttons
- `Share`
- `Copy link`
- `Verify this stamp`
- `Send reward` (later)

### Secondary — Related Stamps
3 cards: More from this user · Similar content type · Similar agent tasks

---

## 5. Feed Page `/feed`

### Goal
Make StampX feel alive. Discovery + social layer.

### Header
**Title:** Live Stamps
**Subtext:** See what creators, builders, and AI agents are proving onchain.

### Filter Bar
Tabs: All · Humans · Agents · Verified · Rewarded · Latest
Search: by name, wallet, or tag

### Feed Cards (compact)
```
AstraAgent
Completed 14 trade actions with 81% success rate
Type: Agent · Status: Self Reported · Reward: None · 2h ago
[ View Stamp ] [ Share ]

DanBuilds
Closed 1 partnership campaign for a Base protocol
Type: Growth · Status: Verified · Reward: 100 USDC · 5h ago
[ View Stamp ] [ Share ]
```

### Sidebar (skip in V1)
Trending: Top Humans · Top Agents · Most Rewarded · Recently Verified

---

## 6. Profile Page `/profile/[wallet]`

### Goal
Onchain resume. Show user proof history.

### Profile Header
Avatar · Name/handle · Short bio · Wallet address
Buttons: `Create Stamp` · `Share Profile`

### Stats Row
Total Stamps · Verified Stamps · Total Rewards · Total Impact · Agent Score (later)

### Tabs
All Stamps · Verified · Rewarded · Humans/Agents · Activity

### Example
```
DanBuilds — Creator / Builder / BD
Stamping work across Base, media, and agent systems

18 Stamps · 6 Verified · 220 USDC Rewards · 148K Total Reach
```

Stamp list: newest to oldest.

---

## 7. Agent Profile Page `/agent/[id]` (later)

### Agent Header
Agent icon · Name · Platform tag (Virtuals / Custom / Base) · Wallet · Status badge (Verified / Active / Experimental)

### Agent Summary
What this agent does.

### Metrics
Tasks completed · Success rate · Total stamped outcomes · Rewards earned · Last active

### Recent Stamps
```
ScoutAgent — Generated 18 qualified leads for a Base-native protocol
TradePilot — Completed 11 executions with positive outcome
```

CTAs: View all Stamps · Verify this agent · Attach reward campaign (later)

---

## 8. Verification Page `/verify/[stamp-id]` (later)

**Header:** Verify this Stamp
**Subtext:** Upgrade a claim into trusted proof using API and onchain signals.

Verification method cards:
- Social Metrics
- Onchain Activity
- Task Outcome
- Agent Signature (later)
- ERC-8183 (later)

Each shows: Available / Coming soon

Status box: Current: Self Reported → Target: Verified
Buttons: `Run Verification` · `Return to Stamp`

---

## 9. Rewards Page `/rewards/[stamp-id]` (later)

**Header:** Attach a Reward

Fields: Token · Amount · Rule · Recipient

Example rules: Fixed reward · Claimable by subject · Unlock after verification

---

## 10. Dashboard / Settings (later)

Connected wallet · Username · Profile image · Notifications · Agent mode toggle · Theme · API key

---

## Navigation

V1 (simplified):
```
Feed | Create | Profile
```

Full:
```
Feed | Create | Humans | Agents | Profile
```

---

## Copy Style

**Use:** Stamp · Proof · Verified · Reward · Impact · Outcome · Human · Agent

**Avoid:** soulbound credential · attestational primitive · zk proof language

### Microcopy

**Buttons:** Create Stamp · Preview · Publish · View Proof · Copy Link · Verify · Attach Reward

**Empty states:**
- "No stamps yet. Create your first Stamp and start proving your work."
- "No verified stamps yet. Upgrade your stamps with proof sources and verification."
- "No agent activity yet. Add your first agent-based task outcome."

---

## Visual Style
- Dark background
- Glass cards
- Soft borders + rounded corners
- Large numbers
- Clean spacing
- Subtle gradients

**Think:** Base-native premium social proof app

---

## Final Workflow Summary

**Human:** Create Stamp → Add proof → Preview → Publish → Share → (later) Verify → (later) Reward

**Agent:** Select Agent → Add task outcome → Add source/metrics → Publish → Build public history → (later) Automate
