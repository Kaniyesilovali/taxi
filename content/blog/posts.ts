export type Locale = 'en' | 'tr' | 'ru'

export interface BlogPost {
  slug: string
  locale: Locale
  title: string
  description: string
  date: string
}

export const posts: BlogPost[] = [
  {
    slug: 'cyprus-airport-guide',
    locale: 'en',
    title: 'Cyprus Airport Transfer Guide: Everything You Need to Know',
    description: 'A complete guide to getting from Larnaca and Paphos airports to your destination in Cyprus.',
    date: '2026-05-01',
  },
  {
    slug: 'kibris-havalimani-rehberi',
    locale: 'tr',
    title: 'Kıbrıs Havalimanı Transfer Rehberi: Bilmeniz Gereken Her Şey',
    description: "Larnaca ve Paphos havalimanlarından Kıbrıs'taki hedefinize ulaşmanın tam rehberi.",
    date: '2026-05-01',
  },
  {
    slug: 'aeroporty-kipra',
    locale: 'ru',
    title: 'Гид по трансферам из аэропортов Кипра: всё, что нужно знать',
    description: 'Полное руководство по маршрутам из аэропортов Ларнаки и Пафоса.',
    date: '2026-05-01',
  },
]

export function getPostsByLocale(locale: Locale): BlogPost[] {
  return posts.filter((p) => p.locale === locale)
}

export function getPost(slug: string, locale: Locale): BlogPost | undefined {
  return posts.find((p) => p.slug === slug && p.locale === locale)
}
