import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale, type Locale } from '@/app/[lang]/dictionaries'
import { FaqAccordion } from './_components/faq-accordion'

interface Props {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.faq.title,
    description: dict.faq.subtitle,
    alternates: { languages: { en: '/en/faq', tr: '/tr/faq', ru: '/ru/faq' } },
  }
}

export default async function FaqPage({ params }: Props) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang as Locale)
  const t = dict.faq

  return (
    <div className="min-h-screen bg-sand">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-4xl font-light italic text-ink">{t.title}</h1>
        <p className="mt-3 text-clay">{t.subtitle}</p>
        <div className="mt-12">
          <FaqAccordion sections={t.sections} />
        </div>
      </div>
    </div>
  )
}
