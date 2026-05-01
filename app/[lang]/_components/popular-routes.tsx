import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Locale, Dictionary } from '@/app/[lang]/dictionaries'
import type { Route } from '@/lib/types'

interface PopularRoutesProps {
  lang: Locale
  t: Dictionary['homepage']['routes']
  bookLabel: string
  routes: Route[]
}

export function PopularRoutes({ lang, t, bookLabel, routes }: PopularRoutesProps) {
  const shown = routes.slice(0, 6)

  return (
    <section className="bg-night px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 text-center font-display text-3xl font-light italic text-white">
          {t.title}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((route) => (
            <Link
              key={route.id}
              href={`/${lang}/book?route=${route.id}`}
              className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-5 py-4 transition-colors hover:border-gold/40 hover:bg-white/10"
            >
              <div>
                <p className="font-medium text-white">{route.name}</p>
                <p className="mt-0.5 text-sm text-white/40">
                  {bookLabel} · from €{route.base_price}
                </p>
              </div>
              <ArrowRight className="size-4 text-white/30 transition-colors group-hover:text-gold" />
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href={`/${lang}/routes`}
            className="text-sm font-medium text-gold transition-colors hover:text-gold-dark"
          >
            {t.viewAll}
          </Link>
        </div>
      </div>
    </section>
  )
}
