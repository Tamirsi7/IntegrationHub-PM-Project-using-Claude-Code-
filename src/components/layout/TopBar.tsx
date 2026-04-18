import { ChevronRight, Bell, CheckCircle } from 'lucide-react'

interface TopBarProps {
  breadcrumb: { label: string; onClick?: () => void }[]
  hasNotification: boolean
  showToast: boolean
  onBellClick: () => void
  onToastDismiss: () => void
}

export function TopBar({ breadcrumb, hasNotification, showToast, onBellClick, onToastDismiss }: TopBarProps) {
  return (
    <header className="relative flex h-14 flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm">
        {breadcrumb.map((crumb, i) => (
          <span key={crumb.label} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={14} className="text-slate-400" />}
            {crumb.onClick ? (
              <button
                onClick={crumb.onClick}
                className="font-medium text-slate-400 transition-colors hover:text-slate-900 hover:underline"
              >
                {crumb.label}
              </button>
            ) : (
              <span className="font-semibold text-slate-900">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>

      {/* Right cluster */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBellClick}
          className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <Bell size={18} />
          {hasNotification && (
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-linx-orange animate-pulse" />
          )}
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linx-purple text-sm font-semibold text-white">
          JS
        </div>
      </div>

      {/* Toast notification — top-right, above everything */}
      {showToast && (
        <div
          className="fixed right-6 top-20 z-50 flex items-start gap-3 rounded-xl border border-green-200 bg-white p-4 shadow-offset-md animate-toast-in"
          style={{ minWidth: '280px' }}
        >
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
            <CheckCircle size={16} className="text-green-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-900">Slack sync complete!</p>
            <p className="text-xs text-slate-500">247 identities successfully mapped.</p>
          </div>
          <button
            onClick={onToastDismiss}
            className="ml-2 flex-shrink-0 text-xs font-medium text-slate-400 hover:text-slate-700"
          >
            ✕
          </button>
        </div>
      )}
    </header>
  )
}
