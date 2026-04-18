# User Story Map: Identity Integration Hub

The following story map defines the core user journey for this product. These stories were written before any design or code work began — they are the source of truth that all product decisions traced back to.

**Primary user:** Sam, Senior Security Engineer at a 300-person SaaS company
**Core job to be done:** Gain continuous visibility and control over all identities — human and non-human — across the company's SaaS estate

---

## Journey Backbone (High-Level Activities)

```
[ Discover ]  →  [ Connect ]  →  [ Authorize ]  →  [ Confirm ]  →  [ Monitor ]
```

These 5 activities define the full user journey from "I've heard about this product" to "I'm actively using it to manage my identity estate."

---

## Stories by Activity

### Activity 1: Discover — Finding the Right Integration

Sam arrives at the integration catalog. She needs to assess the platform's coverage and prioritize which integration to set up first.

| # | User Story | Priority |
|---|---|---|
| 1.1 | As Sam, I want to see all available integrations in one place so that I can assess the platform's coverage before committing | Must Have |
| 1.2 | As Sam, I want to filter integrations by category (HR, Engineering, Security, Cloud, Identity) so that I can focus on what's relevant to my stack | Must Have |
| 1.3 | As Sam, I want to see which integrations are already connected so that I can track my setup progress and avoid duplicating work | Must Have |
| 1.4 | As Sam, I want to see the health status of connected integrations at a glance so that I can quickly identify anything that needs attention | Should Have |
| 1.5 | As Sam, I want to request integrations that aren't in the catalog so that I can signal demand for the tools my company actually uses | Nice to Have |

**What this drove in the UI:**
- "My Integrations" and "All Integrations" tabs (1.1, 1.3)
- Left sidebar with category checkboxes and toggle filters (1.2)
- Status ring and badge on each integration card (1.4)
- "Request Integration" button and form (1.5)

---

### Activity 2: Connect — Initiating a New Integration

Sam has chosen an integration. She needs to understand what she's authorizing before she starts the OAuth flow.

| # | User Story | Priority |
|---|---|---|
| 2.1 | As Sam, I want to understand what the platform will discover before I authorize access so that I can justify the integration to my CISO | Must Have |
| 2.2 | As Sam, I want to see which OAuth permission scopes are being requested and why so that I can assess the access risk | Must Have |
| 2.3 | As Sam, I want a clear primary CTA that initiates the connection flow so that I don't have to figure out where to start | Must Have |
| 2.4 | As Sam, I want to configure the sync interval before connecting so that I can balance freshness against API rate limits | Should Have |

**What this drove in the UI:**
- Step 1: Value proposition screen with outcome-focused copy (2.1, 2.3)
- Step 2: Permissions screen showing requested OAuth scopes with risk indicators (2.2)
- Step 3: Configuration screen with sync interval selection (2.4)

---

### Activity 3: Authorize — Going Through the OAuth Flow

Sam is mid-flow. She's authorized OAuth and is waiting for the initial sync. This is the highest drop-off risk moment.

| # | User Story | Priority |
|---|---|---|
| 3.1 | As Sam, I want visual confirmation that the authorization is progressing so that I don't abandon the flow thinking it's broken | Must Have |
| 3.2 | As Sam, I want each sync stage labeled in my language (not technical jargon) so that I can describe what's happening to a non-technical manager | Should Have |
| 3.3 | As Sam, I want to know roughly how long the sync will take so that I can decide whether to wait or come back | Should Have |
| 3.4 | As Sam, I want the option to skip the sync and come back later so that I'm not blocked if I need to step away | Nice to Have |

**What this drove in the UI:**
- Step 4: Animated progress screen with named sync stages (3.1, 3.2)
- Progress bar with stage count ("2/6 steps") (3.3)
- "Skip sync — continue to results" link (3.4)

---

### Activity 4: Confirm — Reviewing Discovery Results

The sync completed. Sam needs to immediately understand what was found — and feel confident the product is working.

| # | User Story | Priority |
|---|---|---|
| 4.1 | As Sam, I want to immediately see how many entities were discovered so that I can validate the platform is working correctly | Must Have |
| 4.2 | As Sam, I want the entity breakdown by type (accounts, groups, roles, resources) so that I understand the scope of what I now have visibility into | Must Have |
| 4.3 | As Sam, I want to see a human/NHI breakdown within accounts so that I immediately know how many non-human identities were found | Must Have |
| 4.4 | As Sam, I want to set up connection alerts before I navigate away so that I'll know if the integration breaks | Should Have |

