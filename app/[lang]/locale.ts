export type Locale = 'en' | 'tr' | 'ru'

export const locales: Locale[] = ['en', 'tr', 'ru']
export const defaultLocale: Locale = 'en'

export const hasLocale = (locale: string): locale is Locale =>
  locales.includes(locale as Locale)
