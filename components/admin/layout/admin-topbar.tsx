'use client'

import { format } from 'date-fns'
import type { ReactNode } from 'react'

export function AdminTopbar({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--background)] px-8">
      <h1 className="text-lg font-semibold">{title}</h1>
      <div className="flex items-center gap-4 text-sm text-[var(--muted-foreground)]">
        <span>{format(new Date(), 'PPP')}</span>
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-500" />
          Online
        </span>
        {action}
      </div>
    </header>
  )
}
