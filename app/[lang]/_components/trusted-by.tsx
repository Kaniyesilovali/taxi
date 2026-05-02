import type { Dictionary } from '@/app/[lang]/dictionaries'

export function TrustedBy({ t }: { t: Dictionary['homepage']['trustedBy'] }) {
  return (
    <section className="relative bg-night text-white">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"
      />
      <div className="grain absolute inset-0 opacity-[0.04]" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <p className="eyebrow text-center text-gold">{t.eyebrow}</p>
        <ul className="mt-10 grid grid-cols-2 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {t.items.map((item, i) => (
            <li
              key={i}
              className="flex flex-col items-center gap-2 px-4 text-center lg:border-l lg:border-white/10 lg:first:border-l-0"
            >
              <span className="font-display text-4xl font-light italic text-gold sm:text-5xl">
                {item.value}
              </span>
              <span className="eyebrow text-white/45">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
