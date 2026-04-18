# Design Decisions & UX Rationale

Every non-obvious design choice in this prototype has a reason. This document captures the key decisions, the alternatives considered, and why the chosen direction was selected. It's written for anyone who wants to understand the product thinking behind the UI — not just what was built, but why.

---

## 1. Visual Design System: Offset Shadows & Cream Background

**Decision:** Flat cards with a 2px hard-edged black offset shadow, set against a warm cream background (`#F5F0E8`), with a three-color brand palette (yellow, orange, purple).

**Alternatives considered:**
- Standard drop shadows (Gaussian blur, soft opacity) — the default for most SaaS products
- Glassmorphism (frosted glass, backdrop blur) — popular in 2022–2024 enterprise design
- Pure flat design with color-only hierarchy — no shadow depth at all

**Why offset shadows:**
Hard-edged offset shadows create visual depth and card separation without relying on gradients or blur effects. They work at any zoom level, render crisply in screenshots shared in Slack or docs, and give the product a distinct visual personality. Enterprise IAM tools (Okta, Azure AD, SailPoint) trend toward neutral grays and institutional design — the offset shadow aesthetic is a deliberate differentiator that signals "built by people who care about craft."

**Why cream instead of white:**
Security engineers often work long sessions. Pure white (`#FFFFFF`) backgrounds cause eye strain under high-brightness monitors. The cream background (`#F5F0E8`) reduces contrast fatigue without sacrificing readability. It also makes the white card surfaces pop with natural contrast — no extra shadow work needed to separate card from background.

**Trade-off acknowledged:** Offset shadows can read as "playful" in a category where institutional trust matters. This was an intentional bet — differentiation over conformity. A security product that looks like every other security product is harder to remember.

---

## 2. Navigation: Three Views, No Deep Nesting

**Decision:** Three top-level views (Integration Catalog → Connect Wizard → Dashboard) with flat navigation and breadcrumb-based back navigation. No sub-navigation panels or nested route trees.

**Alternatives considered:**
- Tab-based navigation inside each integration detail page
- Contextual navigation that appears inside integration cards
- Full drill-down hierarchy: Catalog → Integration Detail → Configure → Dashboard (per integration)

**Why flat:**
For a prototype demonstrating a product concept, flat navigation lets a viewer understand the full product surface in under 30 seconds. Deep navigation hierarchies obscure value — the goal of this prototype is to show what security teams would gain from this product, not to simulate a complete application architecture.

The three views map directly to the three moments that matter:
1. **"What can I connect?"** → Catalog
2. **"How do I connect it?"** → Wizard
3. **"What did I learn?"** → Dashboard

**Future consideration:** A production v2 would need per-integration detail pages and a proper routing solution (React Router or a framework with file-based routing). The current state-based router in `App.tsx` is explicitly scoped to prototype needs.

---

## 3. Connect Flow: Why a 4-Step Wizard?

**Decision:** A multi-step wizard (Connect → Permissions → Configure → Initialize) rather than a single-page OAuth redirect or a minimal modal.

**Alternatives considered:**
- Single-page OAuth redirect — click "Connect", bounce to OAuth provider, return to app
- 2-step flow — confirm intent, then authorize
- Inline connection initiated from within the gallery card hover state

**Why a wizard:**

**Step 1 (value props) exists because security engineers often need to justify a new tool integration to their manager or CISO.** The value proposition screen gives them language to use: "this will detect non-human identities, surface excessive permissions, and give us a remediation audit trail." Without Step 1, Sam would have to describe this to her manager from memory.

**Step 4 (animated sync) transforms a wait state into a moment of anticipation.** OAuth flows and initial data syncs can take 10–60 seconds. Without progress feedback, users assume something is broken and abandon. Breaking the sync into named stages ("Connecting to API", "Validating OAuth token", "Syncing Users", "Building identity graph") serves two purposes: it makes the wait feel shorter, and it sets accurate expectations about what the product is actually doing.

**UX principle applied:** Nielsen's Heuristic #1 — *Visibility of system status.* Users should always know what the system is doing. The animated sync screen is the most visible application of this principle in the product.

**Trade-off:** A 4-step wizard adds friction compared to a single-click OAuth redirect. This friction is deliberate — the wizard is also an educational onboarding moment, not just a connection mechanism. The "skip sync" link at the bottom of Step 4 acknowledges that some users just want to get through it quickly.

