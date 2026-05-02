import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale, type Locale } from './dictionaries'
import { getRoutes } from '@/lib/api/routes'
import { JsonLd, taxiServiceJsonLd } from '@/lib/jsonld'
import { Hero } from './_components/hero'
import { TrustStrip } from './_components/trust-strip'
import { WhyTaxsi } from './_components/why-taxsi'
import { Fleet } from './_components/fleet'
import { Reviews } from './_components/reviews'
import { TrustedBy } from './_components/trusted-by'
import { PopularRoutes } from './_components/popular-routes'
import { HowItWorks } from './_components/how-it-works'
import { Corporate } from './_components/corporate'
import { CtaBanner } from './_components/cta-banner'

interface Props {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.homepage.meta.title,
    description: dict.homepage.meta.description,
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
      <JsonLd data={taxiServiceJsonLd({ url: `https://taxsi.cy/${lang}` })} />
      <Hero lang={lang as Locale} t={dict.homepage.hero} routes={routes} />
      <TrustStrip t={dict.homepage.trust} />
      <WhyTaxsi t={dict.homepage.why} />
      <Fleet t={dict.homepage.fleet} />
      <Reviews t={dict.homepage.reviews} />
      <PopularRoutes lang={lang as Locale} t={dict.homepage.routes} routes={routes} />
      <HowItWorks t={dict.homepage.howItWorks} />
      <TrustedBy t={dict.homepage.trustedBy} />
      <Corporate t={dict.homepage.corporate} />
      <CtaBanner lang={lang as Locale} t={dict.homepage.cta} />
    </>
  )
}
