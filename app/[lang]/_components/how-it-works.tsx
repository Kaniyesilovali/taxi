import type { Dictionary } from '@/app/[lang]/dictionaries'

export function HowItWorks({ t }: { t: Dictionary['homepage']['howItWorks'] }) {
  return (
    <section className="bg-sand px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-12 text-center font-display text-3xl font-light italic text-ink">
          {t.title}
        </h2>
        <div className="relative flex flex-col gap-8 sm:flex-row">
          {t.steps.map((step, i) => (
            <div key={i} className="flex flex-1 flex-col items-center text-center">
              <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-gold text-lg font-bold text-night">
                {i + 1}
              </div>
              <h3 className="mb-2 font-semibold text-ink">{step.title}</h3>
              <p className="text-sm leading-relaxed text-clay">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
