'use client'
import Link from 'next/link'
import { Phone, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { LanguageSwitcher } from './language-switcher'
import type { Locale, Dictionary } from '@/app/[lang]/dictionaries'

interface HeaderProps {
  lang: Locale
  nav: Dictionary['nav']
}

export function Header({ lang, nav }: HeaderProps) {
  const [open, setOpen] = useState(false)
  const base = `/${lang}`

  const links = [
    { href: `${base}/book`, label: nav.book },
    { href: `${base}/routes`, label: nav.routes },
    { href: `${base}/track`, label: nav.track },
    { href: `${base}/blog`, label: nav.blog },
    { href: `${base}/about`, label: nav.about },
    { href: `${base}/contact`, label: nav.contact },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-night">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href={`/${lang}`}
          className="font-display text-2xl font-light italic tracking-wide text-white transition-opacity hover:opacity-75"
        >
          Taxsi
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-white/60 transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSwitcher current={lang} />
          <a
            href="tel:+35799000000"
            className="hidden items-center gap-2 text-sm font-medium text-gold transition-colors hover:text-gold-dark sm:flex"
          >
            <Phone className="size-3.5" />
            +357 99 000 000
          </a>
          <button
            onClick={() => setOpen(!open)}
            className="text-white/60 hover:text-white lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/5 bg-night px-4 pb-4 lg:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white"
              >
                {l.label}
              </Link>
            ))}
            <a
              href="tel:+35799000000"
              className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gold"
            >
              <Phone className="size-3.5" />
              +357 99 000 000
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
