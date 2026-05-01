import { cn } from '@/lib/cn'
import { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, required, ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wider text-clay">
          {label}
          {!required && (
            <span className="ml-1 font-normal normal-case tracking-normal text-clay/60">
              (optional)
            </span>
          )}
        </label>
        <input
          id={inputId}
          ref={ref}
          required={required}
          className={cn(
            'h-10 rounded-xl border border-warm bg-white px-3 text-sm text-ink placeholder:text-clay/40',
            'focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-colors',
            error && 'border-red-400 focus:ring-red-400 focus:border-red-400',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
