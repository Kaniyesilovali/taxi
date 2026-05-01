import Link from 'next/link'
import type { Locale, Dictionary } from '@/app/[lang]/dictionaries'

interface CtaBannerProps {
  lang: Locale
  t: Dictionary['homepage']['cta']
}

export function CtaBanner({ lang, t }: CtaBannerProps) {
  return (
    <section className="bg-night px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-light italic text-white">{t.title}</h2>
        <p className="mt-3 text-white/50">{t.subtitle}</p>
        <Link
          href={`/${lang}/book`}
          className="mt-8 inline-flex h-14 items-center rounded-full bg-gold px-10 text-base font-medium text-night transition-colors hover:bg-gold-dark"
        >
          {t.button}
        </Link>
      </div>
    </section>
  )
}
