import Link from 'next/link'
import type { Locale, Dictionary } from '@/app/[lang]/dictionaries'

interface HeroProps {
  lang: Locale
  t: Dictionary['homepage']['hero']
}

export function Hero({ lang, t }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-night px-4 py-24 sm:px-6 sm:py-32">
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, #c8922a, transparent)',
        }}
      />
      <div className="relative mx-auto max-w-4xl text-center">
        <h1 className="font-display text-4xl font-light italic tracking-tight text-white sm:text-6xl">
          {t.title}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-white/60">{t.subtitle}</p>
        <div className="mt-10">
          <Link
            href={`/${lang}/book`}
            className="inline-flex h-14 items-center rounded-full bg-gold px-10 text-base font-medium text-night transition-colors hover:bg-gold-dark"
          >
            {t.cta}
          </Link>
        </div>
      </div>
    </section>
  )
}
