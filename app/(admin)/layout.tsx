import type { ReactNode } from 'react'
import { AdminProviders } from '@/components/admin/providers/admin-providers'

export default function AdminRouteGroupLayout({ children }: { children: ReactNode }) {
  return <AdminProviders>{children}</AdminProviders>
}
