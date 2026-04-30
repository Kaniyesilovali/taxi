import Link from 'next/link'

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="text-xl font-bold tracking-tight text-zinc-900">
            Taxsi
          </Link>
          <nav className="flex items-center gap-4 text-sm text-zinc-600">
            <a href="tel:+35799000000" className="hover:text-zinc-900">
              +357 99 000 000
            </a>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-zinc-200 bg-white py-6 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} Taxsi · Cyprus Airport Transfers
      </footer>
    </div>
  )
}
