import slackIcon from '@/assets/icons/slack.png'
import oktaIcon from '@/assets/icons/okta.png'
import githubIcon from '@/assets/icons/github.png'
import googleWsIcon from '@/assets/icons/google-ws.png'
import azureIcon from '@/assets/icons/azure.png'
import awsIcon from '@/assets/icons/aws.png'
import salesforceIcon from '@/assets/icons/salesforce.png'
import workdayIcon from '@/assets/icons/workday.png'
import datadogIcon from '@/assets/icons/datadog.png'
import pagerdutyIcon from '@/assets/icons/pagerduty.png'
import atlassianIcon from '@/assets/icons/atlassian.png'
import bamboohrIcon from '@/assets/icons/bamboohr.png'

export type IntegrationCategory =
  | 'HR'
  | 'Engineering'
  | 'Security'
  | 'Productivity'
  | 'CRM'
  | 'Infrastructure'
  | 'Identity'

export type RemediationCapability = 'visibility-only' | 'one-click-remediation'

export type ConnectionStatus = 'connected' | 'not-connected' | 'coming-soon'

export type IntegrationHealth = 'healthy' | 'rate-limited' | 'error' | 'syncing'

export interface Integration {
  id: string
  name: string
  tagline: string
  category: IntegrationCategory
  icon: string
  remediationCapability: RemediationCapability
  connectionStatus: ConnectionStatus
  health?: IntegrationHealth
  lastSynced?: string
  syncedCount?: number
  isNew?: boolean
  requestCount?: number
}

export const INTEGRATIONS: Integration[] = [
  // --- CONNECTED ---
  {
    id: 'slack',
    name: 'Slack',
    tagline: 'Workspace & Collaboration',
    category: 'Productivity',
    icon: slackIcon,
    remediationCapability: 'visibility-only',
    connectionStatus: 'not-connected',
  },
  {
    id: 'okta',
    name: 'Okta',
    tagline: 'Identity Provider',
    category: 'Identity',
    icon: oktaIcon,
    remediationCapability: 'one-click-remediation',
    connectionStatus: 'connected',
    health: 'healthy',
    lastSynced: '8m ago',
    syncedCount: 1847,
  },
  {
    id: 'github',
    name: 'GitHub',
    tagline: 'Source Control & DevOps',
    category: 'Engineering',
    icon: githubIcon,
    remediationCapability: 'visibility-only',
    connectionStatus: 'connected',
    health: 'rate-limited',
    lastSynced: '23m ago',
    syncedCount: 312,
  },

  // --- NOT CONNECTED ---
  {
    id: 'google-workspace',
    name: 'Google Workspace',
    tagline: 'Productivity Suite & Directory',
    category: 'Productivity',
    icon: googleWsIcon,
    remediationCapability: 'one-click-remediation',
    connectionStatus: 'not-connected',
    isNew: true,
  },
  {
    id: 'azure-ad',
    name: 'Azure AD / Entra',
    tagline: 'Microsoft Identity Platform',
    category: 'Identity',
    icon: azureIcon,
    remediationCapability: 'one-click-remediation',
    connectionStatus: 'not-connected',
  },
  {
    id: 'aws-iam',
    name: 'AWS IAM',
    tagline: 'Cloud Access Management',
    category: 'Infrastructure',
    icon: awsIcon,
    remediationCapability: 'visibility-only',
    connectionStatus: 'not-connected',
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    tagline: 'CRM & Sales Platform',
    category: 'CRM',
    icon: salesforceIcon,
    remediationCapability: 'one-click-remediation',
    connectionStatus: 'not-connected',
  },
  {
    id: 'workday',
    name: 'Workday',
    tagline: 'HR & People Management',
    category: 'HR',
    icon: workdayIcon,
    remediationCapability: 'visibility-only',
    connectionStatus: 'not-connected',
  },
  {
    id: 'datadog',
    name: 'Datadog',
    tagline: 'Observability & Monitoring',
    category: 'Infrastructure',
    icon: datadogIcon,
    remediationCapability: 'visibility-only',
    connectionStatus: 'not-connected',
  },
  {
    id: 'pagerduty',
    name: 'PagerDuty',
    tagline: 'Incident Management',
    category: 'Security',
    icon: pagerdutyIcon,
    remediationCapability: 'visibility-only',
    connectionStatus: 'not-connected',
  },
  {
    id: 'atlassian',
    name: 'Atlassian / Jira',
    tagline: 'Project & Issue Tracking',
    category: 'Engineering',
    icon: atlassianIcon,
    remediationCapability: 'visibility-only',
    connectionStatus: 'not-connected',
  },

  // --- COMING SOON ---
  {
    id: 'bamboohr',
    name: 'BambooHR',
    tagline: 'HR Information System',
    category: 'HR',
    icon: bamboohrIcon,
    remediationCapability: 'visibility-only',
    connectionStatus: 'coming-soon',
    requestCount: 143,
  },
]

export const GALLERY_STATS = {
  connected: INTEGRATIONS.filter(i => i.connectionStatus === 'connected').length,
  available: INTEGRATIONS.filter(i => i.connectionStatus === 'not-connected').length,
  comingSoon: INTEGRATIONS.filter(i => i.connectionStatus === 'coming-soon').length,
  categories: [...new Set(INTEGRATIONS.map(i => i.category))].length,
}

export const ALL_CATEGORIES: IntegrationCategory[] = [
  'HR',
  'Engineering',
  'Security',
  'Productivity',
  'CRM',
  'Infrastructure',
  'Identity',
]

export const CATEGORY_STYLES: Record<IntegrationCategory, string> = {
  HR:             'bg-pink-50 text-pink-700 border-pink-200',
  Engineering:    'bg-slate-100 text-slate-600 border-slate-200',
  Security:       'bg-red-50 text-red-700 border-red-200',
  Productivity:   'bg-blue-50 text-blue-700 border-blue-200',
  CRM:            'bg-cyan-50 text-cyan-700 border-cyan-200',
  Infrastructure: 'bg-orange-50 text-orange-700 border-orange-200',
  Identity:       'bg-purple-50 text-purple-700 border-purple-200',
}
