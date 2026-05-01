import { cn } from '@/lib/cn'
import { forwardRef } from 'react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, required, ...props }, ref) => {
    const textareaId = id ?? label.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={textareaId}
          className="text-xs font-semibold uppercase tracking-wider text-clay"
        >
          {label}
          {!required && (
            <span className="ml-1 font-normal normal-case tracking-normal text-clay/60">
              (optional)
            </span>
          )}
        </label>
        <textarea
          id={textareaId}
          ref={ref}
          required={required}
          rows={3}
          className={cn(
            'rounded-xl border border-warm bg-white px-3 py-2.5 text-sm text-ink placeholder:text-clay/40 resize-none',
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
Textarea.displayName = 'Textarea'
