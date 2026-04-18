import { AlertTriangle, Bot, Puzzle, Key, ExternalLink } from 'lucide-react'
import { OffsetCard } from '@/components/ui/OffsetCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EntityBadge } from '@/components/ui/EntityBadge'
import { type DashboardData } from '@/data/mockData'

const TYPE_ICONS = {
  Bot:   Bot,
  App:   Puzzle,
  Token: Key,
} as const

const PERM_VARIANTS = {
  Critical: 'critical',
  High:     'high',
  Medium:   'medium',
  Low:      'low',
} as const

interface NHIHighlightProps {
  data: DashboardData
}

export function NHIHighlight({ data }: NHIHighlightProps) {
  const nhis = data.nhis

  return (
    <OffsetCard shadowVariant="yellow" padding="p-0" className="flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-linx-yellow/30 bg-amber-50 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} className="text-amber-600" />
          <span className="text-sm font-bold text-slate-900">Non-Human Identities</span>
        </div>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800">
          {nhis.length}
        </span>
      </div>

      {/* NHI list */}
      <div className="flex flex-col divide-y divide-slate-100">
        {nhis.map((nhi) => {
          const Icon = TYPE_ICONS[nhi.type]
          return (
            <div
              key={nhi.name}
              className="group flex items-center gap-3 px-5 py-3 transition-colors hover:bg-amber-50/50"
            >
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 group-hover:bg-amber-100 group-hover:text-amber-700 transition-colors">
                <Icon size={13} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="truncate font-mono text-xs font-medium text-slate-800">
                    {nhi.name}
                  </span>
                  <EntityBadge type={nhi.type} />
                </div>
                <span className="text-[10px] text-slate-400">{nhi.lastActive}</span>
              </div>
              <StatusBadge
                variant={PERM_VARIANTS[nhi.permLevel]}
                showDot={false}
                className="flex-shrink-0 text-[10px]"
              >
                {nhi.permLevel}
              </StatusBadge>
            </div>
          )
        })}
      </div>

      {/* Footer CTA */}
      <div className="border-t border-linx-yellow/30 p-4">
        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white shadow-offset transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none">
          <ExternalLink size={14} />
          Investigate NHIs
        </button>
      </div>
    </OffsetCard>
  )
}
