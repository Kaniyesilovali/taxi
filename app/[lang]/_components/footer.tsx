import Link from 'next/link'
import { Phone, Mail, MessageCircle } from 'lucide-react'
import type { Locale, Dictionary } from '@/app/[lang]/dictionaries'

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  )
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M4.98 3.5c0 1.38-1.12 2.5-2.5 2.5S0 4.88 0 3.5 1.12 1 2.48 1s2.5 1.12 2.5 2.5zM.22 8h4.5v14H.22zM7.6 8h4.32v1.92h.06c.6-1.13 2.06-2.32 4.24-2.32 4.54 0 5.38 2.99 5.38 6.88V22h-4.5v-6.42c0-1.53-.03-3.5-2.13-3.5-2.13 0-2.46 1.66-2.46 3.39V22H7.6V8z" />
    </svg>
  )
}

interface FooterProps {
  lang: Locale
  dict: Dictionary
}

export function Footer({ lang, dict }: FooterProps) {
  const base = `/${lang}`
  const year = new Date().getFullYear()
  const t = dict.footer

  const service = [
    { href: `${base}/book`, label: dict.nav.book },
    { href: `${base}/routes`, label: dict.nav.routes },
    { href: `${base}/track`, label: dict.nav.track },
  ]
  const company = [
    { href: `${base}/about`, label: dict.nav.about },
    { href: `${base}/blog`, label: dict.nav.blog },
    { href: `${base}/contact`, label: dict.nav.contact },
    { href: `${base}/faq`, label: 'FAQ' },
  ]
  const legal = [
    { href: `${base}/privacy`, label: dict.privacy.title },
    { href: `${base}/terms`, label: dict.terms.title },
  ]

  return (
    <footer className="relative border-t border-white/10 bg-night text-white">
      <div className="grain absolute inset-0 opacity-[0.03]" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-10 sm:px-6">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-12">
          {/* Brand block */}
          <div className="col-span-2 lg:col-span-4">
            <p className="font-display text-3xl font-light italic text-white">Taxsi</p>
            <p className="mt-3 text-sm text-white/45">{t.tagline}</p>
            <span className="mt-6 block h-px w-12 bg-gold" />
            <div className="mt-6 space-y-1 text-xs uppercase tracking-[0.18em] text-white/45">
              {t.addressLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <p className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-gold/80">
              <span className="size-1.5 rounded-full bg-gold" />
              {t.hours}
            </p>
          </div>

          {/* Direct lines */}
          <div className="col-span-2 lg:col-span-3">
            <p className="eyebrow text-gold">{t.directHeading}</p>
            <ul className="mt-6 flex flex-col gap-4">
              <li>
                <a
                  href="tel:+35799000000"
                  className="group flex items-center gap-3 text-sm text-white/70 transition-colors hover:text-white"
                >
                  <Phone className="size-4 text-gold/70 transition-colors group-hover:text-gold" />
                  +357 99 000 000
                </a>
              </li>
              <li>
                <a
                  href="mailto:concierge@taxsi.cy"
                  className="group flex items-center gap-3 text-sm text-white/70 transition-colors hover:text-white"
                >
                  <Mail className="size-4 text-gold/70 transition-colors group-hover:text-gold" />
                  concierge@taxsi.cy
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/35799000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 text-sm text-white/70 transition-colors hover:text-white"
                >
                  <MessageCircle className="size-4 text-gold/70 transition-colors group-hover:text-gold" />
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Service */}
          <FooterColumn heading={t.serviceHeading} items={service} className="lg:col-span-2" />

          {/* Company */}
          <FooterColumn heading={t.companyHeading} items={company} className="lg:col-span-2" />

          {/* Follow */}
          <div className="lg:col-span-1">
            <p className="eyebrow text-gold">{t.followHeading}</p>
            <ul className="mt-6 flex items-center gap-3 lg:flex-col lg:items-start lg:gap-4">
              <li>
                <a
                  href="https://instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="inline-flex size-9 items-center justify-center border border-white/15 text-white/55 transition-colors hover:border-gold hover:text-gold"
                >
                  <InstagramIcon className="size-4" />
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="inline-flex size-9 items-center justify-center border border-white/15 text-white/55 transition-colors hover:border-gold hover:text-gold"
                >
                  <LinkedinIcon className="size-4" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal links + payments */}
        <div className="mt-16 flex flex-col gap-8 border-t border-white/10 pt-8 lg:flex-row lg:items-center lg:justify-between">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-[0.18em] text-white/40">
            {legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] uppercase tracking-[0.28em] text-white/35">
            {['Visa', 'Mastercard', 'Amex', 'Stripe'].map((mark) => (
              <span
                key={mark}
                className="inline-block border border-white/15 px-3 py-1.5"
              >
                {mark}
              </span>
            ))}
          </div>
        </div>

        <p className="mt-10 text-[11px] uppercase tracking-[0.22em] text-white/30">
          {t.paymentsLine}
        </p>
        <p className="mt-2 text-xs text-white/25">
          {t.copyright.replace('{year}', String(year))}
        </p>
      </div>
    </footer>
  )
}

function FooterColumn({
  heading,
  items,
  className,
}: {
  heading: string
  items: { href: string; label: string }[]
  className?: string
}) {
  return (
    <div className={className}>
      <p className="eyebrow text-gold">{heading}</p>
      <ul className="mt-6 flex flex-col gap-3">
        {items.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm text-white/65 transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
