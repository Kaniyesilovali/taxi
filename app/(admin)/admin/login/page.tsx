import { Suspense } from 'react'
import { LoginForm } from '@/components/admin/auth/login-form'

export default function LoginPage() {
  return (
    <div data-admin className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-lg border border-[var(--border)] bg-[var(--card)] p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <div className="text-2xl font-semibold tracking-tight text-[var(--primary)]">Taxsi</div>
            <div className="text-sm uppercase tracking-widest text-[var(--muted-foreground)]">Admin</div>
          </div>
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
