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
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-zinc-700">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="flex size-8 items-center justify-center rounded-lg border border-zinc-300 text-zinc-700 hover:bg-zinc-50 disabled:opacity-40"
          aria-label={`Decrease ${label}`}
        >
          <Minus className="size-4" />
        </button>
        <span className="w-6 text-center text-sm font-semibold text-zinc-900">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="flex size-8 items-center justify-center rounded-lg border border-zinc-300 text-zinc-700 hover:bg-zinc-50 disabled:opacity-40"
          aria-label={`Increase ${label}`}
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  )
}
