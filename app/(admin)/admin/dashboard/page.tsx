import { AdminLayout } from '@/components/admin/layout/admin-layout'
import { AdminTopbar } from '@/components/admin/layout/admin-topbar'

export default function DashboardPage() {
  return (
    <AdminLayout>
      <AdminTopbar title="Dashboard" />
      <div className="p-8">
        <p className="text-[var(--muted-foreground)]">
          Dashboard content lives in Plan B. For now this confirms the auth flow and layout work.
        </p>
      </div>
    </AdminLayout>
  )
}
