import { cn } from '@/lib/utils'

const shadowVariantClasses = {
  default: 'shadow-offset border border-slate-200',
  yellow:  'shadow-offset-yellow border border-linx-yellow',
  orange:  'shadow-offset-orange border border-linx-orange',
} as const

interface OffsetCardProps {
  children: React.ReactNode
  className?: string
  shadowVariant?: keyof typeof shadowVariantClasses
  padding?: string
}

export function OffsetCard({
  children,
  className,
  shadowVariant = 'default',
  padding = 'p-5',
}: OffsetCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-white',
        shadowVariantClasses[shadowVariant],
        padding,
        className,
      )}
    >
      {children}
    </div>
  )
}
