// Partners strip. Drop in real partner-supplied logos (SVG preferred)
// once the agreements are in place; until then the strip renders a
// restrained typographic band of placeholder names.

import type { Dictionary } from '@/app/[lang]/dictionaries'

interface PartnersProps {
  t: Dictionary['homepage']['partners']
}

const PLACEHOLDER_NAMES = [
  'ANNABELLE RESORT',
  'PARALIMNI HOLDINGS',
  'CORAL HARBOUR HOTEL',
  'CYPRUS LUXURY GROUP',
  'AYIA NAPA CRUISES',
] as const

export function Partners({ t }: PartnersProps) {
  return (
    <section className="bg-cream text-ink">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <p className="eyebrow text-center text-clay/60">{t.eyebrow}</p>
        <ul className="mt-8 grid grid-cols-2 items-center gap-x-6 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
          {PLACEHOLDER_NAMES.map((name) => (
            <li
              key={name}
              className="flex items-center justify-center text-center text-[10px] font-medium uppercase tracking-[0.28em] text-clay/55 lg:text-xs"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
