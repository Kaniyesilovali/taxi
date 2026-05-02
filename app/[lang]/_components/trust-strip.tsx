import type { Dictionary } from '@/app/[lang]/dictionaries'

export function TrustStrip({ t }: { t: Dictionary['homepage']['trust'] }) {
  return (
    <section className="relative bg-cream text-ink">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-clay/15 px-4 sm:px-6 md:grid-cols-3 md:divide-x md:divide-y-0">
        {t.items.map((item) => (
          <div key={item.no} className="flex flex-col gap-3 px-2 py-10 md:px-10 md:py-14">
            <span className="kicker text-2xl text-gold">{item.no}</span>
            <h3 className="font-display text-2xl font-light italic leading-tight text-ink">
              {item.title}
            </h3>
            <p className="max-w-xs text-sm leading-relaxed text-clay">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
