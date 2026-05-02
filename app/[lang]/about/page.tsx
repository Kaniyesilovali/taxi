import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale, type Locale } from '@/app/[lang]/dictionaries'
import { PageHero } from '@/app/[lang]/_components/page-hero'

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
    <>
      <PageHero
        eyebrow={t.eyebrow}
        title={t.title}
        subtitle={t.subtitle}
        size="md"
      />

      <section className="bg-cream text-ink">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 px-4 py-24 sm:px-6 lg:grid-cols-[5fr_7fr] lg:gap-24 lg:py-32">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="eyebrow text-gold">01</p>
            <h2 className="mt-5 font-display text-4xl font-light leading-[1.05] tracking-tight text-ink sm:text-5xl">
              <span className="italic">{t.story.title}</span>
            </h2>
            <span className="mt-8 block h-px w-16 bg-gold" />
          </div>
          <div>
            <p className="text-lg font-light leading-relaxed text-clay">{t.story.body}</p>
          </div>
        </div>

        <div className="border-t border-clay/15">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 px-4 py-24 sm:px-6 lg:grid-cols-[5fr_7fr] lg:gap-24 lg:py-32">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <p className="eyebrow text-gold">02</p>
              <h2 className="mt-5 font-display text-4xl font-light leading-[1.05] tracking-tight text-ink sm:text-5xl">
                <span className="italic">{t.mission.title}</span>
              </h2>
              <span className="mt-8 block h-px w-16 bg-gold" />
            </div>
            <div>
              <p className="text-lg font-light leading-relaxed text-clay">
                {t.mission.body}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-sand text-ink">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-32">
          <div className="mb-16 max-w-2xl">
            <p className="eyebrow text-gold">03</p>
            <h2 className="mt-5 font-display text-4xl font-light leading-[1.05] tracking-tight text-ink sm:text-5xl">
              <span className="italic">{t.values.title}</span>
            </h2>
            <span className="mt-8 block h-px w-16 bg-gold" />
          </div>

          <ol className="grid grid-cols-1 gap-px overflow-hidden bg-clay/20 lg:grid-cols-3">
            {t.values.items.map((item, i) => (
              <li key={i} className="flex flex-col gap-5 bg-sand p-8 lg:p-10">
                <span className="kicker text-xs tracking-[0.3em] text-clay/50">
                  0{i + 1} / 0{t.values.items.length}
                </span>
                <h3 className="font-display text-2xl font-light italic text-ink sm:text-3xl">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-clay">{item.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="relative bg-night text-white">
        <div className="grain absolute inset-0 opacity-[0.05]" aria-hidden />
        <div
          aria-hidden
          className="absolute inset-x-0 -bottom-24 mx-auto h-72 max-w-3xl"
          style={{
            background:
              'radial-gradient(60% 80% at 50% 0%, rgba(201,169,97,0.22), rgba(10,10,10,0) 70%)',
          }}
        />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:py-28">
          <span className="block h-px w-12 bg-gold" />
          <p className="mt-8 max-w-md font-display text-3xl font-light italic leading-snug text-white/80 sm:text-4xl">
            Wherever you&rsquo;re heading. We&rsquo;ve already arrived.
          </p>
          <Link
            href={`/${lang}/book`}
            className="mt-12 inline-flex h-12 items-center border border-gold px-10 text-xs font-medium uppercase tracking-[0.28em] text-gold transition-colors hover:bg-gold hover:text-night"
          >
            {t.cta}
          </Link>
        </div>
      </section>
    </>
  )
}
