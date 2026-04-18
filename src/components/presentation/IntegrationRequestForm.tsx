import { useState } from 'react'
import { ArrowLeft, CheckCircle, Send, Users, Zap, Eye } from 'lucide-react'

interface IntegrationRequestFormProps {
  onBack: () => void
  onSubmitted?: () => void  // called after submit confirmation to return to gallery
}

const NEED_LEVELS = [
  { value: 1, label: 'Nice to have', color: 'bg-slate-200 text-slate-600' },
  { value: 2, label: 'Useful', color: 'bg-blue-100 text-blue-700' },
  { value: 3, label: 'Important', color: 'bg-yellow-100 text-yellow-800' },
  { value: 4, label: 'Very Important', color: 'bg-orange-100 text-orange-700' },
  { value: 5, label: 'Critical', color: 'bg-red-100 text-red-700' },
]

// Pre-filled with Intercom dummy data
const DEFAULTS = {
  systemName: 'Intercom',
  estimatedUsers: '180',
  needLevel: 4,
  remediationNeeded: 'visibility' as 'visibility' | 'remediation' | '',
  useCase: "We use Intercom for customer support and sales chat. We need visibility into which agents have elevated admin access, and we've had a few ex-employees whose accounts weren't deactivated promptly after offboarding.",
}

