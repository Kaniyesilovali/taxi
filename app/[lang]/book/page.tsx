import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale, type Locale } from '@/app/[lang]/dictionaries'
import { getRoutes } from '@/lib/api/routes'
import { getExtras } from '@/lib/api/extras'
import { BookingForm } from '@/app/(customer)/_components/booking-form'

interface Props {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang as Locale)
  return { title: dict.nav.book }
}

export default async function BookPage({ params }: Props) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const [routes, extras] = await Promise.all([getRoutes(), getExtras()])
  return <BookingForm routes={routes} extras={extras} />
}
