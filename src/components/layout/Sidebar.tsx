import {
  LayoutDashboard,
  Plug,
  Users,
  AlertTriangle,
  Shield,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { id: 'dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { id: 'integrations', label: 'Integrations', icon: Plug },
  { id: 'identities',   label: 'Identities',   icon: Users },
  { id: 'issues',       label: 'Issues',        icon: AlertTriangle },
  { id: 'policies',     label: 'Policies',      icon: Shield },
] as const

interface SidebarProps {
  activePage: string
  onNavigate: (page: string) => void
}

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="flex h-screen w-56 flex-shrink-0 flex-col border-r border-slate-200 bg-white">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 border-b border-slate-200 px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900">
          {/* Linx asterisk mark */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <line x1="8" y1="1" x2="8" y2="15" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="1" y1="8" x2="15" y2="8" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="2.93" y1="2.93" x2="13.07" y2="13.07" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="13.07" y1="2.93" x2="2.93" y2="13.07" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </div>
        <span className="text-sm font-bold tracking-tight text-slate-900">LINX</span>
      </div>

      {/* Main nav */}
      <nav className="flex flex-1 flex-col gap-0.5 px-3 py-4">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = activePage === id
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900',
              )}
            >
              <Icon size={16} />
              {label}
            </button>
          )
        })}
      </nav>

      {/* Bottom nav */}
      <div className="border-t border-slate-200 px-3 py-4">
        <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900">
          <Settings size={16} />
          Settings
        </button>
      </div>
    </aside>
  )
}
