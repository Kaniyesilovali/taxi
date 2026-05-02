'use client'

import type { ReactNode } from 'react'
import { Toaster } from '@/components/admin/ui/sonner'
import { QueryProvider } from './query-provider'

export function AdminProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      {children}
      <Toaster richColors position="top-right" />
    </QueryProvider>
  )
}
