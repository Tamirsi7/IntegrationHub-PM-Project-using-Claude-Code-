import { Users, Network, Key, Database } from 'lucide-react'
import { OffsetCard } from '@/components/ui/OffsetCard'
import { type DashboardData } from '@/data/mockData'

interface EntityCountersProps {
  data: DashboardData
}

export function EntityCounters({ data }: EntityCountersProps) {
  const { entityCounts: ec } = data

  const CARDS = [
    {
      icon: Users,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      label: 'Accounts',
      value: ec.accounts.total,
      sub: (
        <>
          <span className="text-slate-400">{ec.accounts.human} Human</span>
          {' · '}
          <span className="font-semibold text-amber-600">{ec.accounts.nhi} NHI</span>
        </>
      ),
    },
    {
      icon: Network,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      label: 'Groups',
      value: ec.groups,
      sub: <span className="text-slate-400">{ec.groupsLabel}</span>,
    },
    {
      icon: Key,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      label: 'Roles',
      value: ec.roles,
      sub: <span className="text-slate-400">{ec.rolesLabel}</span>,
    },
    {
      icon: Database,
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-600',
      label: 'Resources',
      value: ec.resources,
      sub: <span className="text-slate-400">{ec.resourcesLabel}</span>,
    },
  ] as const

  return (
    <div className="grid grid-cols-4 gap-4">
      {CARDS.map((card) => {
        const Icon = card.icon
        return (
          <OffsetCard key={card.label} className="flex flex-col items-center gap-3 text-center">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconBg}`}>
              <Icon size={18} className={card.iconColor} />
            </div>
            <div>
              <div className="text-4xl font-black tabular-nums text-slate-900">{card.value}</div>
              <div className="mt-0.5 text-sm font-semibold text-slate-700">{card.label}</div>
              <div className="mt-0.5 text-xs">{card.sub}</div>
            </div>
          </OffsetCard>
        )
      })}
    </div>
  )
}
