// --- Integration metadata ---
export const SLACK_INTEGRATION = {
  id: 'slack',
  name: 'Slack',
  description: 'Sync workspace identities, channels, and app permissions from Slack into the Linx identity graph.',
  logoColor: '#4A154B',
  valueProps: [
    { icon: 'Users',         text: 'Full visibility into workspace accounts and guest users' },
    { icon: 'Network',       text: 'Map Slack groups and channels to identity roles' },
    { icon: 'Bot',           text: 'Detect non-human identities: bots, OAuth apps, API tokens' },
    { icon: 'AlertTriangle', text: 'Surface excessive permissions and dormant accounts' },
  ],
}

// --- OAuth scopes ---
export const SLACK_SCOPES = [
  { scope: 'users:read',          description: 'List all workspace members and their profile data',         risk: 'Low'    as const },
  { scope: 'users.profile:read',  description: 'Read display name, email address, and status',             risk: 'Low'    as const },
  { scope: 'groups:read',         description: 'View private channels the authorizing user is a member of', risk: 'Medium' as const },
  { scope: 'channels:read',       description: 'List all public channels in the workspace',                risk: 'Low'    as const },
  { scope: 'team:read',           description: 'Access workspace name, domain, and icon',                  risk: 'Low'    as const },
]

export const SCOPE_TO_ENTITY: Record<string, string> = {
  'users:read':          'Account',
  'users.profile:read':  'Account',
  'groups:read':         'Group',
  'channels:read':       'Resource',
  'team:read':           'Role',
}

// --- Sync steps ---
export const SYNC_STEPS = [
  'Connecting to Slack API...',
  'Validating OAuth token...',
  'Syncing Users...',
  'Syncing Groups...',
  'Syncing Channels...',
  'Building identity graph...',
]

// --- Entity counts post-sync ---
export const ENTITY_COUNTS = {
  accounts:  { total: 247, human: 218, nhi: 29 },
  groups:    38,
  roles:     12,
  resources: 156,
}

// --- NHI identities ---
export const NHI_IDENTITIES = [
  { name: 'github-actions-bot',  type: 'Bot'   as const, lastActive: '2 hours ago',  permLevel: 'High'     as const },
  { name: 'zapier-integration',  type: 'App'   as const, lastActive: '14 hours ago', permLevel: 'Medium'   as const },
  { name: 'datadog-monitor',     type: 'App'   as const, lastActive: '5 min ago',    permLevel: 'High'     as const },
  { name: 'ci-deploy-token',     type: 'Token' as const, lastActive: '1 day ago',    permLevel: 'Critical' as const },
  { name: 'slack-export-bot',    type: 'Bot'   as const, lastActive: '3 days ago',   permLevel: 'Medium'   as const },
]

// --- Risk breakdown --- colors match Presented Data Styling reference
// Critical = strong pink/magenta, High = purple, Medium = yellow, Low = blue
export const RISK_BREAKDOWN = [
  { label: 'Critical', count: 8,   color: '#D6196B', pct: 3.3  },
  { label: 'High',     count: 23,  color: '#7C3AED', pct: 9.6  },
  { label: 'Medium',   count: 67,  color: '#F5C842', pct: 27.9 },
  { label: 'Low',      count: 142, color: '#3B82F6', pct: 59.2 },
]
export const TOTAL_RISKS = 240

// --- Health metrics ---
export const HEALTH_METRICS = {
  status:        'Healthy' as 'Healthy' | 'Rate Limited' | 'Error',
  lastSync:      '2 min ago',
  nextSync:      'in 3:58 hrs',
  apiCallsUsed:  847,
  apiCallsTotal: 10000,
  retryAfter:    47,
}

// --- Activity: remediation actions ---
export const REMEDIATION_ACTIONS = [
  { time: '10:42 AM', action: 'Account Suspended',            target: 'bot@slack-workspace.com',   severity: 'High'     as const },
  { time: '10:38 AM', action: 'Excessive Privileges Flagged', target: 'john.doe@company.com',      severity: 'Medium'   as const },
  { time: '09:15 AM', action: 'Dormant Account Flagged',      target: 'contractor-42@acme.io',     severity: 'Low'      as const },
  { time: '08:50 AM', action: 'MFA Bypass Detected',          target: 'svc-deploy@company.com',    severity: 'Critical' as const },
  { time: '08:22 AM', action: 'Group Membership Changed',     target: 'alice@company.com',         severity: 'Low'      as const },
]

