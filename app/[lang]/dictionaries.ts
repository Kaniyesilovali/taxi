import 'server-only'
import type { Locale } from './locale'

export type { Locale } from './locale'
export { locales, defaultLocale, hasLocale } from './locale'

const dictionaries = {
  en: () => import('@/dictionaries/en.json').then((m) => m.default),
  tr: () => import('@/dictionaries/tr.json').then((m) => m.default),
  ru: () => import('@/dictionaries/ru.json').then((m) => m.default),
}

export const getDictionary = async (locale: Locale) => dictionaries[locale]()

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>
