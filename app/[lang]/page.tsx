import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale, type Locale } from './dictionaries'
import { getRoutes } from '@/lib/api/routes'
import { Hero } from './_components/hero'
import { WhyTaxsi } from './_components/why-taxsi'
import { PopularRoutes } from './_components/popular-routes'
import { HowItWorks } from './_components/how-it-works'
import { CtaBanner } from './_components/cta-banner'

interface Props {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.homepage.hero.title,
    description: dict.homepage.hero.subtitle,
    alternates: {
      languages: { en: '/en', tr: '/tr', ru: '/ru' },
    },
  }
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const [dict, routes] = await Promise.all([
    getDictionary(lang as Locale),
    getRoutes(),
  ])

  return (
    <>
      <Hero lang={lang as Locale} t={dict.homepage.hero} />
      <WhyTaxsi t={dict.homepage.why} />
      <PopularRoutes
        lang={lang as Locale}
        t={dict.homepage.routes}
        bookLabel={dict.routes.bookRoute}
        routes={routes}
      />
      <HowItWorks t={dict.homepage.howItWorks} />
      <CtaBanner lang={lang as Locale} t={dict.homepage.cta} />
    </>
  )
}
