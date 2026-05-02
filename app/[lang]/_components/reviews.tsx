import type { Dictionary } from '@/app/[lang]/dictionaries'

export function Reviews({ t }: { t: Dictionary['homepage']['reviews'] }) {
  return (
    <section className="bg-cream text-ink">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-32">
        <div className="mb-16 max-w-2xl">
          <p className="eyebrow text-gold">{t.eyebrow}</p>
          <h2 className="mt-5 font-display text-4xl font-light leading-[1.05] tracking-tight text-ink sm:text-5xl">
            <span className="italic">{t.title}</span>
          </h2>
          <span className="mt-8 block h-px w-16 bg-gold" />
        </div>

        <ol className="grid grid-cols-1 gap-px overflow-hidden bg-clay/15 lg:grid-cols-3">
          {t.items.map((item, i) => (
            <li
              key={i}
              className="group relative flex flex-col gap-8 bg-cream p-8 transition-colors hover:bg-sand/60 lg:p-10"
            >
              <span
                aria-hidden
                className="kicker text-5xl leading-none text-gold/40 lg:text-6xl"
              >
                &ldquo;
              </span>
              <p className="font-display text-xl font-light italic leading-snug text-ink lg:text-2xl">
                {item.quote}
              </p>
              <div className="mt-auto flex flex-col gap-1 border-t border-clay/15 pt-5">
                <p className="font-display text-base font-medium not-italic text-ink">
                  {item.author}
                </p>
                <p className="text-xs uppercase tracking-[0.18em] text-clay/60">
                  {item.origin} · {item.context}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
