import type { ReactNode } from 'react'
import { AdminSidebar } from './admin-sidebar'

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div data-admin className="min-h-screen">
      <AdminSidebar />
      <main className="ml-[220px] min-h-screen">{children}</main>
    </div>
  )
}
