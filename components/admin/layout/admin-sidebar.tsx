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

// `enabled: false` items are reserved-route placeholders for Plan B/C — visible in the
// nav but rendered as non-clickable so Plan A demos don't 404 when exploring the UI.
const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, enabled: true },
  { href: '/admin/bookings', label: 'Bookings', icon: Calendar, enabled: false },
  { href: '/admin/routes', label: 'Routes', icon: Map, enabled: false },
  { href: '/admin/extras', label: 'Extras', icon: Sparkles, enabled: false },
  { href: '/admin/drivers', label: 'Drivers', icon: Users, enabled: false },
  { href: '/admin/payouts', label: 'Payouts', icon: Wallet, enabled: false },
  { href: '/admin/revenue', label: 'Revenue', icon: TrendingUp, enabled: false },
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
          if (!item.enabled) {
            return (
              <div
                key={item.href}
                aria-disabled="true"
                className="flex cursor-not-allowed items-center gap-3 rounded-md px-3 py-2 text-sm text-[var(--muted-foreground)]/60"
                title="Coming soon"
              >
                <Icon className="size-4" />
                <span className="flex-1">{item.label}</span>
                <span className="rounded bg-[var(--accent)]/40 px-1.5 py-0.5 text-[10px] uppercase tracking-wider">
                  soon
                </span>
              </div>
            )
          }
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
