import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale, type Locale } from '@/app/[lang]/dictionaries'
import { PageHero } from '@/app/[lang]/_components/page-hero'
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
    <>
      <PageHero
        eyebrow={t.eyebrow}
        title={t.title}
        subtitle={t.subtitle}
        size="md"
      />

      <section className="bg-cream text-ink">
        <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:py-32">
          <FaqAccordion sections={t.sections} />
        </div>
      </section>
    </>
  )
}
