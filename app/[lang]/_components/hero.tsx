import Image from 'next/image'
import type { Locale, Dictionary } from '@/app/[lang]/dictionaries'
import type { Route } from '@/lib/types'
import { heroPhoto } from '@/lib/photos'
import { RoutePicker } from './route-picker'

interface HeroProps {
  lang: Locale
  t: Dictionary['homepage']['hero']
  routes: Route[]
}

export function Hero({ lang, t, routes }: HeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-night text-white">
      {/* Cinematic backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Image
          src={heroPhoto.url}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-55"
        />
        {/* darken bottom for picker legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.4) 35%, rgba(10,10,10,0.85) 75%, rgba(10,10,10,1) 100%)',
          }}
        />
        {/* warm glow top-right (headlight halo) */}
        <div
          className="absolute inset-0 mix-blend-screen"
          style={{
            background:
              'radial-gradient(60% 50% at 82% 18%, rgba(201,169,97,0.28), rgba(201,169,97,0) 60%)',
            animation: 'glow-drift 14s ease-in-out infinite',
          }}
        />
        {/* horizon hairline */}
        <div className="absolute inset-x-0 top-[64%] h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <div className="grain" />
      </div>

      <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-between gap-16 px-4 pt-32 pb-12 sm:px-6 sm:pt-36 lg:min-h-[92vh] lg:gap-24 lg:pt-44 lg:pb-16">
        {/* Headline cluster */}
        <div className="max-w-3xl">
          <p
            className="eyebrow text-gold opacity-0"
            style={{ animation: 'reveal 900ms cubic-bezier(0.16,1,0.3,1) forwards' }}
          >
            {t.eyebrow}
          </p>
          <h1
            className="mt-6 font-display text-[15vw] font-light leading-[0.95] tracking-tight text-white opacity-0 sm:text-7xl lg:text-[7.5rem]"
            style={{
              animation: 'reveal 1100ms 120ms cubic-bezier(0.16,1,0.3,1) forwards',
            }}
          >
            <span className="italic">{t.title}</span>
          </h1>
          <p
            className="mt-8 max-w-xl text-base font-light leading-relaxed text-white/65 opacity-0 sm:text-lg"
            style={{
              animation: 'reveal 1100ms 280ms cubic-bezier(0.16,1,0.3,1) forwards',
            }}
          >
            {t.subtitle}
          </p>
        </div>

        {/* Picker panel */}
        <div
          className="relative opacity-0"
          style={{
            animation: 'reveal 1100ms 480ms cubic-bezier(0.16,1,0.3,1) forwards',
          }}
        >
          {/* gold hairline above picker */}
          <div
            className="mb-8 h-px w-24 origin-left bg-gold"
            style={{ animation: 'scale-x 800ms 760ms ease-out both' }}
          />
          <RoutePicker lang={lang} routes={routes} t={t.picker} />
        </div>
      </div>
    </section>
  )
}
