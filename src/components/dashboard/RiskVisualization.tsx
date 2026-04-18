import { ShieldAlert } from 'lucide-react'
import { OffsetCard } from '@/components/ui/OffsetCard'
import { type DashboardData } from '@/data/mockData'

const RADIUS = 60
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

interface RiskVisualizationProps {
  data: DashboardData
}

function RiskDonut({ riskBreakdown, totalRisks }: { riskBreakdown: DashboardData['riskBreakdown']; totalRisks: number }) {
  const sorted = [...riskBreakdown].sort((a, b) => b.count - a.count)
  let offset = 0

  return (
    <div className="relative flex items-center justify-center">
      <svg width="160" height="160" viewBox="0 0 160 160" className="-rotate-90">
        <circle cx="80" cy="80" r={RADIUS} fill="none" stroke="#F1F5F9" strokeWidth="22" />
        {sorted.map((seg) => {
          const length = (seg.count / totalRisks) * CIRCUMFERENCE
          const adjustedLength = Math.max(0, length - 3)
          const dashOffset = -offset
          const circle = (
            <circle
              key={seg.label}
              cx="80" cy="80" r={RADIUS}
              fill="none"
              stroke={seg.color}
              strokeWidth="22"
              strokeDasharray={`${adjustedLength} ${CIRCUMFERENCE - adjustedLength}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="butt"
              style={{ transition: 'stroke-dasharray 0.6s ease-out' }}
            />
          )
          offset += length
          return circle
        })}
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-black text-slate-900 tabular-nums">{totalRisks}</span>
        <span className="text-[10px] font-medium text-slate-400">risks</span>
      </div>
    </div>
  )
}

export function RiskVisualization({ data }: RiskVisualizationProps) {
  const { riskBreakdown, totalRisks } = data
  const criticalCount = riskBreakdown.find(r => r.label === 'Critical')?.count ?? 0

  return (
    <OffsetCard className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <ShieldAlert size={16} style={{ color: '#D6196B' }} />
        <h3 className="text-sm font-bold text-slate-900">Risk Breakdown</h3>
        <span className="ml-auto rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ background: '#fce7f3', color: '#D6196B' }}>
          {totalRisks} total
        </span>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex-shrink-0">
          <RiskDonut riskBreakdown={riskBreakdown} totalRisks={totalRisks} />
        </div>

        <div className="flex-1">
          <div className="flex flex-col gap-2.5">
            {riskBreakdown.map((seg) => (
              <div
                key={seg.label}
                className="group flex flex-col gap-1 rounded-lg px-2 py-1.5 -mx-2 transition-colors cursor-default hover:bg-slate-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2.5 w-2.5 flex-shrink-0 rounded-full transition-transform duration-150 group-hover:scale-125"
                      style={{ backgroundColor: seg.color }}
                    />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{seg.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold tabular-nums transition-colors group-hover:text-slate-900" style={{ color: seg.color }}>
                      {seg.count}
                    </span>
                    <span className="w-10 text-right font-mono text-xs text-slate-400">
                      {seg.pct}%
                    </span>
                  </div>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${seg.pct}%`, backgroundColor: seg.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg border p-3" style={{ background: '#fdf2f8', borderColor: '#f9a8d4' }}>
            <p className="text-xs" style={{ color: '#9d174d' }}>
              <span className="font-bold">{criticalCount} Critical risks</span> require immediate attention.
              Most stem from NHI excessive privileges.
            </p>
          </div>
        </div>
      </div>
    </OffsetCard>
  )
}
