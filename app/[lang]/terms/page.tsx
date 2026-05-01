import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale, type Locale } from '@/app/[lang]/dictionaries'

interface Props {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang as Locale)
  return { title: dict.terms.title }
}

const content: Record<Locale, React.ReactNode> = {
  en: (
    <>
      <h2>1. Service Description</h2>
      <p>Taxsi provides fixed-price airport transfer services in Cyprus. By making a booking you agree to these terms.</p>
      <h2>2. Booking and Confirmation</h2>
      <p>A booking is confirmed once you receive a booking reference by email and SMS. We reserve the right to cancel bookings in exceptional circumstances and will notify you immediately with a full refund.</p>
      <h2>3. Cancellation Policy</h2>
      <p>Cancellations made more than 24 hours before the transfer: full refund. Cancellations within 24 hours: no refund. No-shows: no refund.</p>
      <h2>4. Payment</h2>
      <p>Online payments are processed securely via Stripe. Cash payments are made to the driver on arrival. All prices are in Euros and include VAT.</p>
      <h2>5. Liability</h2>
      <p>Taxsi is not liable for delays caused by traffic conditions, weather, or circumstances beyond our control. We are not responsible for missed flights or connections.</p>
      <h2>6. Governing Law</h2>
      <p>These terms are governed by the laws of the Republic of Cyprus. Any disputes shall be subject to the exclusive jurisdiction of the courts of Cyprus.</p>
    </>
  ),
  tr: (
    <>
      <h2>1. Hizmet Tanımı</h2>
      <p>Taxsi, Kıbrıs&apos;ta sabit fiyatlı havalimanı transfer hizmetleri sunar. Rezervasyon yaparak bu koşulları kabul etmiş olursunuz.</p>
      <h2>2. Rezervasyon ve Onay</h2>
      <p>E-posta ve SMS ile rezervasyon numarası aldığınızda rezervasyonunuz onaylanmış olur.</p>
      <h2>3. İptal Politikası</h2>
      <p>Transferden 24 saatten fazla önce iptal: tam iade. 24 saat içinde iptal: iade yapılmaz. Gelmeme durumu: iade yapılmaz.</p>
      <h2>4. Ödeme</h2>
      <p>Online ödemeler Stripe üzerinden güvenli şekilde işlenir. Nakit ödemeler varışta sürücüye yapılır. Tüm fiyatlar Euro ve KDV dahildir.</p>
      <h2>5. Sorumluluk</h2>
      <p>Taxsi, trafik, hava koşulları veya kontrolümüz dışındaki sebeplerden kaynaklanan gecikmelerden sorumlu değildir.</p>
      <h2>6. Uygulanacak Hukuk</h2>
      <p>Bu koşullar Kıbrıs Cumhuriyeti hukukuna tabidir.</p>
    </>
  ),
  ru: (
    <>
      <h2>1. Описание услуги</h2>
      <p>Taxsi предоставляет услуги трансфера из аэропортов Кипра по фиксированным ценам. Оформляя бронирование, вы соглашаетесь с данными условиями.</p>
      <h2>2. Бронирование и подтверждение</h2>
      <p>Бронирование считается подтверждённым после получения номера бронирования по email и SMS.</p>
      <h2>3. Политика отмены</h2>
      <p>Отмена более чем за 24 часа: полный возврат. Отмена менее чем за 24 часа: возврат не предусмотрен. Неявка: возврат не предусмотрен.</p>
      <h2>4. Оплата</h2>
      <p>Онлайн-платежи обрабатываются через Stripe. Наличные оплачиваются водителю по прибытии. Все цены в евро, включая НДС.</p>
      <h2>5. Ответственность</h2>
      <p>Taxsi не несёт ответственности за задержки из-за дорожной обстановки, погоды или обстоятельств вне нашего контроля.</p>
      <h2>6. Применимое право</h2>
      <p>Настоящие условия регулируются законодательством Республики Кипр.</p>
    </>
  ),
}

export default async function TermsPage({ params }: Props) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang as Locale)

  return (
    <div className="min-h-screen bg-sand">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-4xl font-light italic text-ink">{dict.terms.title}</h1>
        <p className="mt-2 text-sm text-clay">{dict.terms.lastUpdated}</p>
        <div className="prose prose-stone mt-10 max-w-none [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-light [&_h2]:italic [&_h2]:text-ink [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:text-clay">
          {content[lang as Locale]}
        </div>
      </div>
    </div>
  )
}
