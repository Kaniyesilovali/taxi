import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale, type Locale } from '@/app/[lang]/dictionaries'
import { PageHero } from '@/app/[lang]/_components/page-hero'
import { ContactForm } from './_components/contact-form'

interface Props {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.contact.title,
    description: dict.contact.subtitle,
    alternates: {
      languages: { en: '/en/contact', tr: '/tr/contact', ru: '/ru/contact' },
    },
  }
}

export default async function ContactPage({ params }: Props) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang as Locale)
  const t = dict.contact

  const channels = [
    { label: t.phoneLabel, value: '+357 99 000 000', href: 'tel:+35799000000' },
    { label: t.emailLabel, value: 'concierge@taxsi.cy', href: 'mailto:concierge@taxsi.cy' },
    {
      label: t.whatsappLabel,
      value: '+357 99 000 000',
      href: 'https://wa.me/35799000000',
      external: true,
    },
  ]

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
          <div>
            <p className="eyebrow text-gold">{t.directHeading}</p>
            <span className="mt-5 block h-px w-12 bg-gold" />
            <ul className="mt-10 flex flex-col">
              {channels.map((c) => (
                <li key={c.label} className="border-t border-clay/15 first:border-t-0">
                  <a
                    href={c.href}
                    target={c.external ? '_blank' : undefined}
                    rel={c.external ? 'noopener noreferrer' : undefined}
                    className="group flex flex-col gap-1 py-6"
                  >
                    <span className="eyebrow text-clay/60 transition-colors group-hover:text-gold">
                      {c.label}
                    </span>
                    <span className="font-display text-2xl font-light italic text-ink transition-colors group-hover:text-gold sm:text-3xl">
                      {c.value}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow text-gold">{t.form.title}</p>
            <span className="mt-5 block h-px w-12 bg-gold" />
            <div className="mt-10">
              <ContactForm t={t.form} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