// --- Activity: raw system logs ---
export const SYSTEM_LOGS = [
  { time: '10:43:01', level: 'INFO'  as const, message: 'Sync cycle completed. 247 accounts processed.' },
  { time: '10:42:58', level: 'WARN'  as const, message: 'Rate limit approaching: 847/1000 per minute.' },
  { time: '10:42:45', level: 'INFO'  as const, message: 'NHI detection pass complete. 29 non-human accounts flagged.' },
  { time: '10:41:12', level: 'ERROR' as const, message: 'Retry on scope groups:read — 429 Too Many Requests. Backing off 2s.' },
  { time: '10:40:03', level: 'INFO'  as const, message: 'OAuth token validated. Workspace: acme.slack.com' },
  { time: '10:39:55', level: 'INFO'  as const, message: 'Starting incremental sync. Last cursor: 1717600000.' },
  { time: '10:39:50', level: 'WARN'  as const, message: 'Stale token detected for user svc-deploy. Flagging for review.' },
]

// ─── Per-integration dashboard data ──────────────────────────────────────────

export interface DashboardData {
  supportsWebhook: boolean
  integrationName: string
  health: {
    status: 'Healthy' | 'Rate Limited' | 'Error'
    lastSync: string
    nextSync: string
    apiCallsUsed: number
    apiCallsTotal: number
    retryAfter: number
  }
  entityCounts: {
    accounts: { total: number; human: number; nhi: number }
    groups: number
    roles: number
    resources: number
    groupsLabel: string
    rolesLabel: string
    resourcesLabel: string
  }
  nhis: Array<{ name: string; type: 'Bot' | 'App' | 'Token'; lastActive: string; permLevel: 'Critical' | 'High' | 'Medium' | 'Low' }>
  riskBreakdown: Array<{ label: string; count: number; color: string; pct: number }>
  totalRisks: number
  remediationActions: Array<{ time: string; action: string; target: string; severity: 'Critical' | 'High' | 'Medium' | 'Low' }>
  integrationEvents: Array<{ time: string; iconName: string; iconColor: string; iconBg: string; title: string; detail: string }>
}

export const OKTA_DASHBOARD: DashboardData = {
  supportsWebhook: true,
  integrationName: 'Okta',
  health: {
    status: 'Healthy',
    lastSync: '8m ago',
    nextSync: 'in 3:52 hrs',
    apiCallsUsed: 3240,
    apiCallsTotal: 20000,
    retryAfter: 47,
  },
  entityCounts: {
    accounts:      { total: 1847, human: 1791, nhi: 56 },
    groups:        124,
    roles:         31,
    resources:     0,
    groupsLabel:   'Directory groups',
    rolesLabel:    'Admin roles',
    resourcesLabel: 'Apps assigned',
  },
  nhis: [
    { name: 'okta-provisioning-svc',  type: 'App'   as const, lastActive: '1 min ago',   permLevel: 'Critical' as const },
    { name: 'salesforce-sync-token',  type: 'Token' as const, lastActive: '3 hours ago', permLevel: 'High'     as const },
    { name: 'hr-onboarding-bot',      type: 'Bot'   as const, lastActive: '6 hours ago', permLevel: 'Medium'   as const },
    { name: 'audit-export-svc',       type: 'App'   as const, lastActive: '1 day ago',   permLevel: 'Low'      as const },
    { name: 'scim-provisioner-token', type: 'Token' as const, lastActive: '2 days ago',  permLevel: 'High'     as const },
  ],
  riskBreakdown: [
    { label: 'Critical', count: 14,  color: '#D6196B', pct: 4.1  },
    { label: 'High',     count: 41,  color: '#7C3AED', pct: 12.0 },
    { label: 'Medium',   count: 108, color: '#F5C842', pct: 31.7 },
    { label: 'Low',      count: 178, color: '#3B82F6', pct: 52.2 },
  ],
  totalRisks: 341,
  remediationActions: [
    { time: '09:51 AM', action: 'MFA Policy Violation',          target: 'contractor@partner.io',  severity: 'Critical' as const },
    { time: '09:44 AM', action: 'Dormant Admin Account',          target: 'former-it@acme.io',      severity: 'High'     as const },
    { time: '09:30 AM', action: 'Excessive App Assignments',      target: 'j.smith@acme.io',        severity: 'Medium'   as const },
    { time: '08:17 AM', action: 'Group Membership Anomaly',       target: 'dev-group-all@acme.io',  severity: 'Low'      as const },
    { time: '08:02 AM', action: 'Suspended User Retained Token',  target: 'svc-legacy@acme.io',     severity: 'High'     as const },
  ],
  integrationEvents: [
    { time: '09:52 AM', iconName: 'RefreshCw',     iconColor: 'text-blue-500',   iconBg: 'bg-blue-50',   title: 'Sync completed',                   detail: '1,847 accounts, 124 groups, and 31 roles are up to date.' },
    { time: '09:51 AM', iconName: 'AlertTriangle', iconColor: 'text-red-500',    iconBg: 'bg-red-50',    title: 'MFA bypass detected',               detail: 'contractor@partner.io authenticated without MFA. Flagged for review.' },
    { time: '09:30 AM', iconName: 'UserX',         iconColor: 'text-amber-600',  iconBg: 'bg-amber-50',  title: '56 Non-Human Identities detected',  detail: 'Service accounts, provisioning tokens, and sync bots identified.' },
    { time: '08:15 AM', iconName: 'Shield',        iconColor: 'text-purple-500', iconBg: 'bg-purple-50', title: 'Policy evaluation complete',         detail: '14 accounts flagged for excessive admin privileges.' },
    { time: '07:40 AM', iconName: 'UserCheck',     iconColor: 'text-green-600',  iconBg: 'bg-green-50',  title: 'Identity graph updated',            detail: 'Okta directory acme.okta.com fully re-mapped into Linx.' },
    { time: '07:38 AM', iconName: 'Info',          iconColor: 'text-slate-400',  iconBg: 'bg-slate-50',  title: 'Integration connected',             detail: 'OAuth authorization granted. Remediation scopes active.' },
  ],
}

