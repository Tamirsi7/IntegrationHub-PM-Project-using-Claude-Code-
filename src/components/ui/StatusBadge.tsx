import { cn } from '@/lib/utils'

const variantClasses = {
  active:       'bg-green-100 text-green-700',
  deactivated:  'bg-slate-100 text-slate-500',
  critical:     'bg-red-100 text-red-700',
  high:         'bg-orange-100 text-orange-700',
  medium:       'bg-yellow-100 text-yellow-700',
  low:          'bg-green-100 text-green-700',
  'in-progress':'bg-blue-100 text-blue-700',
  healthy:      'bg-green-100 text-green-700',
  'rate-limited':'bg-amber-100 text-amber-700',
  error:        'bg-red-100 text-red-700',
  info:         'bg-slate-100 text-slate-600',
  warn:         'bg-yellow-100 text-yellow-700',
  syncing:      'bg-blue-100 text-blue-700',
} as const

const dotVariants = new Set<keyof typeof variantClasses>([
  'active', 'deactivated', 'healthy', 'rate-limited', 'error', 'syncing', 'in-progress',
])

interface StatusBadgeProps {
  variant: keyof typeof variantClasses
  children: React.ReactNode
  className?: string
  showDot?: boolean
}

export function StatusBadge({ variant, children, className, showDot }: StatusBadgeProps) {
  const hasDot = showDot ?? dotVariants.has(variant)
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold',
        variantClasses[variant],
        className,
      )}
    >
      {hasDot && (
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      )}
      {children}
    </span>
  )
}
