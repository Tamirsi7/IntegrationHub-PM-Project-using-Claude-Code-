import { Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type Integration, CATEGORY_STYLES } from '@/data/integrations'

interface IntegrationCardProps {
  integration: Integration
  index: number
  onConnect: (id: string) => void
  onConfigure: (id: string) => void
}

function getStatusRing(integration: Integration) {
  if (integration.connectionStatus === 'connected') {
    if (integration.health === 'healthy') return 'ring-4 ring-emerald-400/60'
    if (integration.health === 'rate-limited') return 'ring-4 ring-yellow-400/70'
    if (integration.health === 'error') return 'ring-4 ring-red-400/60'
    if (integration.health === 'syncing') return 'ring-4 ring-blue-400/60'
    return 'ring-4 ring-emerald-400/60'
  }
  if (integration.connectionStatus === 'not-connected') return 'ring-4 ring-slate-200'
  return 'ring-4 ring-slate-100'
}

function getStatusGlow(integration: Integration) {
  if (integration.connectionStatus === 'connected') {
    if (integration.health === 'healthy') return 'shadow-[0_0_18px_4px_rgba(52,211,153,0.25)]'
    if (integration.health === 'rate-limited') return 'shadow-[0_0_18px_4px_rgba(250,204,21,0.30)]'
    if (integration.health === 'error') return 'shadow-[0_0_18px_4px_rgba(248,113,113,0.25)]'
  }
  return ''
}

function StatusDot({ integration }: { integration: Integration }) {
  if (integration.connectionStatus !== 'connected') return null
  const color =
    integration.health === 'healthy' ? 'bg-emerald-400' :
    integration.health === 'rate-limited' ? 'bg-yellow-400' :
    integration.health === 'error' ? 'bg-red-400' :
    integration.health === 'syncing' ? 'bg-blue-400' : 'bg-emerald-400'
  const pulse = integration.health === 'syncing' ? 'animate-pulse' : ''
  return (
    <span
      className={cn(
        'absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white',
        color,
        pulse,
      )}
    />
  )
}

export function IntegrationCard({ integration, index, onConnect, onConfigure }: IntegrationCardProps) {
  const { id, name, category, icon, health, connectionStatus, syncedCount, remediationCapability, lastSynced, requestCount, isNew } = integration

  const isConnected = connectionStatus === 'connected'
  const isComingSoon = connectionStatus === 'coming-soon'
  const isNotConnected = connectionStatus === 'not-connected'

  const statusLabel =
    isConnected && health === 'healthy' ? 'Healthy' :
    isConnected && health === 'rate-limited' ? 'Rate Limited' :
    isConnected && health === 'error' ? 'Error' :
    isConnected && health === 'syncing' ? 'Syncing' :
    isComingSoon ? 'Coming Soon' : 'Not Connected'

  const statusColor =
    isConnected && health === 'healthy' ? 'text-emerald-600 bg-emerald-50' :
    isConnected && health === 'rate-limited' ? 'text-yellow-700 bg-yellow-50' :
    isConnected && health === 'error' ? 'text-red-600 bg-red-50' :
    isConnected && health === 'syncing' ? 'text-blue-600 bg-blue-50' :
    isComingSoon ? 'text-slate-400 bg-slate-50' : 'text-slate-500 bg-slate-50'

  return (
    <div
      className="flex flex-col items-center gap-2 opacity-0 animate-slide-in-up"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms`, animationFillMode: 'forwards' } as React.CSSProperties}
    >
      {/* Outer wrapper with extra padding to accommodate overflow badges */}
      <div className="relative pt-3 px-3">

        {/* Category badge — floats above/outside the circle, top-right */}
        <span
          className={cn(
            'absolute top-0 right-0 z-20 rounded-full border px-1.5 py-0.5 text-[8px] font-bold leading-none shadow-sm whitespace-nowrap',
            CATEGORY_STYLES[category],
          )}
        >
          {category}
        </span>

        {/* "New" badge — top-left */}
        {isNew && (
          <span className="absolute top-0 left-0 z-20 rounded-full bg-linx-yellow px-1.5 py-0.5 text-[8px] font-black text-slate-900 shadow-sm whitespace-nowrap">
            New
          </span>
        )}

        {/* Flip card container — 144px */}
        <div
          className={cn(
            'group relative h-36 w-36',
            '[perspective:800px]',
            isComingSoon && 'opacity-70',
          )}
        >
          <div className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">

            {/* ── FRONT ── */}
            <div
              className={cn(
                'absolute inset-0 flex items-center justify-center rounded-full bg-white [backface-visibility:hidden] overflow-hidden',
                getStatusRing(integration),
                getStatusGlow(integration),
                'transition-shadow duration-300',
              )}
            >
              <img
                src={icon}
                alt={`${name} logo`}
                className="h-[72px] w-[72px] object-contain"
              />

              {/* "Coming Soon" diagonal ribbon — inside overflow:hidden, so it clips to circle */}
              {isComingSoon && (
                <span
                  className="absolute text-[9px] font-black tracking-widest text-white uppercase bg-slate-700/80 px-8 py-0.5 rotate-[-35deg] translate-y-[-6px] pointer-events-none"
                  style={{ width: '160%', textAlign: 'center' }}
                >
                  Coming Soon
                </span>
              )}

              <StatusDot integration={integration} />
            </div>

            {/* ── BACK ── */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 rounded-full bg-slate-900 text-center [backface-visibility:hidden] [transform:rotateY(180deg)] px-5"
            >
              {/* Status pill */}
              <span className={cn('rounded-full px-2.5 py-0.5 text-[9px] font-semibold', statusColor)}>
                {statusLabel}
              </span>

              {/* Synced count (connected only) */}
              {isConnected && syncedCount !== undefined && (
                <span className="font-mono text-[9px] text-slate-300 leading-none">
                  {syncedCount.toLocaleString()} identities
                </span>
              )}

              {/* Request count (coming soon) */}
              {isComingSoon && requestCount !== undefined && (
                <span className="font-mono text-[9px] text-slate-300 leading-none">
                  {requestCount} requested
                </span>
              )}

              {/* Remediation — connected only */}
              {isConnected && (
                <span className="text-[9px] text-slate-400 leading-none">
                  {remediationCapability === 'one-click-remediation' ? '⚡ 1-Click Remediation' : '👁 View Only'}
                </span>
              )}

              {/* Last synced */}
              {isConnected && lastSynced && (
                <span className="font-mono text-[8px] text-slate-500 leading-none">
                  synced {lastSynced}
                </span>
              )}

              {/* CTA button */}
              {isConnected && (
                <button
                  onClick={() => onConfigure(id)}
                  className="mt-1 flex items-center gap-1 rounded-full bg-white px-4 py-1.5 text-[10px] font-bold text-slate-900 transition-opacity hover:opacity-80"
                >
                  <Settings size={10} />
                  Configure
                </button>
              )}
              {isNotConnected && (
                <button
                  onClick={() => onConnect(id)}
                  className="mt-1 rounded-full bg-linx-orange px-4 py-1.5 text-[10px] font-bold text-white transition-opacity hover:opacity-80"
                >
                  Connect
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Label below */}
      <span className="text-center text-[11px] font-semibold text-slate-700 leading-tight max-w-[8rem] truncate">
        {name}
      </span>
      {isConnected && lastSynced && (
        <span className="font-mono text-[9px] text-slate-400 -mt-1">{lastSynced}</span>
      )}
    </div>
  )
}
