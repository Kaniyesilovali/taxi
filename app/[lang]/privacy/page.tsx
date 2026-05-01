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
  return { title: dict.privacy.title }
}

const content: Record<Locale, React.ReactNode> = {
  en: (
    <>
      <h2>1. What We Collect</h2>
      <p>When you make a booking, we collect: your name, email address, phone number, and optionally your ID or passport number. We also collect your trip details (route, date, time, passenger count).</p>
      <h2>2. Why We Collect It</h2>
      <p>We use your data to process your booking, assign a driver, send you confirmation and status updates by email and SMS, and handle payment processing.</p>
      <h2>3. Third-Party Services</h2>
      <p>We use the following third-party services: <strong>Stripe</strong> for payment processing, <strong>SendGrid</strong> for email notifications, and <strong>Twilio</strong> for SMS notifications. Each service processes your data under their own privacy policies.</p>
      <h2>4. Cookies</h2>
      <p>We use only essential cookies required for the website to function. We do not use tracking or advertising cookies.</p>
      <h2>5. Data Retention</h2>
      <p>Booking data is retained for 3 years for accounting and legal compliance purposes. You may request deletion of your personal data at any time.</p>
      <h2>6. Your Rights</h2>
      <p>You have the right to access, correct, or delete your personal data. Contact us at <a href="mailto:privacy@taxsi.cy">privacy@taxsi.cy</a>.</p>
      <h2>7. Contact</h2>
      <p>For privacy-related questions: <a href="mailto:privacy@taxsi.cy">privacy@taxsi.cy</a></p>
    </>
  ),
  tr: (
    <>
      <h2>1. Topladığımız Veriler</h2>
      <p>Rezervasyon yaptığınızda şunları topluyoruz: adınız, e-posta adresiniz, telefon numaranız ve isteğe bağlı olarak kimlik veya pasaport numaranız.</p>
      <h2>2. Neden Topluyoruz</h2>
      <p>Verilerinizi rezervasyonunuzu işlemek, sürücü atamak, e-posta ve SMS ile onay göndermek için kullanıyoruz.</p>
      <h2>3. Üçüncü Taraf Hizmetler</h2>
      <p>Ödeme için <strong>Stripe</strong>, e-posta bildirimleri için <strong>SendGrid</strong>, SMS bildirimleri için <strong>Twilio</strong> kullanıyoruz.</p>
      <h2>4. Çerezler</h2>
      <p>Yalnızca sitenin çalışması için gerekli zorunlu çerezleri kullanıyoruz.</p>
      <h2>5. Veri Saklama</h2>
      <p>Rezervasyon verileri yasal uyumluluk amacıyla 3 yıl saklanır. Kişisel verilerinizin silinmesini isteyebilirsiniz.</p>
      <h2>6. Haklarınız</h2>
      <p>Kişisel verilerinize erişme, düzeltme veya silme hakkınız vardır. <a href="mailto:privacy@taxsi.cy">privacy@taxsi.cy</a> adresinden iletişime geçin.</p>
    </>
  ),
  ru: (
    <>
      <h2>1. Что мы собираем</h2>
      <p>При бронировании мы собираем: ваше имя, email, номер телефона и, по желанию, номер удостоверения личности или паспорта.</p>
      <h2>2. Зачем мы это собираем</h2>
      <p>Данные используются для обработки бронирования, назначения водителя, отправки подтверждений по email и SMS.</p>
      <h2>3. Сторонние сервисы</h2>
      <p>Мы используем <strong>Stripe</strong> для платежей, <strong>SendGrid</strong> для email-уведомлений, <strong>Twilio</strong> для SMS.</p>
      <h2>4. Файлы cookie</h2>
      <p>Мы используем только необходимые технические файлы cookie. Рекламные или трекинговые cookie не используются.</p>
      <h2>5. Хранение данных</h2>
      <p>Данные о бронированиях хранятся 3 года. Вы можете запросить удаление своих данных в любое время.</p>
      <h2>6. Ваши права</h2>
      <p>Вы имеете право на доступ, исправление или удаление ваших данных. Напишите нам: <a href="mailto:privacy@taxsi.cy">privacy@taxsi.cy</a></p>
    </>
  ),
}

export default async function PrivacyPage({ params }: Props) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang as Locale)

  return (
    <div className="min-h-screen bg-sand">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-4xl font-light italic text-ink">{dict.privacy.title}</h1>
        <p className="mt-2 text-sm text-clay">{dict.privacy.lastUpdated}</p>
        <div className="prose prose-stone mt-10 max-w-none [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-light [&_h2]:italic [&_h2]:text-ink [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:text-clay [&_a]:text-gold [&_a:hover]:text-gold-dark">
          {content[lang as Locale]}
        </div>
      </div>
    </div>
  )
}
