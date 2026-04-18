import { HealthMetrics } from './HealthMetrics'
import { EntityCounters } from './EntityCounters'
import { NHIHighlight } from './NHIHighlight'
import { RiskVisualization } from './RiskVisualization'
import { ActivityLog } from './ActivityLog'
import { type IntegrationMode } from '@/components/integration/Step2Permissions'
import { type DashboardData } from '@/data/mockData'

interface DashboardProps {
  mode: IntegrationMode
  data: DashboardData
}

export function Dashboard({ mode, data }: DashboardProps) {
  return (
    <div className="flex flex-col gap-5">
      <HealthMetrics mode={mode} data={data} />
      <EntityCounters data={data} />
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2">
          <RiskVisualization data={data} />
        </div>
        <div className="col-span-1">
          <NHIHighlight data={data} />
        </div>
      </div>
      <ActivityLog mode={mode} data={data} />
    </div>
  )
}
