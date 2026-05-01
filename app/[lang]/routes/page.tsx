import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { getDictionary, hasLocale, type Locale } from '@/app/[lang]/dictionaries'
import { getRoutes } from '@/lib/api/routes'

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
    alternates: { languages: { en: '/en/routes', tr: '/tr/routes', ru: '/ru/routes' } },
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
    <div className="min-h-screen bg-sand">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="mb-12">
          <h1 className="font-display text-4xl font-light italic text-ink">{t.title}</h1>
          <p className="mt-3 text-clay">{t.subtitle}</p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-warm bg-cream shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-warm bg-sand/50">
                <th className="px-6 py-4 text-left font-semibold text-ink">Route</th>
                <th className="px-6 py-4 text-right font-semibold text-ink">{t.oneWay}</th>
                <th className="px-6 py-4 text-right font-semibold text-ink">{t.roundTrip}</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm">
              {routes.map((route) => (
                <tr key={route.id} className="group hover:bg-sand/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-ink">{route.pickup_location}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-clay">
                      <ArrowRight className="size-3" />
                      {route.dropoff_location}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-ink">
                    €{route.base_price}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-ink">
                    €{route.round_trip_price}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/${lang}/book?route=${route.id}`}
                      className="text-gold text-xs font-medium hover:text-gold-dark transition-colors"
                    >
                      {t.bookRoute} →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
