import Link from 'next/link'
import { Phone } from 'lucide-react'

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-night">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/en"
            className="font-display text-2xl font-light italic tracking-wide text-white transition-opacity hover:opacity-75"
          >
            Taxsi
          </Link>
          <a
            href="tel:+35799000000"
            className="flex items-center gap-2 text-sm font-medium text-gold transition-colors hover:text-gold-dark"
          >
            <Phone className="size-3.5" />
            +357 99 000 000
          </a>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-white/5 bg-night py-8 text-center text-sm text-white/30">
        © {new Date().getFullYear()} Taxsi · Cyprus Airport Transfers
      </footer>
    </div>
  )
}
