export type HotspotTag =
  | 'Customer Discovery'
  | 'Risk Mitigation'
  | 'PLG'
  | 'UX Pattern'
  | 'Activation'
  | 'Retention'

export interface HotspotAnnotation {
  number: number
  title: string
  body: string
  tag: HotspotTag
}

export interface HotspotDef {
  id: string
  top: string   // percentage string, e.g. "20%"
  left: string  // percentage string, e.g. "38%"
  annotation: HotspotAnnotation
  // Optional: clicking the action button navigates to another slide
  actionSlide?: SlideId
  // Optional: clicking the action button opens a special screen
  actionType?: 'request-form' | 'all-integrations' | 'sync-settings'
}

export type SlideId =
  | 'gallery'
  | 'gallery-all'       // satellite — reached from gallery hotspot #4
  | 'request-form'      // satellite — reached from gallery hotspot #2
  | 'connect'
  | 'permissions'
  | 'permissions-remediation'  // satellite — reached from permissions hotspot #1
  | 'config'
  | 'syncing'
  | 'success'
  | 'dashboard'

export interface SlideDef {
  id: SlideId
  title: string
  subtitle: string
  hotspots: HotspotDef[]
  /** Satellite slides are not part of the linear Next/Prev flow */
  satellite?: boolean
}

export const TAG_COLORS: Record<HotspotTag, string> = {
  'Customer Discovery': 'bg-blue-100 text-blue-700 border-blue-200',
  'Risk Mitigation':    'bg-red-100 text-red-700 border-red-200',
  'PLG':                'bg-yellow-100 text-amber-800 border-yellow-300',
  'UX Pattern':         'bg-slate-100 text-slate-600 border-slate-200',
  'Activation':         'bg-green-100 text-green-700 border-green-200',
  'Retention':          'bg-purple-100 text-purple-700 border-purple-200',
}

