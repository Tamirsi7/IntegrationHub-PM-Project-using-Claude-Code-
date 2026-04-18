import { useState } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Step1Connect } from './Step1Connect'
import { Step2Permissions, type IntegrationMode } from './Step2Permissions'
import { Step3Config } from './Step3Config'
import { Step4Syncing } from './Step4Syncing'

const STEPS = [
  { number: 1, label: 'Connect'     },
  { number: 2, label: 'Permissions' },
  { number: 3, label: 'Configure'   },
  { number: 4, label: 'Initialize'  },
] as const

type StepNum = 1 | 2 | 3 | 4

interface ConnectFlowProps {
  onComplete: (mode: IntegrationMode) => void
  onSyncComplete: () => void
}

export function ConnectFlow({ onComplete, onSyncComplete }: ConnectFlowProps) {
  const [step, setStep] = useState<StepNum>(1)
  const [mode, setMode] = useState<IntegrationMode>('visibility')

  function goTo(n: StepNum) {
    if (n < step) setStep(n)
  }

  function handleSyncComplete() {
    onSyncComplete()
    onComplete(mode)
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Step indicator */}
      <div className="mb-10 flex items-center">
        {STEPS.map((s, i) => {
          const isDone = step > s.number
          const isActive = step === s.number
          const isClickable = isDone
          return (
            <div key={s.number} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1.5">
                <button
                  onClick={() => isClickable ? goTo(s.number as StepNum) : undefined}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300',
                    isDone
                      ? 'border-green-500 bg-green-500 text-white cursor-pointer hover:bg-green-600'
                      : isActive
                      ? 'border-slate-900 bg-slate-900 text-white cursor-default'
                      : 'border-slate-200 bg-white text-slate-400 cursor-default',
                  )}
                >
                  {isDone ? <Check size={14} /> : s.number}
                </button>
                <span className={cn('text-xs font-medium transition-colors', isActive ? 'text-slate-900' : isDone ? 'text-green-600 cursor-pointer' : 'text-slate-400')}>
                  {s.label}
                </span>
              </div>

              {i < STEPS.length - 1 && (
                <div className="relative mx-3 mt-[-14px] h-0.5 flex-1 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="absolute inset-y-0 left-0 bg-green-500 transition-all duration-500 ease-out"
                    style={{ width: step > s.number ? '100%' : '0%' }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Step content */}
      <div className="rounded-2xl border border-slate-200 bg-white px-8 py-6 shadow-offset">
        {step === 1 && <Step1Connect onNext={() => setStep(2)} />}
        {step === 2 && <Step2Permissions onNext={(m) => { setMode(m); setStep(3) }} onBack={() => setStep(1)} />}
        {step === 3 && <Step3Config onNext={() => setStep(4)} onBack={() => setStep(2)} />}
        {step === 4 && <Step4Syncing onComplete={handleSyncComplete} />}
      </div>
    </div>
  )
}
