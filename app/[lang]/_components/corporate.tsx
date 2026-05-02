import type { Dictionary } from '@/app/[lang]/dictionaries'

export function Corporate({ t }: { t: Dictionary['homepage']['corporate'] }) {
  return (
    <section className="relative bg-night text-white">
      <div
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(50% 60% at 100% 0%, rgba(201,169,97,0.15), rgba(10,10,10,0) 70%)',
        }}
      />
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-16 px-4 py-24 sm:px-6 lg:grid-cols-[7fr_5fr] lg:items-center lg:gap-24 lg:py-32">
        <div>
          <p className="eyebrow text-gold">{t.eyebrow}</p>
          <h2 className="mt-5 font-display text-4xl font-light leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            <span className="italic">{t.title}</span>
          </h2>
          <span className="mt-8 block h-px w-16 bg-gold" />
          <p className="mt-8 max-w-lg text-base leading-relaxed text-white/65">{t.body}</p>
        </div>

        <div className="border-l border-white/15 pl-10 lg:pl-12">
          <a
            href="mailto:concierge@taxsi.cy"
            className="group inline-flex flex-col gap-3"
          >
            <span className="eyebrow text-white/45">concierge@taxsi.cy</span>
            <span className="font-display text-2xl font-light italic text-gold transition-colors group-hover:text-white sm:text-3xl">
              {t.cta}
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
