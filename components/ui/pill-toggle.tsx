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
        'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
        selected
          ? 'border-zinc-900 bg-zinc-900 text-white'
          : 'border-zinc-300 bg-white text-zinc-700 hover:border-zinc-500'
      )}
    >
      {label}
    </button>
  )
}