export const SLIDES: SlideDef[] = [
  // ── SLIDE 1: Integration Gallery ──────────────────────────────────────────
  {
    id: 'gallery',
    title: 'Integration Gallery',
    subtitle: 'Discovery, Ownership, Request Loop & Smart Filtering',
    hotspots: [
      {
        id: 'gallery-tabs',
        top: '24%',
        left: '34%',
        annotation: {
          number: 1,
          title: 'Tab Split: Mine vs All',
          tag: 'Customer Discovery',
          body: "Separating 'My Integrations' from 'All' reduces cognitive load for returning users while keeping discoverability accessible.",
        },
      },
      {
        id: 'gallery-request-btn',
        top: '4%',
        left: '81%',
        annotation: {
          number: 2,
          title: 'Request Integration Button',
          tag: 'Customer Discovery',
          body: "A direct Customer Discovery option, creates instant engagement and product satisfaction. Every 'Request' click is a quantified signal about unaddressed pain.",
        },
        actionType: 'request-form',
      },
      {
        id: 'gallery-filter-panel',
        top: '40%',
        left: '13%',
        annotation: {
          number: 3,
          title: 'Category Filter Panel',
          tag: 'UX Pattern',
          body: "The collapsible left filter panel help reduce the cognitive load by limiting the number of visible options at any given time.",
        },
      },
      {
        id: 'gallery-section-divider',
        top: '44%',
        left: '50%',
        annotation: {
          number: 4,
          title: 'Connected vs Available Separator',
          tag: 'UX Pattern',
          body: "Clear visual separation prevents confusion between active integrations (owned, manageable) and potential ones that can be connected.",
        },
        actionType: 'all-integrations',
      },
    ],
  },

  // ── SATELLITE: Request Form (reached from gallery hotspot #2) ─────────────
  {
    id: 'request-form',
    title: 'Integration Request Form',
    subtitle: 'Customer Discovery — Capturing Unmet Need',
    hotspots: [],
    satellite: true,
  },

  // ── SATELLITE: All Integrations (reached from gallery hotspot #4) ─────────
  {
    id: 'gallery-all',
    title: 'All Integrations View',
    subtitle: 'Connected vs Available — hover cards to see back-side details',
    hotspots: [
      {
        id: 'gallery-all-slack',
        top: '47%',
        left: '23%',
        annotation: {
          number: 1,
          title: 'Connect Slack — Start Here',
          tag: 'Activation',
          body: "We can integrate Slack for example - It maps workspace identities, channels, and privilege levels into your identity graph in under 5 minutes. Click below to begin the Slack integration flow!",
        },
        actionSlide: 'connect',
      },
    ],
    satellite: true,
  },

  // ── SLIDE 2: Slack Connection Step 1 ──────────────────────────────────────
  {
    id: 'connect',
    title: 'Slack Connection — Step 1',
    subtitle: 'OAuth Entry Point & Value Proposition',
    hotspots: [],
  },

  // ── SLIDE 3: Mode Selection & Permissions ─────────────────────────────────
  {
    id: 'permissions',
    title: 'Mode Selection & Permissions',
    subtitle: 'Controlling Fear, Not Invoking It',
    hotspots: [
      {
        id: 'perms-mode-cards',
        top: '23%',
        left: '35%',
        annotation: {
          number: 1,
          title: 'Mode Selection as Control, Not Fear',
          tag: 'Activation',
          body: "The Risk: IT Admins dropping off when forced to grant 'Write' permissions on Day 1. The Solution: We put the user in control - By offering a clear choice and defaulting to 'Visibility Mode' (Read-only), we remove setup friction and build trust. Once they experience the core value, they can naturally upgrade to 'Active Remediation'.",
        },
        actionSlide: 'permissions-remediation',
      },
      {
        id: 'perms-scope-badges',
        top: '55%',
        left: '72%',
        annotation: {
          number: 2,
          title: 'Building Trust through Transparency',
          tag: 'UX Pattern',
          body: "Our core users are IT and Security Admins who have zero tolerance for ׳black-box׳ setups. We explicitly expose the exact Read/Write scopes to provide full technical transparency.",
        },
      },
    ],
  },

  // ── SATELLITE: Permissions — Active Remediation view ──────────────────────
  {
    id: 'permissions-remediation',
    title: 'Mode Selection — Active Remediation',
    subtitle: 'Upgrading from Visibility to Active Remediation',
    hotspots: [
      {
        id: 'perms-remediation-scopes',
        top: '55%',
        left: '72%',
        annotation: {
          number: 2,
          title: 'Building Trust through Transparency',
          tag: 'UX Pattern',
          body: "Our core users are IT and Security Admins who have zero tolerance for ׳black-box׳ setups. We explicitly expose the exact Read/Write scopes to provide full technical transparency.",
        },
      },
    ],
    satellite: true,
  },

  // ── SLIDE 4: Configuration & Data Scoping ─────────────────────────────────
  {
    id: 'config',
    title: 'Configuration & Data Scoping',
    subtitle: 'Matching the IT Admin Mental Model',
    hotspots: [
      {
        id: 'config-workspaces',
        top: '38%',
        left: '22%',
        annotation: {
          number: 1,
          title: 'Workspace Granularity - Post OAuth Fetch',
          tag: 'Customer Discovery',
          body: "This screen appears after the user grants the API token, but before the heavy data sync. We run a lightweight API fetch to list available workspaces, to allow admins to exclude noisy data (like staging servers or guests) before mass ingestion begins.",
        },
      },
      {
        id: 'config-guest-toggle',
        top: '50%',
        left: '72%',
        annotation: {
          number: 2,
          title: 'Exclude Guests Toggle',
          tag: 'UX Pattern',
          body: "Guest accounts may contaminate identity data. A simple default-off toggle can help us improve the model's accuracy for customers who use guest accounts heavily, without adding complexity for those who don't.",
        },
      },
    ],
  },

  // ── SLIDE 5: Syncing ───────────────────────────────────────────────────────
  {
    id: 'syncing',
    title: 'Syncing & Initialization',
    subtitle: 'Converting Wait Time Into Trust',
    hotspots: [
      {
        id: 'sync-progress-bar',
        top: '36%',
        left: '50%',
        annotation: {
          number: 1,
          title: 'Progress Bar',
          tag: 'Activation',
          body: "a generic loading spinner is too vague. By breaking the long sync into explicit technical milestones (X/6 steps), we're avoiding 'frozen state' anxiety and build trust by showing exactly what data is being processed in real-time.",
        },
      },
    ],
  },

  // ── SLIDE 6: Success ───────────────────────────────────────────────────────
  {
    id: 'success',
    title: 'Success & Day-2 Operations',
    subtitle: 'The Aha Moment and Deliberate Deferred Risk',
    hotspots: [
      {
        id: 'success-entity-cards',
        top: '38%',
        left: '50%',
        annotation: {
          number: 1,
          title: 'The "Aha!" Moment',
          tag: 'Activation',
          body: "The user get immediate results for the integration process, getting a sense of what Linx can do.",
        },
      },
      {
        id: 'success-alerts-panel',
        top: '78%',
        left: '50%',
        annotation: {
          number: 2,
          title: 'Day-2 Alert Setup',
          tag: 'Retention',
          body: "integrations frequently suffer from 'silent failures' (expired API tokens..), creating security blind spots. Capturing an alert channel immediately at the success state ensures proactive monitoring from minute one, preventing future data gaps and user frustration.",
        },
      },
    ],
  },

  // ── SLIDE 7: Dashboard ─────────────────────────────────────────────────────
  {
    id: 'dashboard',
    title: 'Monitoring Dashboard & PLG Upsell',
    subtitle: 'From Visibility to Active Remediation via Product-Led Growth',
    hotspots: [
      {
        id: 'dash-mode-badge',
        top: '8%',
        left: '33%',
        annotation: {
          number: 1,
          title: 'Operational Vital Signs',
          tag: 'PLG',
          body: "To reflect the integration status, This header exposes exact sync cadences and API quota usage. By being transparent about API limitations, we prove Linx isn't hostaile to their network.",
        },
      },
      {
        id: 'dash-sync-settings',
        top: '4%',
        left: '68%',
        annotation: {
          number: 2,
          title: 'Configurable Sync Pulses',
          tag: 'Retention',
          body: "Admins can tune the sync cadence (15 min → daily) to match their API budget and compliance needs. Webhook push support eliminates polling for integrations that support it - reducing API cost and delivering real-time identity updates.",
        },
        actionType: 'sync-settings',
      },
      {
        id: 'dash-risk-donut',
        top: '50%',
        left: '35%',
        annotation: {
          number: 3,
          title: 'Delivering instant value',
          tag: 'PLG',
          body: "By surfacing a prioritized Risk Breakdown immediately after sync, we deliver Instant Time-to-Value. It satisfies the User by transforming raw data into actionable security insights on Day 1.",
        },
      },
      {
        id: 'dash-nhi-card',
        top: '50%',
        left: '79%',
        annotation: {
          number: 4,
          title: 'NHI Highlight (Yellow Card)',
          tag: 'Risk Mitigation',
          body: "Non-Human Identities are the fastest-growing identity attack vector (and our product's key differentiation vs traditional IAM).",
        },
      },
      {
        id: 'dash-plg-card',
        top: '65%',
        left: '40%',
        annotation: {
          number: 5,
          title: '״Upsell״ Card',
          tag: 'PLG',
          body: "This is a small Product-Led Growth conversion mechanism - We encourage 'read-only' conservative Admins to grant Linx write permissions, by highlighting the value of automatic risk reduction.",
        },
      },
    ],
  },
]

// Linear flow (excludes satellite slides) — used for Next/Prev navigation and dot indicators
export const MAIN_FLOW = SLIDES.filter(s => !s.satellite)
