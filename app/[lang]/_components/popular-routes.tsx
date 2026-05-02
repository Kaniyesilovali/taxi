import Link from 'next/link'
import type { Locale, Dictionary } from '@/app/[lang]/dictionaries'
import type { Route } from '@/lib/types'

interface PopularRoutesProps {
  lang: Locale
  t: Dictionary['homepage']['routes']
  routes: Route[]
}

export function PopularRoutes({ lang, t, routes }: PopularRoutesProps) {
  const shown = routes.slice(0, 6)

  return (
    <section className="bg-cream text-ink">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-32">
        <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow text-gold">{t.eyebrow}</p>
            <h2 className="mt-5 font-display text-4xl font-light leading-[1.05] tracking-tight text-ink sm:text-5xl">
              <span className="italic">{t.title}</span>
            </h2>
          </div>
          <Link
            href={`/${lang}/routes`}
            className="eyebrow hidden text-gold transition-colors hover:text-gold-dark lg:inline-flex"
          >
            {t.viewAll}
          </Link>
        </div>

        <ul className="border-t border-clay/20">
          {shown.map((route) => (
            <li key={route.id} className="border-b border-clay/15">
              <Link
                href={`/${lang}/book?route=${route.id}`}
                className="group grid grid-cols-[1fr_auto] items-center gap-6 px-1 py-6 transition-colors hover:bg-sand/60 sm:grid-cols-[auto_1fr_auto] sm:px-3"
              >
                <span className="kicker hidden text-base text-gold/60 sm:inline-block sm:w-12">
                  →
                </span>
                <div className="min-w-0">
                  <p className="font-display text-xl font-light italic text-ink sm:text-2xl">
                    {route.name}
                  </p>
                  <p className="mt-1 text-xs text-clay/80">
                    {route.pickup_location} · {route.dropoff_location}
                  </p>
                </div>
                <div className="flex items-baseline gap-2 whitespace-nowrap">
                  <span className="eyebrow text-clay/60">{t.from}</span>
                  <span className="font-display text-2xl font-light text-ink">
                    €{route.base_price}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10 lg:hidden">
          <Link
            href={`/${lang}/routes`}
            className="eyebrow text-gold transition-colors hover:text-gold-dark"
          >
            {t.viewAll}
          </Link>
        </div>
      </div>
    </section>
  )
}
