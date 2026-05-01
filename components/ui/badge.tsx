import { cn } from '@/lib/cn'

const variants = {
  pending: 'bg-gold-pale text-clay border border-gold/20',
  assigned: 'bg-blue-50 text-blue-700 border border-blue-200',
  in_progress: 'bg-orange-50 text-orange-700 border border-orange-200',
  completed: 'bg-green-50 text-green-700 border border-green-200',
  cancelled: 'bg-red-50 text-red-700 border border-red-200',
  default: 'bg-sand text-clay border border-warm',
} as const

type BadgeVariant = keyof typeof variants

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
