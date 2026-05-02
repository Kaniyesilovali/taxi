import type { Dictionary } from '@/app/[lang]/dictionaries'

export function HowItWorks({ t }: { t: Dictionary['homepage']['howItWorks'] }) {
  return (
    <section className="bg-sand text-ink">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-32">
        <div className="mb-16 max-w-2xl">
          <p className="eyebrow text-gold">{t.eyebrow}</p>
          <h2 className="mt-5 font-display text-4xl font-light leading-[1.05] tracking-tight text-ink sm:text-5xl">
            <span className="italic">{t.title}</span>
          </h2>
          <span className="mt-8 block h-px w-16 bg-gold" />
        </div>

        <ol className="grid grid-cols-1 gap-px overflow-hidden bg-clay/20 lg:grid-cols-3">
          {t.steps.map((step, i) => (
            <li
              key={i}
              className="flex flex-col gap-5 bg-sand p-8 lg:p-10"
            >
              <div className="flex items-baseline justify-between">
                <span className="kicker text-5xl text-gold lg:text-6xl">0{i + 1}</span>
                <span className="kicker text-xs tracking-[0.3em] text-clay/50">
                  0{i + 1} / 0{t.steps.length}
                </span>
              </div>
              <h3 className="font-display text-2xl font-light italic text-ink sm:text-3xl">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-clay">{step.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
