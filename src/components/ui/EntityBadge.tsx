import { cn } from '@/lib/utils'

const entityClasses = {
  Account:  'bg-blue-50   text-blue-700   border-blue-200',
  Group:    'bg-purple-50 text-purple-700 border-purple-200',
  Role:     'bg-orange-50 text-orange-700 border-orange-200',
  Resource: 'bg-slate-50  text-slate-700  border-slate-200',
  Bot:      'bg-amber-50  text-amber-800  border-amber-200',
  App:      'bg-green-50  text-green-700  border-green-200',
  Token:    'bg-red-50    text-red-700    border-red-200',
} as const

interface EntityBadgeProps {
  type: keyof typeof entityClasses
  className?: string
}

export function EntityBadge({ type, className }: EntityBadgeProps) {
  return (
    <span
      className={cn(
        'inline-block rounded-md border px-2 py-0.5 text-xs font-medium',
        entityClasses[type],
        className,
      )}
    >
      {type}
    </span>
  )
}
