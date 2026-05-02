import Link from 'next/link'
import type { Locale, Dictionary } from '@/app/[lang]/dictionaries'

interface CtaBannerProps {
  lang: Locale
  t: Dictionary['homepage']['cta']
}

export function CtaBanner({ lang, t }: CtaBannerProps) {
  return (
    <section className="relative overflow-hidden bg-night text-white">
      <div className="grain absolute inset-0 opacity-[0.05]" aria-hidden />
      <div
        aria-hidden
        className="absolute inset-x-0 -bottom-24 mx-auto h-72 max-w-3xl"
        style={{
          background:
            'radial-gradient(60% 80% at 50% 0%, rgba(201,169,97,0.22), rgba(10,10,10,0) 70%)',
        }}
      />
      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 py-28 text-center sm:px-6 lg:py-36">
        <span className="block h-px w-16 bg-gold" />
        <h2 className="mt-10 font-display text-4xl font-light leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
          <span className="italic">{t.title}</span>
        </h2>
        <p className="mt-6 max-w-md text-base font-light text-white/55">{t.subtitle}</p>
        <Link
          href={`/${lang}/book`}
          className="mt-12 inline-flex h-14 items-center border border-gold px-12 text-xs font-medium uppercase tracking-[0.28em] text-gold transition-colors hover:bg-gold hover:text-night"
        >
          {t.button}
        </Link>
      </div>
    </section>
  )
}
