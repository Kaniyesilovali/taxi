import Image from 'next/image'
import type { Dictionary } from '@/app/[lang]/dictionaries'
import { fleetPhotos } from '@/lib/photos'

const fleetKeys = ['sedan', 'van', 'vip'] as const

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
          {t.items.map((item, i) => {
            const photo = fleetPhotos[fleetKeys[i % fleetKeys.length]]
            return (
              <article
                key={item.name}
                className="group relative flex flex-col bg-night transition-colors hover:bg-night-soft"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={photo.url}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover object-center opacity-70 transition-all duration-700 ease-out group-hover:scale-[1.03] group-hover:opacity-85"
                  />
                  {/* gradient veil ensures kicker + hover line stay legible */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(10,10,10,0.45) 0%, rgba(10,10,10,0.05) 40%, rgba(10,10,10,0.6) 100%)',
                    }}
                  />
                  {/* gold accent on hover */}
                  <div className="absolute inset-x-6 bottom-6 h-px w-0 bg-gold transition-all duration-700 ease-out group-hover:w-[calc(100%-3rem)]" />
                  <span
                    className="kicker absolute right-6 top-6 text-xs tracking-[0.3em] text-white/55"
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
            )
          })}
        </div>
      </div>
    </section>
  )
}
