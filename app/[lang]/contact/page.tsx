import type { Metadata } from 'next'
import { Mail, Phone, MessageCircle } from 'lucide-react'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale, type Locale } from '@/app/[lang]/dictionaries'
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
    alternates: { languages: { en: '/en/contact', tr: '/tr/contact', ru: '/ru/contact' } },
  }
}

export default async function ContactPage({ params }: Props) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang as Locale)
  const t = dict.contact

  return (
    <div className="min-h-screen bg-sand">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-4xl font-light italic text-ink">{t.title}</h1>
        <p className="mt-3 text-clay">{t.subtitle}</p>

        <div className="mt-12 grid gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <a
              href="tel:+35799000000"
              className="flex items-center gap-4 rounded-xl border border-warm bg-cream p-5 transition-colors hover:border-gold/40"
            >
              <div className="flex size-10 items-center justify-center rounded-full bg-gold/10">
                <Phone className="size-5 text-gold" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-clay">{t.phoneLabel}</p>
                <p className="font-semibold text-ink">+357 99 000 000</p>
              </div>
            </a>

            <a
              href="mailto:info@taxsi.cy"
              className="flex items-center gap-4 rounded-xl border border-warm bg-cream p-5 transition-colors hover:border-gold/40"
            >
              <div className="flex size-10 items-center justify-center rounded-full bg-gold/10">
                <Mail className="size-5 text-gold" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-clay">{t.emailLabel}</p>
                <p className="font-semibold text-ink">info@taxsi.cy</p>
              </div>
            </a>

            <a
              href="https://wa.me/35799000000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-xl border border-warm bg-cream p-5 transition-colors hover:border-gold/40"
            >
              <div className="flex size-10 items-center justify-center rounded-full bg-gold/10">
                <MessageCircle className="size-5 text-gold" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-clay">{t.whatsappLabel}</p>
                <p className="font-semibold text-ink">+357 99 000 000</p>
              </div>
            </a>
          </div>

          <div className="rounded-2xl border border-warm bg-cream p-6">
            <h2 className="mb-6 font-semibold text-ink">{t.form.title}</h2>
            <ContactForm t={t.form} />
          </div>
        </div>
      </div>
    </div>
  )
}