export function IntegrationRequestForm({ onBack, onSubmitted }: IntegrationRequestFormProps) {
  const [systemName, setSystemName] = useState(DEFAULTS.systemName)
  const [estimatedUsers, setEstimatedUsers] = useState(DEFAULTS.estimatedUsers)
  const [needLevel, setNeedLevel] = useState(DEFAULTS.needLevel)
  const [useCase, setUseCase] = useState(DEFAULTS.useCase)
  const [remediationNeeded, setRemediationNeeded] = useState<'visibility' | 'remediation' | ''>(DEFAULTS.remediationNeeded)
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!systemName.trim()) return
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex min-h-[500px] flex-col items-center justify-center gap-6 animate-fade-in">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500 shadow-offset-md animate-scale-in">
          <CheckCircle size={36} className="text-white" />
        </div>
        <div className="text-center animate-slide-in-up opacity-0" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
          <h2 className="text-2xl font-bold text-slate-900">Request Submitted!</h2>
          <p className="mt-2 text-sm text-slate-500 max-w-sm">
            Thanks for letting us know. Your request for{' '}
            <span className="font-semibold text-slate-700">{systemName}</span> has been logged.
            Our team reviews all requests and prioritizes by demand signal.
          </p>
        </div>
        <div
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-offset w-full max-w-sm animate-slide-in-up opacity-0"
          style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="h-2 w-2 rounded-full bg-green-400" />
            <span className="text-xs font-semibold text-slate-700">Request Summary</span>
          </div>
          <dl className="flex flex-col gap-2 text-xs">
            <div className="flex justify-between">
              <dt className="text-slate-400">System</dt>
              <dd className="font-semibold text-slate-900">{systemName}</dd>
            </div>
            {estimatedUsers && (
              <div className="flex justify-between">
                <dt className="text-slate-400">Est. users</dt>
                <dd className="font-semibold text-slate-900">{estimatedUsers}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-slate-400">Priority</dt>
              <dd>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${NEED_LEVELS[needLevel - 1].color}`}>
                  {NEED_LEVELS[needLevel - 1].label}
                </span>
              </dd>
            </div>
          </dl>
        </div>
        {/* Return to hub — calls onSubmitted so deck can set visibleHotspots=3 */}
        <button
          onClick={onSubmitted ?? onBack}
          className="flex items-center gap-2 rounded-xl bg-linx-orange px-6 py-3 text-sm font-semibold text-white shadow-offset-orange transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none animate-slide-in-up opacity-0"
          style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
        >
          ← Back to Integration Hub
        </button>
      </div>
    )
  }

  const selectedNeed = NEED_LEVELS[needLevel - 1]

  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      {/* Back button */}
      <button
        onClick={onBack}
        className="mb-5 flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
      >
        <ArrowLeft size={14} />
        Back to Integration Hub
      </button>

      <div className="rounded-2xl border border-slate-200 bg-white px-8 py-7 shadow-offset">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linx-yellow">
              <Send size={14} className="text-slate-900" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Request an Integration</h2>
          </div>
          <p className="text-sm text-slate-500">
            Don't see your app? Tell us what you need. Every request is a prioritization signal for our roadmap.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* System name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              System / App Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={systemName}
              onChange={(e) => setSystemName(e.target.value)}
              placeholder="e.g. Salesforce, GitHub, Workday…"
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100 transition-all"
              required
            />
          </div>

          {/* Estimated users */}
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Users size={11} />
              Estimated Number of Users
              <span className="font-normal normal-case text-slate-300 ml-1">(optional)</span>
            </label>
            <input
              type="number"
              value={estimatedUsers}
              onChange={(e) => setEstimatedUsers(e.target.value)}
              placeholder="e.g. 250"
              min={1}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100 transition-all"
            />
          </div>

          {/* Need level */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Level of Need
              </label>
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${selectedNeed.color}`}>
                {selectedNeed.label}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <input
                type="range"
                min={1}
                max={5}
                value={needLevel}
                onChange={(e) => setNeedLevel(Number(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Nice to have</span>
                <span>Critical</span>
              </div>
            </div>
            <div className="flex gap-1.5 mt-1">
              {NEED_LEVELS.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => setNeedLevel(level.value)}
                  className={`flex-1 rounded-lg border py-1.5 text-[10px] font-semibold transition-all ${
                    needLevel === level.value
                      ? `${level.color} border-current shadow-sm`
                      : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300'
                  }`}
                >
                  {level.value}
                </button>
              ))}
            </div>
          </div>

          {/* Remediation preference */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              What do you need from this integration?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRemediationNeeded('visibility')}
                className={`flex flex-col gap-1 rounded-xl border-2 p-3 text-left transition-all ${
                  remediationNeeded === 'visibility'
                    ? 'border-slate-900 bg-slate-900'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <Eye size={14} className={remediationNeeded === 'visibility' ? 'text-white' : 'text-blue-600'} />
                <span className={`text-xs font-bold ${remediationNeeded === 'visibility' ? 'text-white' : 'text-slate-900'}`}>
                  Visibility
                </span>
                <span className={`text-[10px] ${remediationNeeded === 'visibility' ? 'text-white/60' : 'text-slate-400'}`}>
                  Identity mapping & auditing
                </span>
              </button>
              <button
                type="button"
                onClick={() => setRemediationNeeded('remediation')}
                className={`flex flex-col gap-1 rounded-xl border-2 p-3 text-left transition-all ${
                  remediationNeeded === 'remediation'
                    ? 'border-linx-purple bg-linx-purple'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <Zap size={14} className={remediationNeeded === 'remediation' ? 'text-white' : 'text-purple-600'} />
                <span className={`text-xs font-bold ${remediationNeeded === 'remediation' ? 'text-white' : 'text-slate-900'}`}>
                  Active Remediation
                </span>
                <span className={`text-[10px] ${remediationNeeded === 'remediation' ? 'text-white/60' : 'text-slate-400'}`}>
                  Auto-fix access issues
                </span>
              </button>
            </div>
          </div>

          {/* Use case */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Describe your use case
              <span className="font-normal normal-case text-slate-300 ml-1">(optional)</span>
            </label>
            <textarea
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
              placeholder="What specific identity or access problem are you trying to solve with this integration?"
              rows={3}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100 transition-all resize-none"
            />
          </div>

          {/* Submit — blinking to invite click */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <p className="text-xs text-slate-400">
              Your request helps us prioritize the roadmap.
            </p>
            <button
              type="submit"
              disabled={!systemName.trim()}
              className="flex items-center gap-2 rounded-xl bg-linx-orange px-6 py-3 text-sm font-semibold text-white shadow-offset-orange transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-offset active:shadow-none disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none animate-pulse"
            >
              <Send size={14} />
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
