'use client'
import { usePathname, useRouter } from 'next/navigation'
import { locales, type Locale } from '@/app/[lang]/locale'

const labels: Record<Locale, string> = { en: 'EN', tr: 'TR', ru: 'RU' }

export function LanguageSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname()
  const router = useRouter()

  function switchLocale(locale: Locale) {
    const segments = pathname.split('/')
    segments[1] = locale
    router.push(segments.join('/'))
  }

  return (
    <div className="flex items-center gap-1 text-xs">
      {locales.map((locale, i) => (
        <span key={locale} className="flex items-center gap-1">
          {i > 0 && <span className="text-white/20">·</span>}
          <button
            onClick={() => switchLocale(locale)}
            className={
              locale === current
                ? 'font-semibold text-gold'
                : 'text-white/50 hover:text-white transition-colors'
            }
          >
            {labels[locale]}
          </button>
        </span>
      ))}
    </div>
  )
}
