import Link from 'next/link'
import { headers } from 'next/headers'
import { defaultLocale, locales, type Locale } from './locale'
import { getDictionary } from './dictionaries'

async function detectLocale(): Promise<Locale> {
  const h = await headers()
  const candidates = [
    h.get('x-invoke-path'),
    h.get('next-url'),
    h.get('x-next-url'),
    h.get('x-pathname'),
    h.get('referer'),
  ].filter((v): v is string => Boolean(v))

  for (const url of candidates) {
    for (const l of locales) {
      if (url.includes(`/${l}/`) || url.endsWith(`/${l}`)) {
        return l
      }
    }
  }
  return defaultLocale
}

export default async function NotFound() {
  const lang = await detectLocale()
  const dict = await getDictionary(lang)
  const t = dict.errors.notFound

  return (
    <section className="relative isolate flex min-h-[80vh] flex-col items-center justify-center overflow-hidden bg-night px-4 text-white sm:px-6">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 50% at 50% 10%, rgba(201,169,97,0.18), rgba(201,169,97,0) 70%)',
          }}
        />
        <div className="grain" />
      </div>

      <div className="relative flex max-w-xl flex-col items-center text-center">
        <p className="kicker text-7xl text-gold/40 sm:text-9xl">404</p>
        <p className="eyebrow mt-6 text-gold">{t.eyebrow}</p>
        <h1 className="mt-4 font-display text-4xl font-light italic leading-tight sm:text-5xl">
          {t.title}
        </h1>
        <span className="mt-8 block h-px w-12 bg-gold" />
        <p className="mt-8 max-w-md text-base font-light leading-relaxed text-white/65">
          {t.body}
        </p>
        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/${lang}`}
            className="inline-flex h-12 items-center justify-center border border-gold px-8 text-xs font-medium uppercase tracking-[0.28em] text-gold transition-colors hover:bg-gold hover:text-night"
          >
            {t.home}
          </Link>
          <Link
            href={`/${lang}/book`}
            className="inline-flex h-12 items-center justify-center bg-gold px-8 text-xs font-medium uppercase tracking-[0.28em] text-night transition-colors hover:bg-gold-dark"
          >
            {t.book}
          </Link>
        </div>
      </div>
    </section>
  )
}
