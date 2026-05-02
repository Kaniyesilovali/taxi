'use client'
import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { Dictionary } from '@/app/[lang]/dictionaries'

type Section = Dictionary['faq']['sections'][number]

export function FaqAccordion({ sections }: { sections: Section[] }) {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-20">
      {sections.map((section, sIdx) => (
        <section key={section.title}>
          <div className="mb-10 flex items-baseline justify-between">
            <h2 className="font-display text-3xl font-light italic leading-tight text-ink sm:text-4xl">
              {section.title}
            </h2>
            <span className="kicker text-xs tracking-[0.3em] text-clay/50">
              0{sIdx + 1} / 0{sections.length}
            </span>
          </div>
          <ul className="border-t border-clay/20">
            {section.items.map((item) => {
              const id = `${section.title}-${item.q}`
              const isOpen = open === id
              return (
                <li key={id} className="border-b border-clay/15">
                  <button
                    onClick={() => setOpen(isOpen ? null : id)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left transition-colors hover:text-gold"
                    aria-expanded={isOpen}
                  >
                    <span className="font-display text-lg font-light italic text-ink sm:text-xl">
                      {item.q}
                    </span>
                    <span
                      aria-hidden
                      className={cn(
                        'flex size-9 shrink-0 items-center justify-center border transition-colors',
                        isOpen
                          ? 'border-gold bg-gold text-night'
                          : 'border-clay/30 text-clay/70 group-hover:border-gold group-hover:text-gold'
                      )}
                    >
                      {isOpen ? <Minus className="size-4" /> : <Plus className="size-4" />}
                    </span>
                  </button>
                  <div
                    className={cn(
                      'grid overflow-hidden transition-[grid-template-rows] duration-500 ease-out',
                      isOpen ? 'grid-rows-[1fr] pb-7' : 'grid-rows-[0fr]'
                    )}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <p className="max-w-3xl text-base leading-relaxed text-clay">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
