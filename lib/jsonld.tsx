// Structured-data helpers. Each builder returns a plain object that the
// <JsonLd> component below stringifies into a script tag. Keep field
// shapes conservative — Google validators are unforgiving with extras.

import type * as React from 'react'

const SITE_URL = 'https://taxsi.cy'
const PHONE = '+357-99-000000'

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Taxsi',
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.ico`,
    sameAs: ['https://instagram.com/', 'https://linkedin.com/'],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'reservations',
        telephone: PHONE,
        availableLanguage: ['en', 'tr', 'ru'],
      },
    ],
  }
}

export function taxiServiceJsonLd(opts?: { url?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TaxiService',
    name: 'Taxsi',
    description: 'Pre-booked private chauffeur transfers across Cyprus',
    provider: {
      '@type': 'Organization',
      name: 'Taxsi',
      url: SITE_URL,
    },
    url: opts?.url ?? SITE_URL,
    areaServed: { '@type': 'Country', name: 'Cyprus' },
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: SITE_URL,
      serviceSmsNumber: PHONE,
      servicePhone: PHONE,
    },
    priceRange: '€20–€125',
  }
}

interface FaqItem {
  q: string
  a: string
}

export function faqPageJsonLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  }
}

interface Crumb {
  name: string
  href: string
}

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.href.startsWith('http') ? c.href : `${SITE_URL}${c.href}`,
    })),
  }
}

export function JsonLd({ data }: { data: object }): React.ReactElement {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
