import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale, type Locale } from '@/app/[lang]/dictionaries'
import { getRoutes } from '@/lib/api/routes'
import { PageHero } from '@/app/[lang]/_components/page-hero'

interface Props {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.routes.title,
    description: dict.routes.subtitle,
    alternates: {
      languages: { en: '/en/routes', tr: '/tr/routes', ru: '/ru/routes' },
    },
  }
}

export default async function RoutesPage({ params }: Props) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const [dict, routes] = await Promise.all([
    getDictionary(lang as Locale),
    getRoutes(),
  ])
  const t = dict.routes

  return (
    <>
      <PageHero
        eyebrow={t.eyebrow}
        title={t.title}
        subtitle={t.subtitle}
        size="md"
      />

      <section className="bg-cream text-ink">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-28">
          <div className="hidden grid-cols-[2fr_1fr_1fr_auto] gap-6 border-b border-clay/30 pb-4 lg:grid">
            <span className="eyebrow text-clay/60">{t.tableHeading}</span>
            <span className="eyebrow text-right text-clay/60">{t.oneWay}</span>
            <span className="eyebrow text-right text-clay/60">{t.roundTrip}</span>
            <span />
          </div>

          <ul>
            {routes.map((route) => (
              <li
                key={route.id}
                className="border-b border-clay/15 py-7 first:border-t-0"
              >
                <Link
                  href={`/${lang}/book?from=${encodeURIComponent(
                    route.pickup_location
                  )}&to=${encodeURIComponent(route.dropoff_location)}`}
                  className="group grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-3 lg:grid-cols-[2fr_1fr_1fr_auto]"
                >
                  <div className="min-w-0">
                    <p className="font-display text-2xl font-light italic text-ink transition-colors group-hover:text-gold sm:text-3xl">
                      {route.pickup_location}
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-sm text-clay/80">
                      <ArrowRight className="size-3 text-gold/70" />
                      {route.dropoff_location}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1 lg:items-end">
                    <span className="eyebrow text-clay/50 lg:hidden">{t.oneWay}</span>
                    <span className="font-display text-xl font-light text-ink sm:text-2xl">
                      €{route.base_price}
                    </span>
                  </div>

                  <div className="hidden flex-col items-end gap-1 lg:flex">
                    <span className="font-display text-xl font-light text-ink sm:text-2xl">
                      €{route.round_trip_price}
                    </span>
                  </div>

                  <div className="col-span-2 mt-1 flex items-center justify-end gap-2 text-xs uppercase tracking-[0.22em] text-gold transition-all group-hover:gap-3 lg:col-span-1 lg:mt-0">
                    {t.bookRoute}
                    <ArrowRight className="size-3.5" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
