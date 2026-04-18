import { useState } from 'react'
import { ArrowRight, Settings2, Check } from 'lucide-react'

const WORKSPACES = [
  { id: 'acme-main',    label: 'acme.slack.com',         desc: 'Primary workspace · 247 members' },
  { id: 'acme-eng',     label: 'acme-eng.slack.com',     desc: 'Engineering workspace · 89 members' },
  { id: 'acme-staging', label: 'acme-staging.slack.com', desc: 'Staging / test workspace · 12 members' },
]

interface Toggle {
  id: string
  label: string
  description: string
  default: boolean
}

const TOGGLES: Toggle[] = [
  { id: 'exclude_guests',   label: 'Exclude Guest Accounts',   description: 'Skip single-channel guest users from identity mapping', default: false },
  { id: 'ignore_private',   label: 'Ignore Private Channels',  description: 'Do not ingest private channel membership or metadata', default: false },
  { id: 'skip_deactivated', label: 'Skip Deactivated Accounts', description: 'Exclude accounts already deactivated in Slack',       default: true  },
  { id: 'bots_only_nhi',   label: 'Tag Bots as NHI Only',     description: 'Surface bot users exclusively as Non-Human Identities', default: true  },
]

interface Step3ConfigProps {
  onNext: () => void
  onBack: () => void
}

export function Step3Config({ onNext, onBack }: Step3ConfigProps) {
  const [selectedWorkspaces, setSelectedWorkspaces] = useState<Set<string>>(
    new Set(['acme-main']),
  )
  const [toggles, setToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(TOGGLES.map((t) => [t.id, t.default])),
  )

  function toggleWorkspace(id: string) {
    setSelectedWorkspaces((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        if (next.size > 1) next.delete(id) // keep at least one selected
      } else {
        next.add(id)
      }
      return next
    })
  }

  function toggleSetting(id: string) {
    setToggles((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="flex min-h-[500px] flex-col gap-6 py-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-slate-900">
          <Settings2 size={20} className="text-linx-purple" />
          <h2 className="text-lg font-bold">Configure Data Scope</h2>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Choose which workspaces to sync and fine-tune what Linx ingests. You can update these
          settings anytime from the integration dashboard.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left — Workspace selection */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Workspaces to sync
          </p>
          <div className="flex flex-col gap-2">
            {WORKSPACES.map((ws) => {
              const isSelected = selectedWorkspaces.has(ws.id)
              return (
                <button
                  key={ws.id}
                  onClick={() => toggleWorkspace(ws.id)}
                  className={`flex items-start gap-3 rounded-xl border-2 p-3.5 text-left transition-all duration-150 ${
                    isSelected
                      ? 'border-slate-900 bg-slate-900'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {/* Checkbox */}
                  <div className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border-2 transition-colors ${
                    isSelected ? 'border-white bg-white' : 'border-slate-300 bg-white'
                  }`}>
                    {isSelected && <Check size={10} className="text-slate-900" />}
                  </div>
                  <div>
                    <div className={`text-sm font-semibold font-mono ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                      {ws.label}
                    </div>
                    <div className={`text-xs mt-0.5 ${isSelected ? 'text-white/60' : 'text-slate-400'}`}>
                      {ws.desc}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right — Exclusion toggles */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Exclusions &amp; filters
          </p>
          <div className="flex flex-col gap-2">
            {TOGGLES.map((t) => {
              const isOn = toggles[t.id]
              return (
                <div
                  key={t.id}
                  className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-800">{t.label}</div>
                    <div className="mt-0.5 text-xs text-slate-400">{t.description}</div>
                  </div>
                  {/* Toggle switch */}
                  <button
                    onClick={() => toggleSetting(t.id)}
                    className={`relative flex-shrink-0 mt-0.5 h-5 w-9 rounded-full transition-colors duration-200 ${
                      isOn ? 'bg-slate-900' : 'bg-slate-200'
                    }`}
                    aria-checked={isOn}
                    role="switch"
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        isOn ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Summary footer */}
      <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs text-slate-500">
        Syncing <span className="font-semibold text-slate-700">{selectedWorkspaces.size} workspace{selectedWorkspaces.size > 1 ? 's' : ''}</span>{' '}
        with <span className="font-semibold text-slate-700">{Object.values(toggles).filter(Boolean).length} filter{Object.values(toggles).filter(Boolean).length !== 1 ? 's' : ''}</span> active.
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
          onClick={onNext}
          className="group flex items-center gap-2 rounded-xl bg-linx-orange px-6 py-3 text-sm font-semibold text-white shadow-offset-orange transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-offset active:shadow-none"
        >
          Start Sync
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  )
}
