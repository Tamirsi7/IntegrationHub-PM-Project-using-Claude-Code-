import { useEffect, useRef, useState } from 'react'
import { RefreshCw, Clock, Zap, Eye, Settings2 } from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { OffsetCard } from '@/components/ui/OffsetCard'
import { SyncSettingsModal } from './SyncSettingsModal'
import { type IntegrationMode } from '@/components/integration/Step2Permissions'
import { type DashboardData } from '@/data/mockData'

interface HealthMetricsProps {
  mode: IntegrationMode
  data: DashboardData
}

export function HealthMetrics({ mode, data }: HealthMetricsProps) {
  const metrics = data.health
  const pct = (metrics.apiCallsUsed / metrics.apiCallsTotal) * 100
  const barColor =
    pct > 85 ? 'bg-red-500' : pct > 60 ? 'bg-amber-400' : 'bg-green-500'

  const [simStatus, setSimStatus] = useState<'Healthy' | 'Rate Limited'>(
    metrics.status === 'Rate Limited' ? 'Rate Limited' : 'Healthy',
  )
  const [retryAfter, setRetryAfter] = useState(metrics.retryAfter)
  const [showSyncSettings, setShowSyncSettings] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const hasStarted = useRef(false)

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    hasStarted.current = false
    setSimStatus(metrics.status === 'Rate Limited' ? 'Rate Limited' : 'Healthy')
    setRetryAfter(metrics.retryAfter)
  }, [metrics])

  useEffect(() => {
    if (simStatus !== 'Rate Limited') {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    if (hasStarted.current) return
    hasStarted.current = true
    intervalRef.current = setInterval(() => {
      setRetryAfter((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!)
          setSimStatus('Healthy')
          hasStarted.current = false
          return metrics.retryAfter
        }
        return prev - 1
      })
    }, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [simStatus, metrics.retryAfter])

  const isRateLimited = simStatus === 'Rate Limited'

  return (
    <>
    <OffsetCard
      padding="p-0"
      className={`overflow-hidden transition-colors duration-500 ${isRateLimited ? 'border-amber-400 shadow-offset-yellow' : ''}`}
    >
      {isRateLimited && (
        <div className="flex items-center gap-2 bg-amber-50 px-5 py-2 border-b border-amber-200">
          <Zap size={12} className="text-amber-600 flex-shrink-0" />
          <p className="text-xs font-medium text-amber-700">
            {data.integrationName}'s per-method rate limit reached — Linx will auto-retry.{' '}
            <span className="font-mono font-bold">Retry-After: {retryAfter}s</span>
          </p>
        </div>
      )}

      {/* Two-row layout so everything fits without overflow */}
      <div className="flex flex-col gap-0 px-5 py-3">
        {/* Row 1: Name · Status · Mode · Trigger button */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
          <span className="text-xs font-bold text-slate-900">{data.integrationName}</span>

          <div className="h-4 w-px bg-slate-200" />

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Status</span>
            <StatusBadge variant={isRateLimited ? 'rate-limited' : 'healthy'}>
              {isRateLimited ? 'Rate Limited' : 'Healthy'}
            </StatusBadge>
          </div>

          <div className="h-4 w-px bg-slate-200" />

          <div className="flex items-center gap-1.5">
            <Eye size={12} className="text-slate-400" />
            <span className="text-[11px] text-slate-400">Mode:</span>
            {mode === 'visibility' ? (
              <span className="inline-flex items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                Visibility (Read-Only)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-md border border-purple-200 bg-purple-50 px-2 py-0.5 text-[11px] font-semibold text-purple-700">
                Active Remediation
              </span>
            )}
          </div>

          {!isRateLimited && (
            <>
              <div className="h-4 w-px bg-slate-200" />
              <button
                onClick={() => {
                  hasStarted.current = false
                  setSimStatus('Rate Limited')
                }}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-500 shadow-sm transition-colors hover:border-slate-300 hover:text-slate-900"
              >
                Trigger API Throttle
              </button>
            </>
          )}

          <div className="h-4 w-px bg-slate-200" />
          <button
            onClick={() => setShowSyncSettings(true)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-500 shadow-sm transition-colors hover:border-slate-300 hover:text-slate-900"
          >
            <Settings2 size={11} />
            Configure Sync
          </button>
        </div>

        {/* Row 2: Last sync · Next sync · API calls bar — stretched full width */}
        <div className="mt-2 flex w-full items-center gap-4">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Clock size={12} className="text-slate-400" />
            <span className="text-[11px] text-slate-400">Last sync:</span>
            <span className="text-[11px] font-semibold text-slate-700">{metrics.lastSync}</span>
          </div>

          <div className="h-4 w-px bg-slate-200 flex-shrink-0" />

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <RefreshCw size={12} className="text-slate-400" />
            <span className="text-[11px] text-slate-400">Next sync:</span>
            <span className="text-[11px] font-semibold text-slate-700">{metrics.nextSync}</span>
          </div>

          <div className="h-4 w-px bg-slate-200 flex-shrink-0" />

          {/* API calls bar expands to fill remaining width */}
          <div className="flex flex-1 items-center gap-2">
            <span className="flex-shrink-0 text-[11px] text-slate-400">API calls</span>
            <div className="relative flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${barColor}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="flex-shrink-0 font-mono text-[11px] font-semibold text-slate-700">
              {metrics.apiCallsUsed.toLocaleString()} / {metrics.apiCallsTotal.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </OffsetCard>

    {showSyncSettings && (
      <SyncSettingsModal
        integrationName={data.integrationName}
        supportsWebhook={data.supportsWebhook}
        onClose={() => setShowSyncSettings(false)}
      />
    )}
    </>
  )
}
