'use client'
import { Minus, Plus } from 'lucide-react'
import { forwardRef } from 'react'
import { cn } from '@/lib/cn'

interface FieldShellProps {
  label: string
  required?: boolean
  optional?: string
  error?: string
  children: React.ReactNode
  htmlFor?: string
}

export function FieldShell({
  label,
  required,
  optional,
  error,
  children,
  htmlFor,
}: FieldShellProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={htmlFor}
        className={cn(
          'eyebrow flex items-baseline gap-2 transition-colors',
          error ? 'text-red-600' : 'text-clay/70'
        )}
      >
        <span>{label}</span>
        {!required && optional && (
          <span className="normal-case tracking-normal text-clay/40 text-[0.65rem]">
            {optional}
          </span>
        )}
      </label>
      <div
        className={cn(
          'border-b transition-colors focus-within:border-gold',
          error ? 'border-red-500' : 'border-clay/30'
        )}
      >
        {children}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

interface HairlineInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  optional?: string
  error?: string
}

export const HairlineInput = forwardRef<HTMLInputElement, HairlineInputProps>(
  ({ label, optional, error, required, id, className, ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')
    return (
      <FieldShell
        label={label}
        required={required}
        optional={optional}
        error={error}
        htmlFor={inputId}
      >
        <input
          id={inputId}
          ref={ref}
          required={required}
          className={cn(
            'w-full bg-transparent py-2 text-base font-light text-ink placeholder:text-clay/40 outline-none [color-scheme:light]',
            className
          )}
          {...props}
        />
      </FieldShell>
    )
  }
)
HairlineInput.displayName = 'HairlineInput'

interface HairlineSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  optional?: string
  error?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export const HairlineSelect = forwardRef<HTMLSelectElement, HairlineSelectProps>(
  (
    { label, optional, error, options, placeholder, required, id, className, ...props },
    ref
  ) => {
    const selectId = id ?? label.toLowerCase().replace(/\s+/g, '-')
    return (
      <FieldShell
        label={label}
        required={required}
        optional={optional}
        error={error}
        htmlFor={selectId}
      >
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            required={required}
            className={cn(
              'w-full appearance-none bg-transparent py-2 pr-6 text-base font-light text-ink outline-none disabled:text-clay/40',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <span
            aria-hidden
            className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-clay/60"
          >
            ▾
          </span>
        </div>
      </FieldShell>
    )
  }
)
HairlineSelect.displayName = 'HairlineSelect'

interface HairlineTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  optional?: string
  error?: string
}

export const HairlineTextarea = forwardRef<HTMLTextAreaElement, HairlineTextareaProps>(
  ({ label, optional, error, required, id, className, ...props }, ref) => {
    const textareaId = id ?? label.toLowerCase().replace(/\s+/g, '-')
    return (
      <FieldShell
        label={label}
        required={required}
        optional={optional}
        error={error}
        htmlFor={textareaId}
      >
        <textarea
          id={textareaId}
          ref={ref}
          required={required}
          rows={3}
          className={cn(
            'w-full resize-none bg-transparent py-2 text-base font-light text-ink placeholder:text-clay/40 outline-none',
            className
          )}
          {...props}
        />
      </FieldShell>
    )
  }
)
HairlineTextarea.displayName = 'HairlineTextarea'

interface CounterFieldProps {
  label: string
  value: number
  min?: number
  max?: number
  onChange: (value: number) => void
}

export function CounterField({
  label,
  value,
  min = 0,
  max = 99,
  onChange,
}: CounterFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="eyebrow text-clay/70">{label}</span>
      <div className="flex items-center justify-between border-b border-clay/30 pb-1.5">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="flex size-8 items-center justify-center text-clay/70 transition-colors hover:text-gold disabled:opacity-30"
          aria-label={`Decrease ${label}`}
        >
          <Minus className="size-4" />
        </button>
        <span className="font-display text-2xl font-light text-ink">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="flex size-8 items-center justify-center text-clay/70 transition-colors hover:text-gold disabled:opacity-30"
          aria-label={`Increase ${label}`}
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  )
}

interface SwitchFieldProps {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function SwitchField({ label, description, checked, onChange }: SwitchFieldProps) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-6 border-b border-clay/15 py-5 last:border-b-0">
      <div className="flex-1">
        <p className="font-display text-lg font-light italic text-ink">{label}</p>
        {description && <p className="mt-1 text-sm text-clay/80">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative mt-1 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors',
          checked ? 'bg-gold' : 'bg-clay/25'
        )}
      >
        <span
          className={cn(
            'inline-block size-4 transform rounded-full bg-cream transition-transform',
            checked ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </button>
    </label>
  )
}

interface PaymentRadioProps {
  name: string
  value: string
  current: string
  onChange: (value: string) => void
  title: string
  desc: string
}

export function PaymentRadio({
  name,
  value,
  current,
  onChange,
  title,
  desc,
}: PaymentRadioProps) {
  const selected = current === value
  return (
    <label
      className={cn(
        'group relative flex cursor-pointer items-start gap-4 border p-6 transition-colors',
        selected
          ? 'border-gold bg-gold/5'
          : 'border-clay/20 bg-cream hover:border-gold/40'
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={selected}
        onChange={(e) => onChange(e.target.value)}
        className="sr-only"
      />
      <span
        aria-hidden
        className={cn(
          'mt-1 flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors',
          selected ? 'border-gold' : 'border-clay/40'
        )}
      >
        <span
          className={cn(
            'size-2 rounded-full transition-colors',
            selected ? 'bg-gold' : 'bg-transparent'
          )}
        />
      </span>
      <div className="flex flex-col gap-1">
        <span className="font-display text-lg font-light italic text-ink">{title}</span>
        <span className="text-sm text-clay/80">{desc}</span>
      </div>
    </label>
  )
}

interface ExtraChipProps {
  label: string
  selected: boolean
  onToggle: () => void
}

export function ExtraChip({ label, selected, onToggle }: ExtraChipProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'inline-flex items-center gap-2 border px-4 py-2 text-sm transition-colors',
        selected
          ? 'border-gold bg-gold text-night'
          : 'border-clay/30 bg-transparent text-ink hover:border-gold'
      )}
      aria-pressed={selected}
    >
      <span
        aria-hidden
        className={cn(
          'inline-block size-3 transition-colors',
          selected ? 'bg-night' : 'border border-clay/40'
        )}
      />
      <span className="font-light">{label}</span>
    </button>
  )
}
