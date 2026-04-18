import { useState } from 'react'
import { X, RefreshCw, Webhook, CheckCircle, Clock, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SyncSettingsModalProps {
  integrationName: string
  supportsWebhook: boolean
  onClose: () => void
}

const CADENCE_OPTIONS = [
  { value: '15m',  label: 'Every 15 min',  description: 'Near real-time — higher API usage' },
  { value: '1h',   label: 'Every hour',    description: 'Balanced — recommended for most teams' },
  { value: '4h',   label: 'Every 4 hrs',   description: 'Low API footprint — good for large orgs' },
  { value: '24h',  label: 'Daily',         description: 'Minimal API usage — compliance baseline' },
]

export function SyncSettingsModal({ integrationName, supportsWebhook, onClose }: SyncSettingsModalProps) {
  const [cadence, setCadence] = useState('4h')
  const [webhookUrl, setWebhookUrl] = useState('')
  const [webhookEnabled, setWebhookEnabled] = useState(false)
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      onClose()
    }, 1400)
  }

  const isValidWebhook = !webhookEnabled || webhookUrl.startsWith('https://')

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="relative w-full max-w-md animate-scale-in rounded-2xl border border-slate-200 bg-white shadow-offset-md">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linx-yellow">
              <RefreshCw size={14} className="text-slate-900" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Sync Settings</h2>
              <p className="text-[11px] text-slate-400">{integrationName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex flex-col gap-5 px-6 py-5">
          {/* Sync Cadence */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <Clock size={12} className="text-slate-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Sync Cadence</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {CADENCE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setCadence(opt.value)}
                  className={cn(
                    'flex flex-col gap-0.5 rounded-xl border-2 p-3 text-left transition-all',
                    cadence === opt.value
                      ? 'border-slate-900 bg-slate-900'
                      : 'border-slate-200 bg-white hover:border-slate-300',
                  )}
                >
                  <span className={cn('text-xs font-bold', cadence === opt.value ? 'text-white' : 'text-slate-900')}>
                    {opt.label}
                  </span>
                  <span className={cn('text-[10px] leading-snug', cadence === opt.value ? 'text-white/60' : 'text-slate-400')}>
                    {opt.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Webhook section */}
          {supportsWebhook && (
            <div className="flex flex-col gap-2 rounded-xl border border-slate-200 p-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Webhook size={12} className="text-slate-400" />
                  <span className="text-xs font-semibold text-slate-700">Webhook Push</span>
                  <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-600 border border-blue-200">
                    Supported
                  </span>
                </div>
                <button
                  onClick={() => setWebhookEnabled(v => !v)}
                  role="switch"
                  aria-checked={webhookEnabled}
                  className={cn(
                    'relative h-5 w-9 flex-shrink-0 rounded-full transition-colors duration-200',
                    webhookEnabled ? 'bg-linx-purple' : 'bg-slate-200',
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200',
                      webhookEnabled ? 'translate-x-4' : 'translate-x-0',
                    )}
                  />
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Receive instant push events from {integrationName} instead of polling. Reduces API usage and gives real-time identity updates.
              </p>
              {webhookEnabled && (
                <div className="flex flex-col gap-1.5 mt-1 animate-slide-in-up opacity-0" style={{ animationFillMode: 'forwards' }}>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Webhook URL <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://hooks.yourcompany.com/linx/..."
                    className={cn(
                      'rounded-lg border px-3 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none transition-all',
                      !webhookUrl || isValidWebhook
                        ? 'border-slate-200 bg-slate-50 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100'
                        : 'border-red-300 bg-red-50 focus:border-red-400',
                    )}
                  />
                  {webhookUrl && !isValidWebhook && (
                    <p className="text-[10px] text-red-500">URL must start with https://</p>
                  )}
                  {webhookUrl && isValidWebhook && (
                    <div className="flex items-center gap-1 text-[10px] text-green-600">
                      <Zap size={10} />
                      Real-time events will be pushed to this endpoint
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {!supportsWebhook && (
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3">
              <Webhook size={12} className="text-slate-300 flex-shrink-0" />
              <p className="text-[11px] text-slate-400">
                Webhook push is not supported by {integrationName}. Linx will use scheduled polling.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
          <button
            onClick={onClose}
            className="text-xs font-medium text-slate-400 transition-colors hover:text-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!isValidWebhook || saved}
            className={cn(
              'flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-offset transition-all',
              saved
                ? 'bg-green-500 shadow-none'
                : 'bg-slate-900 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none',
            )}
          >
            {saved ? (
              <>
                <CheckCircle size={14} />
                Saved!
              </>
            ) : (
              <>
                <RefreshCw size={14} />
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
