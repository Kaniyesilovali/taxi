'use client'
import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import type { Dictionary } from '@/app/[lang]/dictionaries'

export function ContactForm({ t }: { t: Dictionary['contact']['form'] }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>(
    'idle'
  )

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    }
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="border border-gold/40 bg-gold/5 p-6 text-sm text-ink">
        {t.success}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <Field label={t.name} name="name" required />
      <Field label={t.emailField} name="email" type="email" required />
      <FieldArea label={t.message} name="message" required />

      {status === 'error' && (
        <p className="text-sm text-red-600">{t.error}</p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="group inline-flex h-12 items-center gap-3 self-start bg-night px-10 text-xs font-medium uppercase tracking-[0.28em] text-gold transition-colors hover:bg-gold hover:text-night disabled:opacity-60"
      >
        {status === 'sending' && (
          <span className="size-3 animate-spin rounded-full border border-current border-t-transparent" />
        )}
        {status === 'sending' ? t.sending : t.submit}
        {status !== 'sending' && (
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        )}
      </button>
    </form>
  )
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = `cf-${props.name}`
  return (
    <label
      htmlFor={id}
      className="group flex flex-col gap-1.5 border-b border-clay/30 pb-1 transition-colors focus-within:border-gold"
    >
      <span className="eyebrow text-clay/70 transition-colors group-focus-within:text-gold">
        {label}
      </span>
      <input
        id={id}
        {...props}
        className="bg-transparent py-2 text-base font-light text-ink placeholder:text-clay/40 outline-none"
      />
    </label>
  )
}

function FieldArea({
  label,
  ...props
}: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = `cf-${props.name}`
  return (
    <label
      htmlFor={id}
      className="group flex flex-col gap-1.5 border-b border-clay/30 pb-1 transition-colors focus-within:border-gold"
    >
      <span className="eyebrow text-clay/70 transition-colors group-focus-within:text-gold">
        {label}
      </span>
      <textarea
        id={id}
        rows={4}
        {...props}
        className="resize-none bg-transparent py-2 text-base font-light text-ink placeholder:text-clay/40 outline-none"
      />
    </label>
  )
}