export const GITHUB_DASHBOARD: DashboardData = {
  supportsWebhook: false,
  integrationName: 'GitHub',
  health: {
    status: 'Rate Limited',
    lastSync: '23m ago',
    nextSync: 'in 37m',
    apiCallsUsed: 4850,
    apiCallsTotal: 5000,
    retryAfter: 47,
  },
  entityCounts: {
    accounts:      { total: 312, human: 289, nhi: 23 },
    groups:        18,
    roles:         8,
    resources:     94,
    groupsLabel:   'Orgs & teams',
    rolesLabel:    'Permission levels',
    resourcesLabel: 'Repos accessed',
  },
  nhis: [
    { name: 'github-actions-deploy',  type: 'Bot'   as const, lastActive: '2 min ago',   permLevel: 'High'     as const },
    { name: 'dependabot-svc',         type: 'Bot'   as const, lastActive: '30 min ago',  permLevel: 'Medium'   as const },
    { name: 'ci-release-token',       type: 'Token' as const, lastActive: '1 hour ago',  permLevel: 'Critical' as const },
    { name: 'datadog-gh-integration', type: 'App'   as const, lastActive: '4 hours ago', permLevel: 'Medium'   as const },
    { name: 'codeclimate-token',      type: 'Token' as const, lastActive: '2 days ago',  permLevel: 'Low'      as const },
  ],
  riskBreakdown: [
    { label: 'Critical', count: 5,  color: '#D6196B', pct: 5.2  },
    { label: 'High',     count: 17, color: '#7C3AED', pct: 17.7 },
    { label: 'Medium',   count: 38, color: '#F5C842', pct: 39.6 },
    { label: 'Low',      count: 36, color: '#3B82F6', pct: 37.5 },
  ],
  totalRisks: 96,
  remediationActions: [
    { time: '10:01 AM', action: 'Secrets Exposed in Commit',    target: 'feat/payment-api (main)',  severity: 'Critical' as const },
    { time: '09:48 AM', action: 'Outside Collaborator Added',   target: 'acme/infra-private',       severity: 'High'     as const },
    { time: '09:22 AM', action: 'Dormant Admin Account',        target: 'former-dev@acme.io',       severity: 'Medium'   as const },
    { time: '08:44 AM', action: 'Stale Deploy Token Detected',  target: 'ci-release-token',         severity: 'High'     as const },
    { time: '08:11 AM', action: 'Branch Protection Disabled',   target: 'acme/backend-services',    severity: 'Medium'   as const },
  ],
  integrationEvents: [
    { time: '10:02 AM', iconName: 'AlertTriangle', iconColor: 'text-amber-600',  iconBg: 'bg-amber-50',  title: 'GitHub API rate limit hit',        detail: 'Linx is retrying after backoff. Sync paused temporarily.' },
    { time: '09:48 AM', iconName: 'RefreshCw',     iconColor: 'text-blue-500',   iconBg: 'bg-blue-50',   title: 'Partial sync completed',            detail: '312 accounts and 94 repositories indexed before rate limit.' },
    { time: '09:22 AM', iconName: 'UserX',         iconColor: 'text-red-500',    iconBg: 'bg-red-50',    title: '23 Non-Human Identities detected',  detail: 'GitHub Actions bots, deploy tokens, and OAuth apps identified.' },
    { time: '08:40 AM', iconName: 'Shield',        iconColor: 'text-purple-500', iconBg: 'bg-purple-50', title: 'Secrets scan completed',            detail: '1 exposed credential found in commit history. Flagged Critical.' },
    { time: '08:10 AM', iconName: 'UserCheck',     iconColor: 'text-green-600',  iconBg: 'bg-green-50',  title: 'Initial identity graph built',      detail: 'GitHub org acme mapped into Linx — 18 teams, 8 roles.' },
    { time: '08:08 AM', iconName: 'Info',          iconColor: 'text-slate-400',  iconBg: 'bg-slate-50',  title: 'Integration connected',             detail: 'GitHub App installed. Read-only access to all repositories confirmed.' },
  ],
}

