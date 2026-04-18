# AI-Accelerated PM Development: How This Was Built

## The Thesis

This project demonstrates a new model of PM-led product development. Instead of writing Jira tickets for an engineering team, I used AI as a direct development partner — maintaining full product ownership while dramatically compressing the time from idea to working, high-fidelity prototype.

**Every product decision in this codebase was made by a human PM.** The AI handled syntax, boilerplate, and implementation detail. The thinking — what to build, why, for whom, and in what order — was mine.

This isn't "AI built my portfolio." It's "I used AI the way a strong PM should use any powerful tool: to move faster without sacrificing quality or judgment."

---

## The Workflow

### 1. Product Definition First (Before Any Code)

Before opening a code editor, I wrote:
- The problem statement and user persona (see [PRODUCT_BRIEF.md](./PRODUCT_BRIEF.md))
- The 5-screen user story map (see [USER_STORIES.md](./docs/USER_STORIES.md))
- The entity taxonomy (Accounts / Groups / Roles / Resources) that would drive every data model decision
- The prioritization rationale — why Slack as the deep integration, why 12 integrations in the catalog, what to explicitly not build

**This phase had zero AI involvement.** Product thinking is not something to delegate.

### 2. Architecture Planning with Parallel Sub-Agents

Before writing any component code, I used Claude Code's **parallel Explore sub-agents** to analyze the codebase and generate an implementation plan.

Explore sub-agents would read multiple files simultaneously and return a structured summary of existing patterns — component naming conventions, Tailwind config, shadow tokens, data model shapes. This meant I wasn't starting from scratch every session; the AI had full context of what already existed before suggesting new code.

Plan sub-agents would then take that context and propose a component architecture — file structure, prop interfaces, state ownership — before a single line was written. This dramatically reduced the risk of AI hallucination, because the AI was planning against real code, not against assumptions.

**The PM role here:** Reviewing the architecture plan, pushing back where it conflicted with the UX vision, and approving or redirecting before implementation began.

### 3. Component-by-Component Development with Structured Prompts

Each component was built with a prompt that included:
- The user story it serves ("As Sam, I want to see which NHIs exist so that I can prioritize remediation")
- The visual specification (layout, spacing, color tokens, shadow treatment)
- The data it needs (typed interface, mock data shape)
- The existing patterns to follow (e.g., "match the OffsetCard shadow treatment used in EntityCounters")

**Prompt quality = output quality.** Prompts that included user story context produced better UX than prompts that just described features. The AI doesn't know what good looks like — the PM has to define it in the prompt.

### 4. PM-Directed Iteration

When AI output didn't match the UX vision, I directed corrections with specific reasoning — not just "make it better."

Examples of PM-directed corrections:
- "The status ring should pulse when syncing, not when rate-limited — we want to convey active progress, not alarm"
- "The NHI list should sort by severity descending — the most dangerous identity should be first because Sam is triaging, not browsing"
- "The value props in Step 1 should be outcomes ('Detect non-human identities') not features ('OAuth scope access')"

**This is the most important part of the workflow.** AI will confidently build the wrong thing if you don't push back with product judgment.

### 5. QA Against the Story Map

Each screen was validated against the user stories before moving on. The question was always: "Does this screen do what Sam needs at this moment in her journey?" — not "Does this look good?" or "Does this compile?"

---

## Tools Used

| Tool | Purpose | Example Usage |
|---|---|---|
| **Claude Code (CLI)** | Primary development environment | Component generation, refactoring, Tailwind token configuration, debugging TypeScript errors |
| **Explore Sub-Agents** | Codebase analysis before new features | "Read these 8 files and identify the existing shadow token patterns, component naming conventions, and data model shapes before we build IntegrationCard" |
| **Plan Sub-Agents** | Architecture planning | "Design the data model for 12 integrations in a catalog — define the TypeScript interface, connection status enum, and health status types before writing any component code" |
| **Skills** | Specialized component tasks | Invoked for complex UI patterns like the animated multi-stage sync progress screen and the 3D flip card animation |
| **Structured Prompts** | PM-directed output | Every prompt included: user story context, visual spec, data interface, and reference patterns — never just "build me a X component" |

