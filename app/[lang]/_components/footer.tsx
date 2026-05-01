import Link from 'next/link'
import type { Locale, Dictionary } from '@/app/[lang]/dictionaries'

interface FooterProps {
  lang: Locale
  dict: Dictionary
}

export function Footer({ lang, dict }: FooterProps) {
  const base = `/${lang}`
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/5 bg-night pt-10 pb-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:justify-between">
          <div>
            <p className="font-display text-2xl font-light italic text-white">Taxsi</p>
            <p className="mt-1 text-sm text-white/40">{dict.footer.tagline}</p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/40">
            <Link href={`${base}/routes`} className="hover:text-white transition-colors">{dict.nav.routes}</Link>
            <Link href={`${base}/about`} className="hover:text-white transition-colors">{dict.nav.about}</Link>
            <Link href={`${base}/contact`} className="hover:text-white transition-colors">{dict.nav.contact}</Link>
            <Link href={`${base}/blog`} className="hover:text-white transition-colors">{dict.nav.blog}</Link>
            <Link href={`${base}/faq`} className="hover:text-white transition-colors">FAQ</Link>
            <Link href={`${base}/privacy`} className="hover:text-white transition-colors">{dict.privacy.title}</Link>
            <Link href={`${base}/terms`} className="hover:text-white transition-colors">{dict.terms.title}</Link>
          </nav>
        </div>
        <p className="text-xs text-white/20">
          {dict.footer.copyright.replace('{year}', String(year))}
        </p>
      </div>
    </footer>
  )
}
