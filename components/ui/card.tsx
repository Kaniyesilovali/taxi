import { cn } from '@/lib/cn'

export function Card({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn('rounded-2xl border border-warm bg-cream p-6 shadow-sm', className)}>
      {children}
    </div>
  )
}