export const SLACK_DASHBOARD: DashboardData = {
  integrationName: 'Slack',
  supportsWebhook: true,
  health: {
    status: 'Healthy',
    lastSync: '2 min ago',
    nextSync: 'in 3:58 hrs',
    apiCallsUsed: 847,
    apiCallsTotal: 10000,
    retryAfter: 47,
  },
  entityCounts: {
    accounts:      { total: 247, human: 218, nhi: 29 },
    groups:        38,
    roles:         12,
    resources:     156,
    groupsLabel:   'Channels & teams',
    rolesLabel:    'Privilege levels',
    resourcesLabel: 'Channels & apps',
  },
  nhis: [
    { name: 'github-actions-bot',  type: 'Bot'   as const, lastActive: '2 hours ago',  permLevel: 'High'     as const },
    { name: 'zapier-integration',  type: 'App'   as const, lastActive: '14 hours ago', permLevel: 'Medium'   as const },
    { name: 'datadog-monitor',     type: 'App'   as const, lastActive: '5 min ago',    permLevel: 'High'     as const },
    { name: 'ci-deploy-token',     type: 'Token' as const, lastActive: '1 day ago',    permLevel: 'Critical' as const },
    { name: 'slack-export-bot',    type: 'Bot'   as const, lastActive: '3 days ago',   permLevel: 'Medium'   as const },
  ],
  riskBreakdown: [
    { label: 'Critical', count: 8,   color: '#D6196B', pct: 3.3  },
    { label: 'High',     count: 23,  color: '#7C3AED', pct: 9.6  },
    { label: 'Medium',   count: 67,  color: '#F5C842', pct: 27.9 },
    { label: 'Low',      count: 142, color: '#3B82F6', pct: 59.2 },
  ],
  totalRisks: 240,
  remediationActions: [
    { time: '10:42 AM', action: 'Account Suspended',            target: 'bot@slack-workspace.com',   severity: 'High'     as const },
    { time: '10:38 AM', action: 'Excessive Privileges Flagged', target: 'john.doe@company.com',      severity: 'Medium'   as const },
    { time: '09:15 AM', action: 'Dormant Account Flagged',      target: 'contractor-42@acme.io',     severity: 'Low'      as const },
    { time: '08:50 AM', action: 'MFA Bypass Detected',          target: 'svc-deploy@company.com',    severity: 'Critical' as const },
    { time: '08:22 AM', action: 'Group Membership Changed',     target: 'alice@company.com',         severity: 'Low'      as const },
  ],
  integrationEvents: [
    { time: '10:43 AM', iconName: 'RefreshCw',     iconColor: 'text-blue-500',   iconBg: 'bg-blue-50',   title: 'Sync completed',                   detail: '247 accounts, 38 channels, and 12 privilege levels are up to date.' },
    { time: '10:42 AM', iconName: 'AlertTriangle', iconColor: 'text-red-500',    iconBg: 'bg-red-50',    title: 'Account suspended',                detail: 'bot@slack-workspace.com suspended — stale OAuth app with admin scope.' },
    { time: '10:42 AM', iconName: 'UserX',         iconColor: 'text-amber-600',  iconBg: 'bg-amber-50',  title: '29 Non-Human Identities detected',  detail: 'Bots, OAuth apps, and API tokens identified across workspace.' },
    { time: '08:50 AM', iconName: 'Shield',        iconColor: 'text-purple-500', iconBg: 'bg-purple-50', title: 'MFA bypass detected',               detail: 'svc-deploy@company.com authenticated without MFA. Flagged for review.' },
    { time: '08:22 AM', iconName: 'UserCheck',     iconColor: 'text-green-600',  iconBg: 'bg-green-50',  title: 'Identity graph updated',            detail: 'Slack workspace acme.slack.com fully mapped into Linx.' },
    { time: '08:20 AM', iconName: 'Info',          iconColor: 'text-slate-400',  iconBg: 'bg-slate-50',  title: 'Integration connected',             detail: 'OAuth authorization granted. Read-only access to workspace confirmed.' },
  ],
}

export const DASHBOARD_BY_ID: Record<string, DashboardData> = {
  okta:   OKTA_DASHBOARD,
  github: GITHUB_DASHBOARD,
  slack:  SLACK_DASHBOARD,
}
