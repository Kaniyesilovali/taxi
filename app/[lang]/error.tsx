'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { hasLocale, defaultLocale, type Locale } from './locale'

interface Dict {
  eyebrow: string
  title: string
  body: string
  retry: string
  home: string
}

const fallback: Record<Locale, Dict> = {
  en: {
    eyebrow: 'Unexpected error',
    title: 'Something went wrong.',
    body: 'An unexpected error interrupted this page. Try again, or contact us if it continues.',
    retry: 'Try again',
    home: 'Return home',
  },
  tr: {
    eyebrow: 'Beklenmeyen hata',
    title: 'Bir şeyler ters gitti.',
    body: 'Beklenmeyen bir hata bu sayfayı kesintiye uğrattı. Tekrar deneyin veya devam ederse bize ulaşın.',
    retry: 'Tekrar dene',
    home: 'Ana sayfaya dön',
  },
  ru: {
    eyebrow: 'Непредвиденная ошибка',
    title: 'Что-то пошло не так.',
    body: 'Непредвиденная ошибка прервала эту страницу. Попробуйте снова или свяжитесь с нами, если ошибка повторится.',
    retry: 'Попробовать снова',
    home: 'На главную',
  },
}

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const params = useParams<{ lang: string }>()
  const candidate = params?.lang
  const lang: Locale =
    candidate && hasLocale(candidate) ? candidate : defaultLocale

  useEffect(() => {
    console.error(error)
  }, [error])

  const t = fallback[lang]

  return (
    <section className="relative isolate flex min-h-[80vh] flex-col items-center justify-center overflow-hidden bg-night px-4 text-white sm:px-6">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 50% at 50% 10%, rgba(201,169,97,0.16), rgba(201,169,97,0) 70%)',
          }}
        />
        <div className="grain" />
      </div>

      <div className="relative flex max-w-xl flex-col items-center text-center">
        <p className="eyebrow text-gold">{t.eyebrow}</p>
        <h1 className="mt-6 font-display text-4xl font-light italic leading-tight sm:text-5xl">
          {t.title}
        </h1>
        <span className="mt-8 block h-px w-12 bg-gold" />
        <p className="mt-8 max-w-md text-base font-light leading-relaxed text-white/65">
          {t.body}
        </p>
        {error.digest && (
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
            ref: {error.digest}
          </p>
        )}
        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-12 items-center justify-center border border-gold px-8 text-xs font-medium uppercase tracking-[0.28em] text-gold transition-colors hover:bg-gold hover:text-night"
          >
            {t.retry}
          </button>
          <Link
            href={`/${lang}`}
            className="inline-flex h-12 items-center justify-center bg-gold px-8 text-xs font-medium uppercase tracking-[0.28em] text-night transition-colors hover:bg-gold-dark"
          >
            {t.home}
          </Link>
        </div>
      </div>
    </section>
  )
}
