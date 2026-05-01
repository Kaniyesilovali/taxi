import { Lock, User, Clock, CheckCircle } from 'lucide-react'
import type { Dictionary } from '@/app/[lang]/dictionaries'

const icons = [Lock, User, Clock, CheckCircle]

export function WhyTaxsi({ t }: { t: Dictionary['homepage']['why'] }) {
  return (
    <section className="bg-cream px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 text-center font-display text-3xl font-light italic text-ink">
          {t.title}
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {t.items.map((item, i) => {
            const Icon = icons[i]
            return (
              <div key={i} className="flex flex-col items-start gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-gold/10">
                  <Icon className="size-5 text-gold" />
                </div>
                <h3 className="font-semibold text-ink">{item.title}</h3>
                <p className="text-sm leading-relaxed text-clay">{item.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
