import type { Dictionary } from '@/app/[lang]/dictionaries'

const sculptedGradients = [
  'radial-gradient(140% 100% at 80% 30%, rgba(201,169,97,0.18), rgba(10,10,10,0) 55%), linear-gradient(160deg, #1a1a1a 0%, #0a0a0a 60%, #050505 100%)',
  'radial-gradient(120% 90% at 30% 40%, rgba(201,169,97,0.14), rgba(10,10,10,0) 60%), linear-gradient(200deg, #161616 0%, #0a0a0a 70%, #060606 100%)',
  'radial-gradient(160% 110% at 65% 25%, rgba(201,169,97,0.28), rgba(10,10,10,0) 50%), linear-gradient(150deg, #1f1a12 0%, #0a0a0a 65%, #050505 100%)',
]

export function Fleet({ t }: { t: Dictionary['homepage']['fleet'] }) {
  return (
    <section className="relative bg-night text-white">
      <div className="grain absolute inset-0 opacity-[0.04]" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:py-32">
        <div className="mb-16 max-w-2xl">
          <p className="eyebrow text-gold">{t.eyebrow}</p>
          <h2 className="mt-5 font-display text-4xl font-light leading-[1.05] tracking-tight text-white sm:text-5xl">
            <span className="italic">{t.title}</span>
          </h2>
          <span className="mt-8 block h-px w-16 bg-gold" />
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden bg-white/10 md:grid-cols-3">
          {t.items.map((item, i) => (
            <article
              key={item.name}
              className="group relative flex flex-col bg-night transition-colors hover:bg-night-soft"
            >
              <div
                className="relative aspect-[4/3] overflow-hidden"
                style={{ background: sculptedGradients[i % sculptedGradients.length] }}
              >
                {/* fine horizon line suggesting silhouette */}
                <div className="absolute inset-x-6 bottom-[42%] h-px bg-white/10" />
                {/* gold accent on hover */}
                <div className="absolute inset-x-6 bottom-6 h-px w-0 bg-gold transition-all duration-700 ease-out group-hover:w-[calc(100%-3rem)]" />
                <span
                  className="kicker absolute right-6 top-6 text-xs tracking-[0.3em] text-white/30"
                  aria-hidden
                >
                  0{i + 1} / 03
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-7 lg:p-9">
                <h3 className="font-display text-2xl font-light italic text-white">
                  {item.name}
                </h3>
                <p className="eyebrow text-white/40">{item.capacity}</p>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{item.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
