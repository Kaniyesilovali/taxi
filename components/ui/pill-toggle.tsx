import { cn } from '@/lib/cn'

interface PillToggleProps {
  label: string
  selected: boolean
  onToggle: () => void
}

export function PillToggle({ label, selected, onToggle }: PillToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'rounded-full border px-4 py-2 text-sm font-medium transition-all',
        selected
          ? 'border-gold bg-gold text-ink shadow-sm'
          : 'border-warm bg-white text-clay hover:border-gold/50 hover:bg-gold-pale'
      )}
    >
      {label}
    </button>
  )
}
