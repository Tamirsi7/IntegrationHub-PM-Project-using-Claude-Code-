import { useState } from 'react'
import { ShieldCheck, ArrowRight, Eye, Zap, Info } from 'lucide-react'

// Neutral badge types — no traffic-light colors, no "red" for write scopes
const DATA_BADGES = {
  'Data: Read':    'bg-slate-100 text-slate-600 border-slate-200',
  'Action: Write': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Workspace: Read': 'bg-slate-100 text-slate-600 border-slate-200',
} as const

type BadgeType = keyof typeof DATA_BADGES

const VISIBILITY_SCOPES = [
  { scope: 'users:read',         description: 'List all workspace members and their profile data',           badge: 'Data: Read'      as BadgeType },
  { scope: 'users.profile:read', description: 'Read display name, email address, and status',               badge: 'Data: Read'      as BadgeType },
  { scope: 'groups:read',        description: 'View private channels the authorizing user is a member of',  badge: 'Data: Read'      as BadgeType },
  { scope: 'channels:read',      description: 'List all public channels in the workspace',                  badge: 'Data: Read'      as BadgeType },
  { scope: 'team:read',          description: 'Access workspace name, domain, and icon',                    badge: 'Workspace: Read' as BadgeType },
]

const REMEDIATION_SCOPES = [
  ...VISIBILITY_SCOPES,
  { scope: 'users.profile:write', description: 'Update user profile fields (used to tag suspended accounts)', badge: 'Action: Write' as BadgeType },
  { scope: 'channels:manage',     description: 'Remove members from channels during remediation workflows',   badge: 'Action: Write' as BadgeType },
]

export type IntegrationMode = 'visibility' | 'remediation'

interface Step2PermissionsProps {
  onNext: (mode: IntegrationMode) => void
  onBack: () => void
  initialMode?: IntegrationMode
}

export function Step2Permissions({ onNext, onBack, initialMode = 'visibility' }: Step2PermissionsProps) {
  const [mode, setMode] = useState<IntegrationMode>(initialMode)
  const scopes = mode === 'visibility' ? VISIBILITY_SCOPES : REMEDIATION_SCOPES

  return (
    <div className="flex min-h-[500px] flex-col gap-5 py-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-slate-900">
          <ShieldCheck size={20} className="text-linx-purple" />
          <h2 className="text-lg font-bold">Review Access Permissions</h2>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          These are the minimum permissions needed to build your identity graph — bringing you
          one step closer to complete visibility over who has access to what, and eliminating
          permission sprawl before it becomes a risk.
        </p>
      </div>

      {/* Mode selection cards */}
      <div>
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400">Choose integration mode</p>
        <div className="grid grid-cols-2 gap-3">
          {/* Visibility Mode */}
          <button
            onClick={() => setMode('visibility')}
            className={`group flex flex-col gap-2 rounded-xl border-2 p-4 text-left transition-all duration-200 ${
              mode === 'visibility'
                ? 'border-slate-900 bg-slate-900 shadow-offset'
                : 'border-slate-200 bg-white hover:border-slate-400 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${mode === 'visibility' ? 'bg-white/10' : 'bg-blue-100'}`}>
                <Eye size={14} className={mode === 'visibility' ? 'text-white' : 'text-blue-600'} />
              </div>
              <span className={`text-sm font-bold ${mode === 'visibility' ? 'text-white' : 'text-slate-900'}`}>
                Visibility Mode
              </span>
              {mode === 'visibility' && (
                <span className="ml-auto rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white">
                  Default
                </span>
              )}
            </div>
            <p className={`text-xs leading-relaxed ${mode === 'visibility' ? 'text-white/70' : 'text-slate-500'}`}>
              Read-only access. Linx maps all identities, permissions, and groups — without any ability to change your workspace.
            </p>
            <div className={`mt-1 rounded-lg px-2.5 py-1.5 text-[10px] font-medium ${mode === 'visibility' ? 'bg-white/10 text-white/80' : 'bg-slate-50 text-slate-500'}`}>
              5 scopes · Read-only
            </div>
          </button>

          {/* Active Remediation Mode */}
          <button
            onClick={() => setMode('remediation')}
            className={`group flex flex-col gap-2 rounded-xl border-2 p-4 text-left transition-all duration-200 ${
              mode === 'remediation'
                ? 'border-linx-purple bg-linx-purple shadow-offset'
                : 'border-slate-200 bg-white hover:border-slate-400 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${mode === 'remediation' ? 'bg-white/10' : 'bg-purple-100'}`}>
                <Zap size={14} className={mode === 'remediation' ? 'text-white' : 'text-purple-600'} />
              </div>
              <span className={`text-sm font-bold ${mode === 'remediation' ? 'text-white' : 'text-slate-900'}`}>
                Active Remediation
              </span>
              {mode === 'remediation' && (
                <span className="ml-auto rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white">
                  Recommended
                </span>
              )}
            </div>
            <p className={`text-xs leading-relaxed ${mode === 'remediation' ? 'text-white/70' : 'text-slate-500'}`}>
              Includes write scopes so your team can suspend accounts, revoke access, and execute remediations directly from the Linx dashboard.
            </p>
            <div className={`mt-1 rounded-lg px-2.5 py-1.5 text-[10px] font-medium ${mode === 'remediation' ? 'bg-white/10 text-white/80' : 'bg-purple-50 text-purple-700'}`}>
              7 scopes · Read + Write actions
            </div>
          </button>
        </div>
      </div>

      {/* Scopes block */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
        <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="font-mono text-xs text-slate-500"># slack · oauth2 · {mode === 'visibility' ? 'read-only' : 'read + write'}</span>
          <span className="rounded border border-slate-700 px-2 py-0.5 font-mono text-[10px] text-slate-400">
            {scopes.length} scopes
          </span>
        </div>
        <div className="flex flex-col gap-3">
          {scopes.map((s) => (
            <div key={s.scope} className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-500 mt-1.5" />
                <div className="min-w-0">
                  <span className="block font-mono text-xs font-semibold text-linx-yellow">
                    {s.scope}
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-slate-400">
                    {s.description}
                  </span>
                </div>
              </div>
              <span className={`flex-shrink-0 inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-medium ${DATA_BADGES[s.badge]}`}>
                {s.badge}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Assurance bar */}
      <div className="flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 p-3.5">
        <Info size={13} className="mt-0.5 flex-shrink-0 text-blue-500" />
        <p className="text-xs leading-relaxed text-blue-700">
          <span className="font-semibold">Your workspace data stays in your Linx tenant.</span>{' '}
          It is never shared with third parties. Write scopes (Active Remediation mode) are only
          invoked when a remediation workflow is explicitly triggered by your team.
        </p>
      </div>

      {/* CTA bar */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
        <button
          onClick={onBack}
          className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
        >
          ← Back
        </button>
        <button
          onClick={() => onNext(mode)}
          className="group flex items-center gap-2 rounded-xl bg-linx-orange px-6 py-3 text-sm font-semibold text-white shadow-offset-orange transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-offset active:shadow-none"
        >
          Authorize &amp; Continue
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  )
}
