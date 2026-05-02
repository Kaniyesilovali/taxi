// Structured-data helpers. Each function returns a plain object that
// callers stringify into <script type="application/ld+json">. Keep
// fields conservative — Google validators are unforgiving with extras.

const SITE_URL = 'https://taxsi.cy'
const PHONE = '+357-99-000000'

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Taxsi',
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.ico`,
    sameAs: [
      'https://instagram.com/',
      'https://linkedin.com/',
    ],
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

export function jsonLdScript(data: object) {
  return {
    type: 'application/ld+json' as const,
    dangerouslySetInnerHTML: { __html: JSON.stringify(data) },
  }
}
