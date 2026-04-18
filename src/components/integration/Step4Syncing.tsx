import { useEffect, useState, useRef } from 'react'
import { Users, Network, Key, Database, LayoutDashboard, SkipForward, Bell, Mail, CheckCircle } from 'lucide-react'
import { SYNC_STEPS, ENTITY_COUNTS } from '@/data/mockData'

// Count-up hook
function useCountUp(target: number, duration: number, active: boolean) {
  const [value, setValue] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!active) return
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.floor(eased * target))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setValue(target)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [target, duration, active])

  return value
}

function CheckmarkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ strokeDasharray: 24, strokeDashoffset: 24, animation: 'check-draw 0.4s ease-out forwards' }}
    >
      <polyline points="4 12 9 17 20 7" />
    </svg>
  )
}

function EntityCard({ icon, label, target, subLabel, delay, active, iconBg }: {
  icon: React.ReactNode; label: string; target: number; subLabel?: React.ReactNode
  delay: number; active: boolean; iconBg: string
}) {
  const count = useCountUp(target, 1200, active)
  return (
    <div
      className="group flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-5 shadow-offset opacity-0 animate-slide-in-up cursor-default transition-all duration-200 hover:shadow-offset-md hover:-translate-y-0.5 hover:border-slate-300"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110 ${iconBg}`}>
        {icon}
      </div>
      <div className="text-4xl font-black text-slate-900 tabular-nums">{count}</div>
      <div className="text-center">
        <div className="text-sm font-semibold text-slate-700">{label}</div>
        {subLabel && <div className="mt-0.5 text-xs">{subLabel}</div>}
      </div>
    </div>
  )
}

// Day-2 alert setup panel shown after success
function Day2Setup({ onComplete }: { onComplete: () => void }) {
  const [channel, setChannel] = useState('')
  const [method, setMethod] = useState<'email' | 'slack'>('email')
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => onComplete(), 800)
  }

  return (
    <div
      className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-5 shadow-offset opacity-0 animate-slide-in-up"
      style={{ animationDelay: '1200ms', animationFillMode: 'forwards' }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Bell size={15} className="text-linx-purple" />
        <span className="text-sm font-bold text-slate-900">Set Up Connection Alerts</span>
        <span className="ml-auto text-xs text-slate-400">Optional</span>
      </div>
      <p className="mb-4 text-xs text-slate-500">
        Get notified if this integration disconnects or encounters sync errors.
      </p>

      {/* Method toggle */}
      <div className="mb-3 flex gap-2">
        {(['email', 'slack'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMethod(m)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              method === m
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
            }`}
          >
            {m === 'email' ? <Mail size={12} /> : <span className="font-bold text-[10px]">#</span>}
            {m === 'email' ? 'Email' : 'Slack Channel'}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
          placeholder={method === 'email' ? 'you@company.com' : '#security-alerts'}
          className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
        />
        <button
          onClick={handleSave}
          className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
            saved
              ? 'bg-green-500 text-white'
              : 'bg-slate-900 text-white hover:bg-slate-700'
          }`}
        >
          {saved ? <><CheckCircle size={14} /> Saved!</> : 'Save'}
        </button>
      </div>
    </div>
  )
}

interface Step4SyncingProps {
  onComplete: () => void
  frozen?: boolean
  frozenPhase?: 'syncing' | 'success'
}

export function Step4Syncing({ onComplete, frozen, frozenPhase }: Step4SyncingProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(
    () => frozen ? new Set([0, 1, 2]) : new Set()
  )
  const [currentStep, setCurrentStep] = useState(() => frozen ? 3 : 0)
  const [phase, setPhase] = useState<'syncing' | 'success'>(
    () => frozenPhase ?? 'syncing'
  )

  // Steps 0–3 finish fast (~12s), step 4 "Syncing Channels" is slow, step 5 wraps up
  // Total real-time ~45s so the demo feels meaningful without being too long
  const timings = [2000, 4500, 7000, 9500, 28000, 40000]
  const SUCCESS_AT = 43000

  useEffect(() => {
    if (frozen) return
    const timers: ReturnType<typeof setTimeout>[] = []

    timings.forEach((delay, i) => {
      timers.push(setTimeout(() => {
        setCompletedSteps((prev) => { const next = new Set(prev); next.add(i); return next })
        setCurrentStep(i + 1)
      }, delay))
    })

    timers.push(setTimeout(() => setPhase('success'), SUCCESS_AT))
    return () => timers.forEach(clearTimeout)
  }, [frozen])

  function handleSkip() {
    // Complete all remaining steps instantly
    const allDone = new Set(SYNC_STEPS.map((_, i) => i))
    setCompletedSteps(allDone)
    setCurrentStep(SYNC_STEPS.length)
    setPhase('success')
  }

  if (phase === 'success') {
    return (
      <div className="flex min-h-[500px] flex-col items-center justify-center gap-6 py-8 animate-fade-in">
        {/* Success icon */}
        <div className="relative flex items-center justify-center">
          <div className="absolute h-24 w-24 rounded-full bg-green-200 animate-pulse-ring" style={{ animationDelay: '0ms' }} />
          <div className="absolute h-24 w-24 rounded-full bg-green-200 animate-pulse-ring" style={{ animationDelay: '400ms' }} />
          <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-green-500 shadow-offset-md animate-scale-in">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ strokeDasharray: 30, strokeDashoffset: 30, animation: 'check-draw 0.5s ease-out 0.2s forwards' }}
            >
              <polyline points="4 12 9 17 20 7" />
            </svg>
          </div>
        </div>

        {/* Success text */}
        <div className="text-center animate-slide-in-up opacity-0" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
          <h2 className="text-2xl font-bold text-slate-900">Slack Connected Successfully! 🎉</h2>
          <p className="mt-1.5 text-sm text-slate-500">Your identity graph is live. Here's what Linx discovered:</p>
        </div>

        {/* Entity cards */}
        <div className="grid w-full max-w-2xl grid-cols-4 gap-3">
          <EntityCard icon={<Users size={18} className="text-blue-600" />} iconBg="bg-blue-100"
            label="Accounts" target={ENTITY_COUNTS.accounts.total}
            subLabel={<><span className="text-slate-400">{ENTITY_COUNTS.accounts.human} human · </span><span className="font-semibold text-amber-600">{ENTITY_COUNTS.accounts.nhi} NHI</span></>}
            delay={400} active={phase === 'success'} />
          <EntityCard icon={<Network size={18} className="text-purple-600" />} iconBg="bg-purple-100"
            label="Groups" target={ENTITY_COUNTS.groups}
            subLabel={<span className="text-slate-400">Channels &amp; teams</span>}
            delay={550} active={phase === 'success'} />
          <EntityCard icon={<Key size={18} className="text-orange-600" />} iconBg="bg-orange-100"
            label="Roles" target={ENTITY_COUNTS.roles}
            subLabel={<span className="text-slate-400">Privilege levels</span>}
            delay={700} active={phase === 'success'} />
          <EntityCard icon={<Database size={18} className="text-slate-600" />} iconBg="bg-slate-100"
            label="Resources" target={ENTITY_COUNTS.resources}
            subLabel={<span className="text-slate-400">Channels &amp; apps</span>}
            delay={850} active={phase === 'success'} />
        </div>

        {/* Day-2 setup */}
        <Day2Setup onComplete={onComplete} />

        {/* Primary CTA */}
        <button
          onClick={onComplete}
          className="group flex items-center gap-2 rounded-xl bg-slate-900 px-8 py-3.5 text-sm font-semibold text-white shadow-offset transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none opacity-0 animate-scale-in"
          style={{ animationDelay: '1500ms', animationFillMode: 'forwards' }}
        >
          <LayoutDashboard size={16} />
          Go to Integration Dashboard
        </button>
      </div>
    )
  }

  // Progress display: show elapsed time out of ~3 min total
  const stepProgress = (completedSteps.size / SYNC_STEPS.length) * 100

  return (
    <div className="flex min-h-[500px] flex-col items-center justify-center gap-8 py-8">
      {/* Spinner */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative flex h-14 w-14 items-center justify-center">
          <div className="h-14 w-14 rounded-full border-4 border-slate-200 border-t-blue-500 animate-spin" />
          <div className="absolute flex h-8 w-8 items-center justify-center rounded-full bg-slate-900">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <line x1="8" y1="1" x2="8" y2="15" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <line x1="1" y1="8" x2="15" y2="8" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <line x1="2.93" y1="2.93" x2="13.07" y2="13.07" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <line x1="13.07" y1="2.93" x2="2.93" y2="13.07" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-lg font-bold text-slate-900">Testing Connection &amp; Syncing...</h2>
          <p className="text-sm text-slate-500">
            {currentStep < SYNC_STEPS.length ? SYNC_STEPS[currentStep] : 'Finalizing...'}
          </p>
        </div>
      </div>

      {/* Checklist + Skip button */}
      <div className="flex w-full max-w-sm flex-col gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-offset">
          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-slate-400 mb-1.5">
              <span>Progress</span>
              <span>{completedSteps.size}/{SYNC_STEPS.length} steps</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-700"
                style={{ width: `${stepProgress}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {SYNC_STEPS.map((step, i) => {
              const isDone = completedSteps.has(i)
              const isActive = currentStep === i && !isDone
              return (
                <div
                  key={step}
                  className="flex items-center gap-3 opacity-0 animate-slide-in-right"
                  style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'forwards' }}
                >
                  <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center">
                    {isDone ? (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                        <CheckmarkIcon />
                      </div>
                    ) : isActive ? (
                      <div className="h-5 w-5 rounded-full border-2 border-slate-200 border-t-blue-500 animate-spin" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-slate-200" />
                    )}
                  </div>
                  <span className={`text-sm transition-colors ${isDone ? 'text-slate-400 line-through' : isActive ? 'font-medium text-slate-900' : 'text-slate-400'}`}>
                    {step}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Skip sync button — prominent, clearly for demo */}
        <button
          onClick={handleSkip}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-white py-3 text-sm font-medium text-slate-500 transition-all hover:border-slate-400 hover:text-slate-700 hover:bg-slate-50"
        >
          <SkipForward size={14} />
          Skip sync — continue to results
        </button>
      </div>
    </div>
  )
}
