import { notFound } from 'next/navigation'
import { getDictionary, hasLocale, type Locale } from './dictionaries'
import { Header } from './_components/header'
import { Footer } from './_components/footer'
import { WhatsappFab } from './_components/whatsapp-fab'

interface Props {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'tr' }, { lang: 'ru' }]
}

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang as Locale)

  return (
    <div className="flex min-h-full flex-col">
      <Header lang={lang as Locale} nav={dict.nav} />
      <main className="flex-1">{children}</main>
      <Footer lang={lang as Locale} dict={dict} />
      <WhatsappFab ariaLabel={dict.nav.whatsappAria} />
    </div>
  )
}
