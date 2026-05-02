'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Calendar,
  Map,
  Sparkles,
  Users,
  Wallet,
  TrendingUp,
  LogOut,
} from 'lucide-react'
import { logout } from '@/lib/api/auth'
import { cn } from '@/lib/cn'

const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
  { href: '/admin/routes', label: 'Routes', icon: Map },
  { href: '/admin/extras', label: 'Extras', icon: Sparkles },
  { href: '/admin/drivers', label: 'Drivers', icon: Users },
  { href: '/admin/payouts', label: 'Payouts', icon: Wallet },
  { href: '/admin/revenue', label: 'Revenue', icon: TrendingUp },
] as const

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    try {
      await logout()
    } finally {
      router.push('/admin/login')
      router.refresh()
    }
  }

  return (
    <aside className="fixed inset-y-0 left-0 flex w-[220px] flex-col border-r border-[var(--border)] bg-[var(--card)]">
      <div className="flex h-16 items-center gap-2 border-b border-[var(--border)] px-5">
        <div className="text-xl font-semibold tracking-tight text-[var(--primary)]">Taxsi</div>
        <div className="text-xs uppercase tracking-widest text-[var(--muted-foreground)]">Admin</div>
      </div>
      <nav className="flex-1 overflow-y-auto p-3">
        {NAV.map((item) => {
          const active = pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                active
                  ? 'border-l-2 border-[var(--primary)] bg-[var(--accent)] text-[var(--primary)]'
                  : 'text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)]',
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 border-t border-[var(--border)] px-5 py-4 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
      >
        <LogOut className="size-4" />
        Logout
      </button>
    </aside>
  )
}
