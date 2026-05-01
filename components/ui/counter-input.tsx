import { Minus, Plus } from 'lucide-react'

interface CounterInputProps {
  label: string
  value: number
  min?: number
  max?: number
  onChange: (value: number) => void
}

export function CounterInput({ label, value, min = 0, max = 99, onChange }: CounterInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wider text-clay">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="flex size-9 items-center justify-center rounded-xl border border-warm bg-white text-clay transition-colors hover:border-gold/50 hover:bg-sand disabled:opacity-30"
          aria-label={`Decrease ${label}`}
        >
          <Minus className="size-4" />
        </button>
        <span className="w-8 text-center text-base font-semibold text-ink">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="flex size-9 items-center justify-center rounded-xl border border-warm bg-white text-clay transition-colors hover:border-gold/50 hover:bg-sand disabled:opacity-30"
          aria-label={`Increase ${label}`}
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  )
}
