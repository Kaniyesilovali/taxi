import type { Dictionary } from '@/app/[lang]/dictionaries'

export function WhyTaxsi({ t }: { t: Dictionary['homepage']['why'] }) {
  return (
    <section className="bg-cream text-ink">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[5fr_7fr] lg:gap-20 lg:py-32">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="eyebrow text-gold">{t.eyebrow}</p>
          <h2 className="mt-5 font-display text-4xl font-light leading-[1.05] tracking-tight text-ink sm:text-5xl">
            <span className="italic">{t.title}</span>
          </h2>
          <span className="mt-8 block h-px w-16 bg-gold" />
        </div>

        <ul className="flex flex-col">
          {t.items.map((item, i) => (
            <li
              key={i}
              className="flex flex-col gap-3 border-t border-clay/15 py-7 first:border-t-0 first:pt-0"
            >
              <h3 className="font-display text-2xl font-light italic leading-tight text-ink sm:text-3xl">
                {item.phrase}
              </h3>
              <p className="max-w-xl text-base leading-relaxed text-clay">{item.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
