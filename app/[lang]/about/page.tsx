import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale, type Locale } from '@/app/[lang]/dictionaries'

interface Props {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.about.title,
    description: dict.about.subtitle,
    alternates: { languages: { en: '/en/about', tr: '/tr/about', ru: '/ru/about' } },
  }
}

export default async function AboutPage({ params }: Props) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang as Locale)
  const t = dict.about

  return (
    <div className="min-h-screen bg-sand">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-5xl font-light italic text-ink">{t.title}</h1>
        <p className="mt-4 text-xl text-clay">{t.subtitle}</p>

        <div className="mt-14 space-y-12">
          <section>
            <h2 className="font-display text-2xl font-light italic text-ink">{t.story.title}</h2>
            <p className="mt-4 leading-relaxed text-clay">{t.story.body}</p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light italic text-ink">{t.mission.title}</h2>
            <p className="mt-4 leading-relaxed text-clay">{t.mission.body}</p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light italic text-ink">{t.values.title}</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {t.values.items.map((item, i) => (
                <div key={i} className="rounded-xl border border-warm bg-cream p-5">
                  <h3 className="font-semibold text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-clay">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-14">
          <Link
            href={`/${lang}/book`}
            className="inline-flex h-12 items-center rounded-full bg-night px-8 text-sm font-medium text-white transition-colors hover:bg-ink"
          >
            {t.cta}
          </Link>
        </div>
      </div>
    </div>
  )
}