---

## 4. Entity Taxonomy: Accounts, Groups, Roles, Resources

**Decision:** A consistent 4-entity model displayed via a shared `EntityBadge` component throughout the product (wizard, success state, dashboard, activity log).

**Alternatives considered:**
- A unified "identity" concept — everything is an identity, no subcategories
- A 2-tier model — "users" and "non-users"
- Provider-native terminology — "Slack members", "GitHub repos", "Okta apps" (different terms per integration)

**Why Accounts/Groups/Roles/Resources:**

This taxonomy maps directly to the actual IAM data model used by enterprise SaaS providers. Okta, Google Workspace, AWS IAM, Azure AD, and GitHub all have their own terminology, but they all have analogs to accounts (individual principals), groups (collections of accounts), roles (permission sets), and resources (things being protected). Using a normalized cross-provider taxonomy is what makes a multi-integration platform valuable — it abstracts away provider-specific language so security engineers can think about their identity estate uniformly.

**Design implication:** `EntityBadge` uses a consistent color per entity type across every view. This creates scan-ability — a security engineer looking at the activity log can identify entity types without reading the label.

**Trade-off:** Normalizing to 4 entity types loses some provider-specific nuance (e.g., Slack "channels" don't map cleanly to "resources"). For v1, the value of consistency outweighs the value of precision.

---

## 5. Dashboard Layout: Donut Chart + NHI List + Activity Log

**Decision:** Three distinct visualization components on the dashboard, each answering a different question.

| Component | Question It Answers | Time Horizon |
|---|---|---|
| Risk donut chart | "What proportion of my identity estate is at risk?" | Right now |
| NHI identity list | "Which specific non-human identities need attention?" | Right now, per entity |
| Remediation activity log | "What have we done about it?" | Historical audit |

**Alternatives considered:**
- A single unified table showing all identity entities with sortable columns
- A bar chart for risk distribution instead of a donut
- A timeline view showing risk trends over time (instead of current-state snapshot)

**Why a donut for risk:**
Risk posture is fundamentally a proportion question: "What percentage of my estate is clean?" A donut communicates proportion immediately — a CISO opening the dashboard should understand the ratio before reading a single label. A bar chart communicates magnitude, not proportion. A table requires reading. The donut wins for the executive-level first impression.

**Why a list for NHIs:**
Non-human identities need individual attention. You can't remediate a cohort — you remediate a specific bot token or OAuth app. A list with per-entity status badges makes each NHI an actionable item. A chart would aggregate away the information needed to take action.

**Why an activity log for remediation:**
Compliance auditors ask "what did you do about it?" — a different question from "what's the risk?" and "which entities are at risk?". The activity log is the temporal layer: it provides the evidence trail that a risk was detected and addressed. It's the answer to the SOC 2 question.

**Design principle:** Each component serves a different stakeholder at a different time horizon. The donut is for the CISO. The NHI list is for Sam. The activity log is for the auditor.

---

## 6. Integration Card: 3D Flip on Hover

**Decision:** Each integration card in the catalog has a 3D flip animation on hover — the front shows the integration logo, status ring, and category badge; the back reveals status details, entity counts, and the primary CTA.

**Alternatives considered:**
- Expansion panel — card expands vertically to reveal details
- Side drawer — clicking a card opens a detail panel on the right
- Inline tooltip on hover — no state change, just a tooltip
- Static card with all details always visible

**Why flip:**
The flip creates a natural "peek" interaction — users discover that the cards are interactive through hover, not through a separate instruction. The front/back metaphor maps to a natural mental model: what you see at a glance (logo, status) vs. what you learn when you look closer (counts, last sync, CTA).

Static cards with all details visible would require either very large cards (reducing catalog density) or very small text (reducing scan-ability). The flip lets the catalog remain dense while preserving rich per-integration detail.

**Trade-off:** The flip animation only works on hover, which is a desktop-only interaction. This is acceptable given the target user (security engineers on desktop). A mobile-first design would replace the flip with a tap-to-expand or bottom sheet pattern.

---

*This document is a product thinking artifact created as part of a personal portfolio project. It is not associated with any company or commercial product.*
