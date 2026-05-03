import { notFound } from 'next/navigation'
import { hasLocale } from '../locale'

interface Props {
  params: Promise<{ lang: string }>
}

export default async function CatchAllNotFound({ params }: Props): Promise<never> {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  notFound()
}