---

## Division of Labor

| PM Decisions (Human) | AI Execution (Claude Code) |
|---|---|
| Which 12 integrations to include (based on market research: Okta, GitHub, Google Workspace, Azure AD, AWS IAM, Slack, Salesforce, Workday, etc.) | Generating `integrations.ts` with correct TypeScript types and mock data for each integration |
| The 4-step wizard structure and step names (Connect → Permissions → Configure → Initialize) | Implementing the step state machine, progress bar, and step-jump navigation |
| Entity taxonomy: Accounts / Groups / Roles / Resources as the normalized cross-provider model | Building `EntityBadge` component with correct color variants and responsive sizing |
| Risk donut chart as the primary dashboard metric (proportion over magnitude) | Rendering the donut chart with correct proportions and color-coded severity legend |
| NHI as the featured risk category on the dashboard | Writing the NHI list component, mock data, severity badge variants |
| Offset shadow as the visual differentiator from institutional IAM product design | Configuring custom Tailwind shadow tokens (`shadow-offset`, `shadow-offset-md`, `shadow-offset-yellow`, `shadow-offset-orange`) |
| Value props in Step 1 framed as outcomes, not features | Implementing the wizard layout, card animations, and CTA styling |
| Cream background (`#F5F0E8`) to reduce eye strain for long security engineer sessions | Adding the `bg-cream` token to the Tailwind config and applying it globally |
| 3D flip card interaction for integration catalog density without information loss | Implementing CSS 3D transform animation with `preserve-3d`, backface visibility, and hover state management |
| Activity log split into Remediation Actions + System Logs tabs | Building the tab component, mock log data structure, and severity color coding |

---

## Lessons Learned

**1. The quality of AI output is directly proportional to the quality of context you provide.**
Prompts that included user stories, data models, and existing pattern references produced dramatically better results than feature-level prompts. The AI has no product judgment — it can only be as good as the context you give it. Writing good prompts is a PM skill.

**2. AI is excellent at consistency — establish patterns early.**
Once a design pattern exists (like `OffsetCard` with offset shadows, or `StatusBadge` with specific color variants), the AI applies it correctly across every new component. The design system isn't just a developer tool — it's a constraint that makes AI output more predictable. PMs should think about design systems as a way to encode their UX intent in a form the AI can follow.

**3. AI has no product judgment. None.**
It will confidently build a feature that contradicts your UX principles if you don't specify them. It will design for the average case when you need the edge case. It will optimize for completeness when you need simplicity. The PM's role in AI-assisted development is to hold the product vision — that hasn't changed.

**4. Sub-agents (Explore + Plan) dramatically reduce hallucination risk.**
The most dangerous failure mode of AI development is when the AI makes incorrect assumptions about existing code. Explore sub-agents read the actual codebase before suggesting new code. Plan sub-agents propose architecture against real constraints. Read first → plan second → build third. Never skip the first two.

**5. Iteration speed changes what's possible for PMs.**
I explored 3 different dashboard layouts in an afternoon — something that would take 2–3 sprint cycles in a traditional PM/eng waterfall workflow. This changes the economics of prototyping: instead of committing to a UX direction before building, you can build 3 directions, evaluate them against user stories, and pick the best one. The cost of a wrong UX decision dropped dramatically.

---

## Time Investment

Approximately 12–15 hours total, broken down as:

| Phase | Time |
|---|---|
| Product definition (brief, persona, story map, prioritization) | ~3 hours |
| Architecture planning sessions (sub-agent analysis, data model design) | ~2 hours |
| Active AI-directed development (component-by-component) | ~6 hours |
| Review, QA against story map, and iteration | ~3 hours |

**For comparison:** A traditional PM → design → engineering workflow for this scope (12 integrations, 4-step wizard, full dashboard) would conservatively require 4–6 weeks with a 3-person team (PM, designer, 1 frontend engineer). This was built solo in less than two working days.

That's not a claim that AI replaces teams. It's a claim that PMs who can think in product and direct AI can now test product ideas at a speed that wasn't previously possible. The bottleneck shifted from "can we build it?" to "what should we build?"

---

*This document is a product thinking artifact created as part of a personal portfolio project.*
