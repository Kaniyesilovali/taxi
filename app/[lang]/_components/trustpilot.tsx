'use client'
import Script from 'next/script'
import { useEffect, useRef } from 'react'
import type { Locale } from '@/app/[lang]/dictionaries'

// Trustpilot integration. Reads its business unit ID from
// NEXT_PUBLIC_TRUSTPILOT_BUSINESS_ID; until that is set the component
// renders a labelled placeholder so the slot is reserved without
// pretending to display real reviews.
//
// To activate:
//   1. Sign in to business.trustpilot.com and copy the business unit
//      ID (a 24-character hex string).
//   2. Add NEXT_PUBLIC_TRUSTPILOT_BUSINESS_ID=<id> to .env.local.
//   3. Optional: override TEMPLATE_ID below to switch widget styles
//      (defaults to the Mini variant — restrained, premium).

const TEMPLATE_ID = '53aa8807dec7e10d38f59f32' // Mini variant — TrustBox widget catalog
const TEMPLATE_HEIGHT = '130px'

const TP_LOCALES: Record<Locale, string> = {
  en: 'en-GB',
  tr: 'tr-TR',
  ru: 'ru-RU',
}

interface TrustpilotProps {
  lang: Locale
  eyebrow: string
}

export function Trustpilot({ lang, eyebrow }: TrustpilotProps) {
  const businessId = process.env.NEXT_PUBLIC_TRUSTPILOT_BUSINESS_ID
  const ref = useRef<HTMLDivElement>(null)

  // The Trustpilot loader scans the page for `.trustpilot-widget`
  // elements once. If we mount after the script has already run, we
  // need to ask it to re-scan via window.Trustpilot.loadFromElement.
  useEffect(() => {
    if (!businessId || !ref.current) return
    const tp = (window as unknown as { Trustpilot?: { loadFromElement: (el: Element, force?: boolean) => void } }).Trustpilot
    if (tp) tp.loadFromElement(ref.current, true)
  }, [businessId])

  if (!businessId) {
    return (
      <section className="bg-cream text-ink">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="flex flex-col items-center gap-3 border border-dashed border-clay/30 px-6 py-8 text-center">
            <p className="eyebrow text-clay/60">{eyebrow}</p>
            <p className="font-display text-lg font-light italic text-clay/70 sm:text-xl">
              Trustpilot widget reserved.
            </p>
            <p className="max-w-md text-xs uppercase tracking-[0.18em] text-clay/40">
              Set NEXT_PUBLIC_TRUSTPILOT_BUSINESS_ID to activate.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-cream text-ink">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="eyebrow mb-6 text-center text-gold">{eyebrow}</p>
        <div
          ref={ref}
          className="trustpilot-widget"
          data-locale={TP_LOCALES[lang] ?? 'en-GB'}
          data-template-id={TEMPLATE_ID}
          data-businessunit-id={businessId}
          data-style-height={TEMPLATE_HEIGHT}
          data-style-width="100%"
          data-theme="light"
        >
          <a
            href={`https://www.trustpilot.com/review/${businessId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-clay/60 underline-offset-4 hover:text-gold hover:underline"
          >
            Trustpilot
          </a>
        </div>
        <Script
          src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
          strategy="lazyOnload"
        />
      </div>
    </section>
  )
}
