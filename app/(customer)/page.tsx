import type { Metadata } from 'next'
import { getRoutes } from '@/lib/api/routes'
import { getExtras } from '@/lib/api/extras'
import { BookingForm } from './_components/booking-form'

export const metadata: Metadata = {
  title: 'Cyprus Airport Transfers — Book Online | Taxsi',
  description:
    'Fixed-price airport transfers across Cyprus. Larnaca & Paphos airports to Nicosia, Limassol, Ayia Napa and more. Book in minutes, pay on arrival or online.',
  alternates: {
    canonical: 'https://taxsi.cy',
  },
  openGraph: {
    title: 'Cyprus Airport Transfers — Book Online | Taxsi',
    description:
      'Fixed-price airport transfers across Cyprus. Larnaca & Paphos airports to Nicosia, Limassol, Ayia Napa and more.',
    url: 'https://taxsi.cy',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TaxiService',
  name: 'Taxsi',
  description: 'Fixed-price Cyprus airport transfer service',
  url: 'https://taxsi.cy',
  areaServed: {
    '@type': 'Country',
    name: 'Cyprus',
  },
  availableChannel: {
    '@type': 'ServiceChannel',
    serviceUrl: 'https://taxsi.cy',
    serviceSmsNumber: '+35799000000',
  },
  priceRange: '€20–€125',
}

export default async function BookingPage() {
  const [routes, extras] = await Promise.all([getRoutes(), getExtras()])
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BookingForm routes={routes} extras={extras} />
    </>
  )
}