**What this drove in the UI:**
- Success screen with 4 stat cards: Accounts (247), Groups (38), Roles (12), Resources (156) (4.1, 4.2)
- Human/NHI sub-count within the Accounts card (4.3)
- Alert setup section (email / Slack channel) inline on the success screen (4.4)

---

### Activity 5: Monitor — Maintaining Security Posture

Sam returns to the dashboard regularly. This is where the product delivers ongoing value — not just at setup time.

| # | User Story | Priority |
|---|---|---|
| 5.1 | As Sam, I want a visual summary of my overall risk posture so that I can quickly assess risk without reading through lists | Must Have |
| 5.2 | As Sam, I want to see which non-human identities exist and their current risk level so that I can prioritize remediation | Must Have |
| 5.3 | As Sam, I want an activity log of remediation actions so that I have an audit trail for compliance reporting | Must Have |
| 5.4 | As Sam, I want to see the sync health status and last/next sync time so that I know whether the data I'm looking at is fresh | Should Have |
| 5.5 | As Sam, I want to configure sync settings from the dashboard so that I don't have to go back through the setup wizard to adjust behavior | Should Have |
| 5.6 | As Sam, I want to see a rate limit warning before I hit the limit so that I can adjust sync frequency proactively | Nice to Have |

**What this drove in the UI:**
- Risk donut chart with Critical/High/Medium/Low breakdown (5.1)
- NHI identity list with per-entity type and severity badges (5.2)
- Remediation Actions tab in activity log (5.3)
- HealthMetrics bar showing sync status, last sync, next sync, API call usage (5.4)
- Sync Settings modal accessible from the dashboard (5.5)
- Rate limit warning alert in HealthMetrics (5.6)

---

## Acceptance Criteria Samples

The following stories have formal acceptance criteria in Given/When/Then format. These were used to validate the prototype against user intent before each screen was considered complete.

### Story 4.1 — Entity Discovery Counts

**"As Sam, I want to immediately see how many entities were discovered"**

- **Given:** The OAuth authorization and initial sync have completed successfully
- **When:** The sync process reaches 100% and the success state renders
- **Then:** I see a success confirmation screen displaying entity count cards for accounts, groups, roles, and resources
- **And:** Each count card displays the total number discovered in a large, scannable format
- **And:** The accounts card additionally shows the human/NHI breakdown (e.g., "218 human · 29 bots")

---

### Story 1.2 — Category Filtering

**"As Sam, I want to filter integrations by category"**

- **Given:** I am on the Integration Catalog page viewing All Integrations
- **When:** I check one or more category checkboxes in the left filter panel (e.g., "Engineering", "Security")
- **Then:** The integration grid updates to show only integrations matching the selected categories
- **And:** The count displayed in the tab updates to reflect the filtered result set
- **And:** Unchecking all filters returns the full unfiltered catalog

---

### Story 5.2 — NHI List Visibility

**"As Sam, I want to see which non-human identities exist and their risk level"**

- **Given:** I have at least one integration connected and its initial sync is complete
- **When:** I navigate to the Security Dashboard
- **Then:** I see a dedicated NHI section listing detected non-human identities
- **And:** Each NHI entry shows: name, entity type (Bot / App / Token), and severity badge (Critical / High / Medium / Low)
- **And:** The list is sorted by severity descending — the highest-risk NHIs appear first
- **And:** Each entry has enough context (name, type, severity) to determine whether action is needed without clicking into a detail page

---

## Story Coverage Summary

| Activity | Stories Written | Must Have | Should Have | Nice to Have |
|---|---|---|---|---|
| Discover | 5 | 3 | 1 | 1 |
| Connect | 4 | 3 | 1 | 0 |
| Authorize | 4 | 1 | 2 | 1 |
| Confirm | 4 | 3 | 1 | 0 |
| Monitor | 6 | 3 | 2 | 1 |
| **Total** | **23** | **13** | **7** | **3** |

All 13 Must Have stories are implemented in the current prototype. Should Have stories are 6/7 implemented. Nice to Have stories are partially implemented (skip sync link, request integration form).

---

*This document is a product thinking artifact created as part of a personal portfolio project. Stories preceded all design and code work.*
