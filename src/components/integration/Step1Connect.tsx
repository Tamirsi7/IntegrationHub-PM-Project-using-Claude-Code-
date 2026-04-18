import { Users, Network, Bot, AlertTriangle, Lock, ArrowRight, Clock } from 'lucide-react'
import { SLACK_INTEGRATION } from '@/data/mockData'

const ICON_MAP = {
  Users,
  Network,
  Bot,
  AlertTriangle,
} as const

// Correct Slack logo SVG — four colored shapes forming the hashtag mark
function SlackLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 127 127" fill="none">
      {/* Yellow — top-left horizontal bar left cap */}
      <path d="M27.2 80c0 7.3-5.9 13.2-13.2 13.2S.8 87.3.8 80c0-7.3 5.9-13.2 13.2-13.2H27v13.2z" fill="#E01E5A"/>
      <path d="M33.7 80c0-7.3 5.9-13.2 13.2-13.2 7.3 0 13.2 5.9 13.2 13.2v33c0 7.3-5.9 13.2-13.2 13.2-7.3 0-13.2-5.9-13.2-13.2V80z" fill="#E01E5A"/>
      {/* Green — top horizontal bar */}
      <path d="M46.9 27c-7.3 0-13.2-5.9-13.2-13.2C33.7 6.5 39.6.6 46.9.6c7.3 0 13.2 5.9 13.2 13.2V27H46.9z" fill="#36C5F0"/>
      <path d="M46.9 33.6c7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2H13.8C6.5 60 .6 54.1.6 46.8c0-7.3 5.9-13.2 13.2-13.2h33.1z" fill="#36C5F0"/>
      {/* Red — right vertical bar */}
      <path d="M99.9 46.8c0-7.3 5.9-13.2 13.2-13.2 7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2H99.9V46.8z" fill="#2EB67D"/>
      <path d="M93.4 46.8c0 7.3-5.9 13.2-13.2 13.2-7.3 0-13.2-5.9-13.2-13.2V13.8C66.9 6.5 72.8.6 80.1.6c7.3 0 13.2 5.9 13.2 13.2v33z" fill="#2EB67D"/>
      {/* Blue — bottom horizontal bar */}
      <path d="M80.1 99.9c7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2-7.3 0-13.2-5.9-13.2-13.2V99.9h13.2z" fill="#ECB22E"/>
      <path d="M80.1 93.4c-7.3 0-13.2-5.9-13.2-13.2 0-7.3 5.9-13.2 13.2-13.2h33.1c7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2H80.1z" fill="#ECB22E"/>
    </svg>
  )
}

interface Step1ConnectProps {
  onNext: () => void
}

export function Step1Connect({ onNext }: Step1ConnectProps) {
  return (
    <div className="flex min-h-[500px] items-center gap-16 py-8">
      {/* Left column — Integration identity */}
      <div className="flex w-2/5 flex-col gap-6 animate-slide-in-up" style={{ animationDelay: '0ms' }}>
        {/* Integration logo */}
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-slate-200 shadow-offset-md">
            <SlackLogo size={36} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{SLACK_INTEGRATION.name}</h2>
            <p className="text-sm text-slate-500">Workspace Identity Integration</p>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-slate-600">
          {SLACK_INTEGRATION.description}
        </p>

        {/* Time estimate pill */}
        <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
          <Clock size={12} className="text-slate-400" />
          Setup takes less than 5 minutes
        </div>

        {/* OAuth button */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onNext}
            className="group flex w-full items-center justify-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-semibold text-white shadow-offset-md transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-offset active:shadow-none"
            style={{ backgroundColor: SLACK_INTEGRATION.logoColor }}
          >
            <SlackLogo size={18} />
            Connect with Slack
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </button>
          <p className="flex items-center gap-1.5 text-xs text-slate-400">
            <Lock size={11} />
            Linx will never modify your workspace data
          </p>
        </div>
      </div>

      {/* Right column — Value props */}
      <div
        className="flex w-3/5 flex-col gap-4 animate-slide-in-up"
        style={{ animationDelay: '75ms' }}
      >
        <div className="mb-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            What you'll get
          </h3>
        </div>

        {SLACK_INTEGRATION.valueProps.map((prop, i) => {
          const Icon = ICON_MAP[prop.icon as keyof typeof ICON_MAP]
          const iconColors = [
            'bg-blue-100 text-blue-600',
            'bg-purple-100 text-purple-600',
            'bg-amber-100 text-amber-700',
            'bg-orange-100 text-orange-600',
          ]
          return (
            <div
              key={i}
              className="flex items-start gap-3.5 rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
            >
              <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${iconColors[i]}`}>
                <Icon size={16} />
              </div>
              <p className="text-sm text-slate-700">{prop.text}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
