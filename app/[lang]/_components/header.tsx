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
    { href: `${base}/routes`, label: nav.routes },
    { href: `${base}/track`, label: nav.track },
    { href: `${base}/blog`, label: nav.blog },
    { href: `${base}/about`, label: nav.about },
    { href: `${base}/contact`, label: nav.contact },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-night/95 backdrop-blur supports-[backdrop-filter]:bg-night/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:h-20">
        <Link
          href={`/${lang}`}
          className="font-display text-2xl font-light italic tracking-wide text-white transition-opacity hover:opacity-75 lg:text-[1.7rem]"
        >
          Taxsi
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-xs uppercase tracking-[0.18em] text-white/55 transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href="tel:+35799000000"
            className="hidden items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/55 transition-colors hover:text-gold xl:flex"
          >
            <Phone className="size-3.5" />
            +357 99 000 000
          </a>

          <LanguageSwitcher current={lang} />

          <Link
            href={`${base}/book`}
            className="hidden h-10 items-center border border-gold px-5 text-[10px] font-medium uppercase tracking-[0.28em] text-gold transition-colors hover:bg-gold hover:text-night sm:inline-flex"
          >
            {nav.reserve}
          </Link>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="text-white/60 transition-colors hover:text-white lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-night/95 backdrop-blur lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-white/5 py-3 text-sm uppercase tracking-[0.18em] text-white/65 transition-colors hover:text-white"
              >
                {l.label}
              </Link>
            ))}
            <a
              href="tel:+35799000000"
              className="mt-2 flex items-center gap-2 py-3 text-sm uppercase tracking-[0.18em] text-gold"
            >
              <Phone className="size-4" />
              +357 99 000 000
            </a>
            <Link
              href={`${base}/book`}
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex h-12 items-center justify-center border border-gold px-6 text-xs font-medium uppercase tracking-[0.28em] text-gold transition-colors hover:bg-gold hover:text-night sm:hidden"
            >
              {nav.reserve}
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
