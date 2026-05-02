import type { Metadata } from 'next'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale, type Locale } from '@/app/[lang]/dictionaries'
import { getRoutes } from '@/lib/api/routes'
import { getExtras } from '@/lib/api/extras'
import { BookingForm } from '@/app/(customer)/_components/booking-form'

interface Props {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.book.meta.title,
    description: dict.book.meta.description,
  }
}

export default async function BookPage({ params }: Props) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const [dict, routes, extras] = await Promise.all([
    getDictionary(lang as Locale),
    getRoutes(),
    getExtras(),
  ])

  const t = dict.book

  return (
    <>
      <section className="relative isolate overflow-hidden bg-night text-white">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(70% 60% at 85% 0%, rgba(201,169,97,0.28), rgba(201,169,97,0) 60%)',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(70% 60% at 0% 100%, rgba(20,20,20,1), rgba(10,10,10,0) 70%)',
            }}
          />
          <div className="grain" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pt-32 pb-20 sm:px-6 sm:pt-36 sm:pb-24 lg:pt-44">
          <p
            className="eyebrow text-gold opacity-0"
            style={{ animation: 'reveal 800ms cubic-bezier(0.16,1,0.3,1) forwards' }}
          >
            {t.hero.eyebrow}
          </p>
          <h1
            className="mt-6 max-w-4xl font-display text-5xl font-light leading-[0.98] tracking-tight text-white opacity-0 sm:text-7xl lg:text-[6.5rem]"
            style={{
              animation: 'reveal 1000ms 120ms cubic-bezier(0.16,1,0.3,1) forwards',
            }}
          >
            <span className="italic">{t.hero.title}</span>
          </h1>
          <p
            className="mt-8 max-w-xl text-base font-light leading-relaxed text-white/65 opacity-0 sm:text-lg"
            style={{
              animation: 'reveal 1000ms 280ms cubic-bezier(0.16,1,0.3,1) forwards',
            }}
          >
            {t.hero.subtitle}
          </p>
        </div>
      </section>

      <Suspense fallback={<div className="bg-cream py-32" />}>
        <BookingForm routes={routes} extras={extras} t={t} optionalLabel={t.optional} />
      </Suspense>
    </>
  )
}
