import { useState } from 'react'
import { Activity, RefreshCw, UserCheck, UserX, AlertTriangle, Shield, Info, Zap, Lock } from 'lucide-react'
import { OffsetCard } from '@/components/ui/OffsetCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { type IntegrationMode } from '@/components/integration/Step2Permissions'
import { type DashboardData } from '@/data/mockData'

type Tab = 'remediation' | 'events'

const SEVERITY_VARIANTS = {
  Critical: 'critical',
  High:     'high',
  Medium:   'medium',
  Low:      'low',
} as const

const ICON_MAP = {
  RefreshCw,
  AlertTriangle,
  UserX,
  Shield,
  UserCheck,
  Info,
} as const

interface ActivityLogProps {
  mode: IntegrationMode
  data: DashboardData
}

export function ActivityLog({ mode, data }: ActivityLogProps) {
  const [tab, setTab] = useState<Tab>('remediation')

  return (
    <OffsetCard padding="p-0" className="overflow-hidden">
      {/* Tab bar */}
      <div className="flex items-center gap-0 border-b border-slate-200 px-5">
        {([
          { id: 'remediation' as Tab, label: 'Remediation Actions', icon: Activity },
          { id: 'events'      as Tab, label: 'Integration Events',  icon: RefreshCw },
        ] as const).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 border-b-2 px-4 py-3.5 text-sm font-medium transition-colors ${
              tab === id
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Remediation tab */}
      {tab === 'remediation' && (
        <div className="divide-y divide-slate-100">
          {mode === 'visibility' && (
            <div className="mx-5 my-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-100">
                  <Lock size={15} className="text-amber-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-amber-900">3 suspended IdP accounts still have active sessions</span>
                    <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-800">Visibility Mode</span>
                  </div>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    Linx detected accounts suspended in your IdP that retain full access. In <span className="font-semibold">Active Remediation Mode</span>, you can revoke their sessions in one click.
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <button className="flex items-center gap-1.5 rounded-lg bg-amber-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-amber-800">
                      <Zap size={12} />
                      Enable 1-Click Remediation
                    </button>
                    <span className="text-[11px] text-amber-600">Adds write scopes · Takes &lt;2 min</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {data.remediationActions.map((action, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-slate-50"
            >
              <span className="w-16 flex-shrink-0 font-mono text-xs text-slate-400">{action.time}</span>
              <span className="min-w-[200px] flex-shrink-0 text-sm font-medium text-slate-800">{action.action}</span>
              <span className="flex-1 truncate font-mono text-sm text-slate-500">{action.target}</span>
              <StatusBadge
                variant={SEVERITY_VARIANTS[action.severity]}
                showDot={false}
                className="flex-shrink-0 text-[10px]"
              >
                {action.severity}
              </StatusBadge>
            </div>
          ))}
        </div>
      )}

      {/* Integration Events tab */}
      {tab === 'events' && (
        <div className="divide-y divide-slate-100">
          {data.integrationEvents.map((event, i) => {
            const Icon = ICON_MAP[event.iconName as keyof typeof ICON_MAP] ?? Info
            return (
              <div
                key={i}
                className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-slate-50"
              >
                <div className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${event.iconBg}`}>
                  <Icon size={14} className={event.iconColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-slate-800">{event.title}</span>
                  <p className="mt-0.5 text-xs text-slate-500">{event.detail}</p>
                </div>
                <span className="flex-shrink-0 font-mono text-xs text-slate-400 pt-0.5">{event.time}</span>
              </div>
            )
          })}
        </div>
      )}
    </OffsetCard>
  )
}
