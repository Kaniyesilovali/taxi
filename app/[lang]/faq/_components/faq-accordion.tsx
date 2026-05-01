'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { Dictionary } from '@/app/[lang]/dictionaries'

type Section = Dictionary['faq']['sections'][number]

export function FaqAccordion({ sections }: { sections: Section[] }) {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <div key={section.title}>
          <h2 className="mb-4 font-display text-xl font-light italic text-ink">{section.title}</h2>
          <div className="divide-y divide-warm rounded-xl border border-warm bg-cream overflow-hidden">
            {section.items.map((item) => {
              const id = `${section.title}-${item.q}`
              const isOpen = open === id
              return (
                <div key={id}>
                  <button
                    onClick={() => setOpen(isOpen ? null : id)}
                    className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-medium text-ink hover:bg-sand/30 transition-colors"
                  >
                    {item.q}
                    <ChevronDown
                      className={cn('size-4 shrink-0 text-clay transition-transform', isOpen && 'rotate-180')}
                    />
                  </button>
                  {isOpen && (
                    <div className="border-t border-warm bg-sand/20 px-6 py-4 text-sm leading-relaxed text-clay">
                      {item.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
