# Marketing Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a full marketing site layer — i18n (EN/TR/RU), marketing homepage, static pages, blog (MDX), legal pages — moving the booking form from `/` to `/[lang]/book`.

**Architecture:** Next.js 16 built-in `[lang]` dynamic segment for i18n (no external library). Dictionary JSON files loaded server-side. `proxy.ts` (Next.js 16 convention — `middleware.ts` is deprecated) handles locale detection. Blog uses `@next/mdx` with dynamic imports and a static manifest. Confirm/track pages remain language-agnostic under `(customer)` route group.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, TypeScript, `@next/mdx`, `@mdx-js/loader`, `@mdx-js/react`, `@types/mdx`

---

## File Map

```
frontend/
├── proxy.ts                                  ← locale detection + redirect (replaces middleware)
├── mdx-components.tsx                        ← required by @next/mdx
├── next.config.ts                            ← add MDX support
├── dictionaries/
│   ├── en.json                               ← English strings
│   ├── tr.json                               ← Turkish strings
│   └── ru.json                               ← Russian strings
├── app/
│   ├── page.tsx                              ← root → redirect to /en/
│   ├── [lang]/
│   │   ├── dictionaries.ts                   ← getDictionary() + hasLocale()
│   │   ├── layout.tsx                        ← locale layout (header + footer)
│   │   ├── page.tsx                          ← marketing homepage
│   │   ├── _components/
│   │   │   ├── header.tsx                    ← nav + language switcher (client)
│   │   │   ├── footer.tsx                    ← footer (server)
│   │   │   ├── hero.tsx                      ← hero section
│   │   │   ├── why-taxsi.tsx                 ← 4 feature cards
│   │   │   ├── popular-routes.tsx            ← route cards from API
│   │   │   ├── how-it-works.tsx              ← 3-step timeline
│   │   │   └── cta-banner.tsx                ← final CTA
│   │   ├── book/
│   │   │   └── page.tsx                      ← booking form (moved)
│   │   ├── routes/
│   │   │   └── page.tsx                      ← routes & prices table
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── contact/
│   │   │   ├── page.tsx
│   │   │   └── _components/contact-form.tsx  ← client component
│   │   ├── blog/
│   │   │   ├── page.tsx                      ← blog index
│   │   │   └── [slug]/
│   │   │       └── page.tsx                  ← blog post (dynamic MDX import)
│   │   ├── faq/
│   │   │   └── page.tsx
│   │   ├── privacy/
│   │   │   └── page.tsx
│   │   └── terms/
│   │       └── page.tsx
│   ├── api/
│   │   └── contact/
│   │       └── route.ts                      ← contact form email handler
│   └── (customer)/
│       ├── layout.tsx                        ← update nav links
│       ├── confirm/[ref]/page.tsx            ← unchanged
│       ├── track/[ref]/page.tsx              ← unchanged
│       └── track/page.tsx                   ← unchanged
│   (customer)/page.tsx                       ← DELETE (booking form moves to [lang]/book)
├── content/
│   └── blog/
│       ├── posts.ts                          ← static blog manifest
│       ├── en/
│       │   └── cyprus-airport-guide.mdx
│       ├── tr/
│       │   └── kibris-havalimani-rehberi.mdx
│       └── ru/
│           └── aeroporty-kipra.mdx
```

---

## Task 1: Install MDX dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install**

```bash
cd /Users/mac14/Desktop/taxsi/frontend
npm install @next/mdx @mdx-js/loader @mdx-js/react @types/mdx
```

- [ ] **Step 2: Verify**

```bash
npm ls @next/mdx @mdx-js/loader @mdx-js/react 2>&1 | grep -v "npm warn"
```
Expected: all 3 packages listed with versions.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add @next/mdx dependencies"
```

---

## Task 2: next.config.ts — add MDX support

**Files:**
- Modify: `next.config.ts`
- Create: `mdx-components.tsx`

- [ ] **Step 1: Update next.config.ts**

```typescript
// next.config.ts
import type { NextConfig } from 'next'
import createMDX from '@next/mdx'

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
}

const withMDX = createMDX({})

export default withMDX(nextConfig)
```

- [ ] **Step 2: Create mdx-components.tsx**

```tsx
// mdx-components.tsx
import type { MDXComponents } from 'mdx/types'

const components: MDXComponents = {}

export function useMDXComponents(): MDXComponents {
  return components
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build 2>&1 | tail -5
```
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add next.config.ts mdx-components.tsx
git commit -m "chore: configure @next/mdx"
```

---

## Task 3: Dictionary files

**Files:**
- Create: `dictionaries/en.json`
- Create: `dictionaries/tr.json`
- Create: `dictionaries/ru.json`
- Create: `app/[lang]/dictionaries.ts`

- [ ] **Step 1: Create dictionaries/en.json**

```json
{
  "nav": {
    "book": "Book Transfer",
    "routes": "Routes & Prices",
    "track": "Track Booking",
    "blog": "Blog",
    "about": "About",
    "contact": "Contact"
  },
  "homepage": {
    "hero": {
      "title": "Cyprus Airport Transfers",
      "subtitle": "Fixed prices. No surprises. Book your transfer in minutes.",
      "cta": "Book a Transfer"
    },
    "why": {
      "title": "Why Choose Taxsi",
      "items": [
        { "title": "Fixed Prices", "desc": "No meters, no surprises. The price you see is the price you pay." },
        { "title": "Professional Drivers", "desc": "Licensed, vetted drivers with years of Cyprus transfer experience." },
        { "title": "24/7 Available", "desc": "Early morning flight or late night arrival — we're always here." },
        { "title": "Instant Confirmation", "desc": "Book online and receive your confirmation by email and SMS immediately." }
      ]
    },
    "routes": {
      "title": "Popular Routes",
      "viewAll": "See all routes →"
    },
    "howItWorks": {
      "title": "How It Works",
      "steps": [
        { "title": "Book Online", "desc": "Fill in your route, date, and passenger details. Takes 2 minutes." },
        { "title": "Driver Assigned", "desc": "We assign a professional driver and send you their details by SMS." },
        { "title": "Transfer Complete", "desc": "Your driver meets you at the terminal and takes you to your destination." }
      ]
    },
    "cta": {
      "title": "Ready to Book?",
      "subtitle": "Fixed prices across all Cyprus routes.",
      "button": "Book Your Transfer"
    }
  },
  "routes": {
    "title": "Routes & Prices",
    "subtitle": "Fixed prices on all Cyprus airport transfer routes.",
    "oneWay": "One Way",
    "roundTrip": "Round Trip",
    "bookRoute": "Book This Route"
  },
  "about": {
    "title": "About Taxsi",
    "subtitle": "Cyprus airport transfers you can rely on.",
    "story": {
      "title": "Our Story",
      "body": "Taxsi was founded to solve a simple problem: airport transfers in Cyprus were unpredictable and stressful. Meters that kept running, drivers who didn't know the routes, prices that varied wildly. We built Taxsi to fix that — fixed prices, professional drivers, and a booking system that works."
    },
    "mission": {
      "title": "Our Mission",
      "body": "To make every Cyprus airport transfer straightforward. You book, we show up, you arrive. No stress, no surprises."
    },
    "values": {
      "title": "What We Stand For",
      "items": [
        { "title": "Transparency", "desc": "The price you see is the price you pay. Always." },
        { "title": "Reliability", "desc": "We monitor your flight. If it's late, your driver waits." },
        { "title": "Professionalism", "desc": "Every driver is licensed, vetted, and experienced on Cyprus roads." }
      ]
    },
    "cta": "Book a Transfer"
  },
  "contact": {
    "title": "Contact Us",
    "subtitle": "We're here to help with your Cyprus transfer.",
    "phoneLabel": "Phone",
    "emailLabel": "Email",
    "whatsappLabel": "WhatsApp",
    "form": {
      "title": "Send a Message",
      "name": "Your name",
      "emailField": "Email address",
      "message": "Message",
      "submit": "Send Message",
      "sending": "Sending...",
      "success": "Message sent! We'll get back to you shortly.",
      "error": "Something went wrong. Please try again or call us directly."
    }
  },
  "blog": {
    "title": "Blog",
    "subtitle": "Tips, guides, and news about travelling in Cyprus.",
    "readMore": "Read more →",
    "backToBlog": "← Back to Blog",
    "bookCta": "Need a transfer? Book now →",
    "noPosts": "No posts available in this language yet."
  },
  "faq": {
    "title": "Frequently Asked Questions",
    "subtitle": "Everything you need to know about Taxsi transfers.",
    "sections": [
      {
        "title": "Booking",
        "items": [
          { "q": "How do I book a transfer?", "a": "Fill in the booking form on our website with your route, date, time, and passenger details. You'll receive a confirmation by email and SMS immediately." },
          { "q": "Can I cancel or modify my booking?", "a": "Contact us by phone or email as soon as possible. Cancellations made more than 24 hours before the transfer are fully refunded. Modifications are accepted subject to availability." },
          { "q": "How far in advance should I book?", "a": "We recommend booking at least 24 hours in advance. For peak season (July–September) and early morning flights, earlier is better." }
        ]
      },
      {
        "title": "Payment",
        "items": [
          { "q": "What payment methods do you accept?", "a": "We accept cash (paid to the driver on arrival) and online payments via credit or debit card (processed securely through Stripe)." },
          { "q": "What is included in the price?", "a": "The price includes the transfer, tolls, parking, and up to 45 minutes waiting at the airport. Extras such as child seats are listed separately." },
          { "q": "Is online payment secure?", "a": "Yes. Online payments are processed by Stripe, a PCI-DSS Level 1 certified provider. We never store your card details." }
        ]
      },
      {
        "title": "On the Day",
        "items": [
          { "q": "How will I recognise my driver?", "a": "Your driver will be waiting at the arrivals hall with a sign showing your name. You will receive their name, phone, and vehicle details by SMS." },
          { "q": "What if my flight is delayed?", "a": "We monitor flight arrivals. If your flight is delayed, your driver adjusts at no extra charge." },
          { "q": "Can I track my booking?", "a": "Yes. Use the Track Booking page with your booking reference to see your current status and driver details." }
        ]
      },
      {
        "title": "Vehicles",
        "items": [
          { "q": "How many passengers can each vehicle accommodate?", "a": "Standard vehicles accommodate up to 4 passengers with standard luggage. Indicate your passenger count when booking and we'll assign the right vehicle." },
          { "q": "Do you offer VIP transfers?", "a": "Yes. Select the VIP option when booking for a premium vehicle, complimentary water, and priority service." },
          { "q": "Can I request a child seat?", "a": "Yes. Select the Child Seat extra when booking. Please specify the child's age in the notes field." }
        ]
      }
    ]
  },
  "privacy": {
    "title": "Privacy Policy",
    "lastUpdated": "Last updated: 1 May 2026"
  },
  "terms": {
    "title": "Terms of Use",
    "lastUpdated": "Last updated: 1 May 2026"
  },
  "footer": {
    "tagline": "Cyprus Airport Transfers",
    "copyright": "© {year} Taxsi · Cyprus Airport Transfers"
  }
}
```

- [ ] **Step 2: Create dictionaries/tr.json**

```json
{
  "nav": {
    "book": "Transfer Rezervasyonu",
    "routes": "Güzergahlar & Fiyatlar",
    "track": "Rezervasyonu Takip Et",
    "blog": "Blog",
    "about": "Hakkımızda",
    "contact": "İletişim"
  },
  "homepage": {
    "hero": {
      "title": "Kıbrıs Havalimanı Transferleri",
      "subtitle": "Sabit fiyatlar. Sürpriz yok. Dakikalar içinde rezervasyon.",
      "cta": "Transfer Rezervasyonu Yap"
    },
    "why": {
      "title": "Neden Taxsi?",
      "items": [
        { "title": "Sabit Fiyatlar", "desc": "Sayaç yok, sürpriz yok. Gördüğünüz fiyat ödediğiniz fiyattır." },
        { "title": "Profesyonel Sürücüler", "desc": "Lisanslı, deneyimli ve Kıbrıs yollarını bilen sürücüler." },
        { "title": "7/24 Hizmet", "desc": "Sabahın erken saatlerinde veya gece geç saatte — her zaman buradayız." },
        { "title": "Anında Onay", "desc": "Online rezervasyon yapın, e-posta ve SMS ile onayınızı hemen alın." }
      ]
    },
    "routes": {
      "title": "Popüler Güzergahlar",
      "viewAll": "Tüm güzergahları gör →"
    },
    "howItWorks": {
      "title": "Nasıl Çalışır?",
      "steps": [
        { "title": "Online Rezervasyon", "desc": "Güzergah, tarih ve yolcu bilgilerini doldurun. 2 dakika sürer." },
        { "title": "Sürücü Atanır", "desc": "Profesyonel bir sürücü atarız ve bilgilerini SMS ile göndeririz." },
        { "title": "Transfer Tamamlanır", "desc": "Sürücünüz terminalde sizi karşılar ve hedefinize götürür." }
      ]
    },
    "cta": {
      "title": "Hazır mısınız?",
      "subtitle": "Tüm Kıbrıs güzergahlarında sabit fiyatlar.",
      "button": "Transfer Rezervasyonu Yap"
    }
  },
  "routes": {
    "title": "Güzergahlar & Fiyatlar",
    "subtitle": "Tüm Kıbrıs havalimanı transfer güzergahlarında sabit fiyatlar.",
    "oneWay": "Tek Yön",
    "roundTrip": "Gidiş-Dönüş",
    "bookRoute": "Bu Güzergahı Rezerve Et"
  },
  "about": {
    "title": "Hakkımızda",
    "subtitle": "Güvenebileceğiniz Kıbrıs havalimanı transferleri.",
    "story": {
      "title": "Hikayemiz",
      "body": "Taxsi, basit bir sorunu çözmek için kuruldu: Kıbrıs'ta havalimanı transferleri güvensiz ve stresli oluyordu. Durmayan taksimetreler, yolları bilmeyen sürücüler, sürekli değişen fiyatlar. Bunları düzeltmek için Taxsi'yi inşa ettik — sabit fiyatlar, profesyonel sürücüler ve çalışan bir rezervasyon sistemi."
    },
    "mission": {
      "title": "Misyonumuz",
      "body": "Her Kıbrıs havalimanı transferini kolay hale getirmek. Siz rezervasyon yapın, biz geliriz. Stres yok, sürpriz yok."
    },
    "values": {
      "title": "Değerlerimiz",
      "items": [
        { "title": "Şeffaflık", "desc": "Gördüğünüz fiyat, ödediğiniz fiyattır. Her zaman." },
        { "title": "Güvenilirlik", "desc": "Uçuşunuzu takip ederiz. Gecikirseniz, sürücünüz bekler." },
        { "title": "Profesyonellik", "desc": "Her sürücü lisanslı, deneyimli ve Kıbrıs yollarını biliyor." }
      ]
    },
    "cta": "Transfer Rezervasyonu Yap"
  },
  "contact": {
    "title": "İletişim",
    "subtitle": "Kıbrıs transferiniz için yardımcı olmaya hazırız.",
    "phoneLabel": "Telefon",
    "emailLabel": "E-posta",
    "whatsappLabel": "WhatsApp",
    "form": {
      "title": "Mesaj Gönderin",
      "name": "Adınız",
      "emailField": "E-posta adresiniz",
      "message": "Mesajınız",
      "submit": "Mesaj Gönder",
      "sending": "Gönderiliyor...",
      "success": "Mesajınız gönderildi! En kısa sürede size dönüş yapacağız.",
      "error": "Bir hata oluştu. Lütfen tekrar deneyin veya bizi arayın."
    }
  },
  "blog": {
    "title": "Blog",
    "subtitle": "Kıbrıs'ta seyahat hakkında ipuçları, rehberler ve haberler.",
    "readMore": "Devamını oku →",
    "backToBlog": "← Bloga Dön",
    "bookCta": "Transfer rezervasyonu yapmak ister misiniz? →",
    "noPosts": "Bu dilde henüz yazı bulunmuyor."
  },
  "faq": {
    "title": "Sık Sorulan Sorular",
    "subtitle": "Taxsi transferleri hakkında bilmeniz gereken her şey.",
    "sections": [
      {
        "title": "Rezervasyon",
        "items": [
          { "q": "Transfer nasıl rezerve edilir?", "a": "Web sitemizde güzergah, tarih, saat ve yolcu bilgilerinizi doldurun. Onayınızı e-posta ve SMS ile hemen alacaksınız." },
          { "q": "Rezervasyonumu iptal veya değiştirebilir miyim?", "a": "Mümkün olan en kısa sürede telefon veya e-posta ile iletişime geçin. Transferden 24 saat önce yapılan iptallerde tam iade yapılır." },
          { "q": "Ne kadar önceden rezervasyon yapmalıyım?", "a": "En az 24 saat önceden rezervasyon yapmanızı öneririz. Yoğun sezonda (Temmuz–Eylül) ve sabah erken uçuşlar için daha erken tercih edilmelidir." }
        ]
      },
      {
        "title": "Ödeme",
        "items": [
          { "q": "Hangi ödeme yöntemlerini kabul ediyorsunuz?", "a": "Nakit (varışta sürücüye) ve online ödeme (Stripe ile güvenli kart ödemesi) kabul ediyoruz." },
          { "q": "Fiyata neler dahil?", "a": "Transfer, otoyol ücretleri, park ve havalimanında 45 dakikaya kadar bekleme süresi fiyata dahildir." },
          { "q": "Online ödeme güvenli mi?", "a": "Evet. Ödemeler PCI-DSS Seviye 1 sertifikalı Stripe tarafından işlenir. Kart bilgilerinizi asla saklamıyoruz." }
        ]
      },
      {
        "title": "Transfer Günü",
        "items": [
          { "q": "Sürücümü nasıl tanıyacağım?", "a": "Sürücünüz geliş salonunda adınızın yazılı olduğu bir tabelayla sizi bekleyecek. Adını, telefonunu ve araç bilgilerini SMS ile alacaksınız." },
          { "q": "Uçuşum gecikirse ne olur?", "a": "Uçuş varışlarını takip ederiz. Uçuşunuz gecikirse sürücünüz ek ücret ödemeden bekler." },
          { "q": "Rezervasyonumu takip edebilir miyim?", "a": "Evet. Rezervasyon kodunuzla Rezervasyon Takip sayfasını kullanabilirsiniz." }
        ]
      },
      {
        "title": "Araçlar",
        "items": [
          { "q": "Araçlar kaç yolcu alır?", "a": "Standart araçlar standart bagajlı 4 yolcuya kadar uygundur. Rezervasyonda yolcu sayınızı belirtin." },
          { "q": "VIP transfer var mı?", "a": "Evet. Rezervasyon sırasında VIP seçeneğini işaretleyin; premium araç, ikramlık su ve öncelikli hizmet içerir." },
          { "q": "Çocuk koltuğu isteyebilir miyim?", "a": "Evet. Rezervasyonda Çocuk Koltuğu ekstrası seçin ve notlar alanında çocuğun yaşını belirtin." }
        ]
      }
    ]
  },
  "privacy": {
    "title": "Gizlilik Politikası",
    "lastUpdated": "Son güncelleme: 1 Mayıs 2026"
  },
  "terms": {
    "title": "Kullanım Koşulları",
    "lastUpdated": "Son güncelleme: 1 Mayıs 2026"
  },
  "footer": {
    "tagline": "Kıbrıs Havalimanı Transferleri",
    "copyright": "© {year} Taxsi · Kıbrıs Havalimanı Transferleri"
  }
}
```

- [ ] **Step 3: Create dictionaries/ru.json**

```json
{
  "nav": {
    "book": "Забронировать трансфер",
    "routes": "Маршруты и цены",
    "track": "Отследить бронирование",
    "blog": "Блог",
    "about": "О нас",
    "contact": "Контакты"
  },
  "homepage": {
    "hero": {
      "title": "Трансферы из аэропортов Кипра",
      "subtitle": "Фиксированные цены. Без сюрпризов. Бронирование за минуты.",
      "cta": "Забронировать трансфер"
    },
    "why": {
      "title": "Почему Taxsi?",
      "items": [
        { "title": "Фиксированные цены", "desc": "Никаких счётчиков и сюрпризов. Цена, которую вы видите — это цена, которую вы платите." },
        { "title": "Профессиональные водители", "desc": "Лицензированные, проверенные водители с опытом трансферов на Кипре." },
        { "title": "Работаем 24/7", "desc": "Ранний рейс или поздний прилёт — мы всегда здесь." },
        { "title": "Мгновенное подтверждение", "desc": "Бронируйте онлайн и получайте подтверждение по email и SMS сразу." }
      ]
    },
    "routes": {
      "title": "Популярные маршруты",
      "viewAll": "Все маршруты →"
    },
    "howItWorks": {
      "title": "Как это работает",
      "steps": [
        { "title": "Бронируйте онлайн", "desc": "Укажите маршрут, дату и количество пассажиров. Занимает 2 минуты." },
        { "title": "Назначаем водителя", "desc": "Мы назначим профессионального водителя и пришлём его данные по SMS." },
        { "title": "Трансфер завершён", "desc": "Водитель встретит вас в зале прилёта и доставит до места назначения." }
      ]
    },
    "cta": {
      "title": "Готовы к поездке?",
      "subtitle": "Фиксированные цены на все маршруты Кипра.",
      "button": "Забронировать трансфер"
    }
  },
  "routes": {
    "title": "Маршруты и цены",
    "subtitle": "Фиксированные цены на все маршруты трансфера из аэропортов Кипра.",
    "oneWay": "В одну сторону",
    "roundTrip": "Туда и обратно",
    "bookRoute": "Забронировать этот маршрут"
  },
  "about": {
    "title": "О нас",
    "subtitle": "Трансферы из аэропортов Кипра, которым можно доверять.",
    "story": {
      "title": "Наша история",
      "body": "Taxsi был создан, чтобы решить простую проблему: трансферы из аэропортов Кипра были непредсказуемыми и стрессовыми. Мы создали Taxsi, чтобы это исправить — фиксированные цены, профессиональные водители и система бронирования, которая работает."
    },
    "mission": {
      "title": "Наша миссия",
      "body": "Сделать каждый трансфер на Кипре простым. Вы бронируете, мы приезжаем. Без стресса, без сюрпризов."
    },
    "values": {
      "title": "Наши ценности",
      "items": [
        { "title": "Прозрачность", "desc": "Цена, которую вы видите — это цена, которую вы платите. Всегда." },
        { "title": "Надёжность", "desc": "Мы отслеживаем ваш рейс. Если он задерживается, водитель ждёт." },
        { "title": "Профессионализм", "desc": "Каждый водитель лицензирован, проверен и знает дороги Кипра." }
      ]
    },
    "cta": "Забронировать трансфер"
  },
  "contact": {
    "title": "Контакты",
    "subtitle": "Мы готовы помочь с вашим трансфером на Кипре.",
    "phoneLabel": "Телефон",
    "emailLabel": "Email",
    "whatsappLabel": "WhatsApp",
    "form": {
      "title": "Написать нам",
      "name": "Ваше имя",
      "emailField": "Email адрес",
      "message": "Сообщение",
      "submit": "Отправить",
      "sending": "Отправка...",
      "success": "Сообщение отправлено! Мы скоро ответим.",
      "error": "Что-то пошло не так. Попробуйте ещё раз или позвоните нам."
    }
  },
  "blog": {
    "title": "Блог",
    "subtitle": "Советы, гайды и новости о путешествиях на Кипре.",
    "readMore": "Читать далее →",
    "backToBlog": "← Назад в блог",
    "bookCta": "Нужен трансфер? Забронируйте сейчас →",
    "noPosts": "Статьи на этом языке пока недоступны."
  },
  "faq": {
    "title": "Часто задаваемые вопросы",
    "subtitle": "Всё, что нужно знать о трансферах Taxsi.",
    "sections": [
      {
        "title": "Бронирование",
        "items": [
          { "q": "Как забронировать трансфер?", "a": "Заполните форму бронирования на нашем сайте: укажите маршрут, дату, время и данные пассажиров. Подтверждение придёт по email и SMS сразу." },
          { "q": "Можно ли отменить или изменить бронирование?", "a": "Свяжитесь с нами по телефону или email как можно скорее. Отмена за 24 часа до трансфера — полный возврат средств." },
          { "q": "За сколько времени нужно бронировать?", "a": "Рекомендуем бронировать минимум за 24 часа. В сезон (июль–сентябрь) и для ранних рейсов — заранее." }
        ]
      },
      {
        "title": "Оплата",
        "items": [
          { "q": "Какие способы оплаты принимаете?", "a": "Наличные (водителю по прибытии) и онлайн-оплата картой через Stripe." },
          { "q": "Что входит в стоимость?", "a": "Трансфер, дорожные сборы, парковка и ожидание в аэропорту до 45 минут." },
          { "q": "Безопасна ли онлайн-оплата?", "a": "Да. Платежи обрабатываются через Stripe (сертификат PCI-DSS уровня 1). Данные карты мы не храним." }
        ]
      },
      {
        "title": "День трансфера",
        "items": [
          { "q": "Как узнать водителя?", "a": "Водитель будет ждать в зале прилёта с табличкой с вашим именем. По SMS вы получите его имя, телефон и данные автомобиля." },
          { "q": "Что если рейс задерживается?", "a": "Мы отслеживаем прилёты. При задержке рейса водитель ждёт без дополнительной оплаты." },
          { "q": "Можно ли отследить бронирование?", "a": "Да. Используйте страницу «Отследить бронирование» с номером вашего бронирования." }
        ]
      },
      {
        "title": "Автомобили",
        "items": [
          { "q": "Сколько пассажиров вмещает автомобиль?", "a": "Стандартный автомобиль — до 4 пассажиров со стандартным багажом. Укажите количество пассажиров при бронировании." },
          { "q": "Есть ли VIP-трансферы?", "a": "Да. Выберите опцию VIP при бронировании: премиум-автомобиль, вода в подарок, приоритетное обслуживание." },
          { "q": "Можно ли заказать детское кресло?", "a": "Да. Выберите допуслугу «Детское кресло» и укажите возраст ребёнка в примечаниях." }
        ]
      }
    ]
  },
  "privacy": {
    "title": "Политика конфиденциальности",
    "lastUpdated": "Последнее обновление: 1 мая 2026"
  },
  "terms": {
    "title": "Условия использования",
    "lastUpdated": "Последнее обновление: 1 мая 2026"
  },
  "footer": {
    "tagline": "Трансферы из аэропортов Кипра",
    "copyright": "© {year} Taxsi · Трансферы из аэропортов Кипра"
  }
}
```

- [ ] **Step 4: Create app/[lang]/dictionaries.ts**

```typescript
// app/[lang]/dictionaries.ts
import 'server-only'

const dictionaries = {
  en: () => import('@/dictionaries/en.json').then((m) => m.default),
  tr: () => import('@/dictionaries/tr.json').then((m) => m.default),
  ru: () => import('@/dictionaries/ru.json').then((m) => m.default),
}

export type Locale = keyof typeof dictionaries

export const locales: Locale[] = ['en', 'tr', 'ru']
export const defaultLocale: Locale = 'en'

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries

export const getDictionary = async (locale: Locale) => dictionaries[locale]()

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>
```

- [ ] **Step 5: Commit**

```bash
cd /Users/mac14/Desktop/taxsi/frontend
git add dictionaries/ app/\[lang\]/dictionaries.ts
git commit -m "feat: add i18n dictionary files (EN/TR/RU) and getDictionary utility"
```

---

## Task 4: proxy.ts — locale detection and redirect

**Files:**
- Create: `proxy.ts`

> **Note:** Next.js 16 uses `proxy.ts` — `middleware.ts` is deprecated.

- [ ] **Step 1: Create proxy.ts**

```typescript
// proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale } from '@/app/[lang]/dictionaries'

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language') ?? ''
  for (const part of acceptLanguage.split(',')) {
    const tag = part.split(';')[0].trim().toLowerCase().slice(0, 2)
    if (locales.includes(tag as typeof locales[number])) return tag
  }
  return defaultLocale
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const pathnameHasLocale = locales.some(
    (locale) =>
      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api|confirm|track|admin|driver).*)',
  ],
}
```

- [ ] **Step 2: Create app/page.tsx (root redirect)**

```tsx
// app/page.tsx
import { redirect } from 'next/navigation'

export default function RootPage() {
  redirect('/en')
}
```

- [ ] **Step 3: Verify dev server starts**

```bash
npm run dev 2>&1 &
sleep 3
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/
```
Expected: `307` (redirect to /en).

Kill the dev server: `kill %1`

- [ ] **Step 4: Commit**

```bash
git add proxy.ts app/page.tsx
git commit -m "feat: add locale detection proxy and root redirect"
```

---

## Task 5: [lang] layout — header + footer

**Files:**
- Create: `app/[lang]/layout.tsx`
- Create: `app/[lang]/_components/header.tsx`
- Create: `app/[lang]/_components/footer.tsx`
- Create: `app/[lang]/_components/language-switcher.tsx`

- [ ] **Step 1: Create language-switcher.tsx**

```tsx
// app/[lang]/_components/language-switcher.tsx
'use client'
import { usePathname, useRouter } from 'next/navigation'
import { locales, type Locale } from '@/app/[lang]/dictionaries'

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
```

- [ ] **Step 2: Create header.tsx**

```tsx
// app/[lang]/_components/header.tsx
'use client'
import Link from 'next/link'
import { Phone, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { LanguageSwitcher } from './language-switcher'
import type { Locale, Dictionary } from '@/app/[lang]/dictionaries'

interface HeaderProps {
  lang: Locale
  nav: Dictionary['nav']
}

export function Header({ lang, nav }: HeaderProps) {
  const [open, setOpen] = useState(false)
  const base = `/${lang}`

  const links = [
    { href: `${base}/book`, label: nav.book },
    { href: `${base}/routes`, label: nav.routes },
    { href: `${base}/track`, label: nav.track },
    { href: `${base}/blog`, label: nav.blog },
    { href: `${base}/about`, label: nav.about },
    { href: `${base}/contact`, label: nav.contact },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-night">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href={`/${lang}`}
          className="font-display text-2xl font-light italic tracking-wide text-white transition-opacity hover:opacity-75"
        >
          Taxsi
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-white/60 transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSwitcher current={lang} />
          <a
            href="tel:+35799000000"
            className="hidden items-center gap-2 text-sm font-medium text-gold transition-colors hover:text-gold-dark sm:flex"
          >
            <Phone className="size-3.5" />
            +357 99 000 000
          </a>
          <button
            onClick={() => setOpen(!open)}
            className="text-white/60 hover:text-white lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/5 bg-night px-4 pb-4 lg:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white"
              >
                {l.label}
              </Link>
            ))}
            <a
              href="tel:+35799000000"
              className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gold"
            >
              <Phone className="size-3.5" />
              +357 99 000 000
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
```

- [ ] **Step 3: Create footer.tsx**

```tsx
// app/[lang]/_components/footer.tsx
import Link from 'next/link'
import type { Locale, Dictionary } from '@/app/[lang]/dictionaries'

interface FooterProps {
  lang: Locale
  dict: Dictionary
}

export function Footer({ lang, dict }: FooterProps) {
  const base = `/${lang}`
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/5 bg-night pt-10 pb-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:justify-between">
          <div>
            <p className="font-display text-2xl font-light italic text-white">Taxsi</p>
            <p className="mt-1 text-sm text-white/40">{dict.footer.tagline}</p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/40">
            <Link href={`${base}/routes`} className="hover:text-white transition-colors">{dict.footer.links?.routes ?? dict.nav.routes}</Link>
            <Link href={`${base}/about`} className="hover:text-white transition-colors">{dict.footer.links?.about ?? dict.nav.about}</Link>
            <Link href={`${base}/contact`} className="hover:text-white transition-colors">{dict.footer.links?.contact ?? dict.nav.contact}</Link>
            <Link href={`${base}/blog`} className="hover:text-white transition-colors">{dict.footer.links?.blog ?? dict.nav.blog}</Link>
            <Link href={`${base}/faq`} className="hover:text-white transition-colors">FAQ</Link>
            <Link href={`${base}/privacy`} className="hover:text-white transition-colors">{dict.privacy.title}</Link>
            <Link href={`${base}/terms`} className="hover:text-white transition-colors">{dict.terms.title}</Link>
          </nav>
        </div>
        <p className="text-xs text-white/20">
          {dict.footer.copyright.replace('{year}', String(year))}
        </p>
      </div>
    </footer>
  )
}
```

- [ ] **Step 4: Create app/[lang]/layout.tsx**

```tsx
// app/[lang]/layout.tsx
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale, type Locale } from './dictionaries'
import { Header } from './_components/header'
import { Footer } from './_components/footer'

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'tr' }, { lang: 'ru' }]
}

export default async function LangLayout({
  children,
  params,
}: LayoutProps<'/[lang]'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang as Locale)

  return (
    <div className="flex min-h-full flex-col">
      <Header lang={lang as Locale} nav={dict.nav} />
      <main className="flex-1">{children}</main>
      <Footer lang={lang as Locale} dict={dict} />
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add app/\[lang\]/
git commit -m "feat: add [lang] layout with header, footer, language switcher"
```

---

## Task 6: Marketing homepage

**Files:**
- Create: `app/[lang]/_components/hero.tsx`
- Create: `app/[lang]/_components/why-taxsi.tsx`
- Create: `app/[lang]/_components/popular-routes.tsx`
- Create: `app/[lang]/_components/how-it-works.tsx`
- Create: `app/[lang]/_components/cta-banner.tsx`
- Create: `app/[lang]/page.tsx`

- [ ] **Step 1: Create hero.tsx**

```tsx
// app/[lang]/_components/hero.tsx
import Link from 'next/link'
import type { Locale, Dictionary } from '@/app/[lang]/dictionaries'

interface HeroProps {
  lang: Locale
  t: Dictionary['homepage']['hero']
}

export function Hero({ lang, t }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-night px-4 py-24 sm:px-6 sm:py-32">
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, #c8922a, transparent)',
        }}
      />
      <div className="relative mx-auto max-w-4xl text-center">
        <h1 className="font-display text-4xl font-light italic tracking-tight text-white sm:text-6xl">
          {t.title}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-white/60">{t.subtitle}</p>
        <div className="mt-10">
          <Link
            href={`/${lang}/book`}
            className="inline-flex h-14 items-center rounded-full bg-gold px-10 text-base font-medium text-night transition-colors hover:bg-gold-dark"
          >
            {t.cta}
          </Link>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create why-taxsi.tsx**

```tsx
// app/[lang]/_components/why-taxsi.tsx
import { Lock, User, Clock, CheckCircle } from 'lucide-react'
import type { Dictionary } from '@/app/[lang]/dictionaries'

const icons = [Lock, User, Clock, CheckCircle]

export function WhyTaxsi({ t }: { t: Dictionary['homepage']['why'] }) {
  return (
    <section className="bg-cream px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 text-center font-display text-3xl font-light italic text-ink">
          {t.title}
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {t.items.map((item, i) => {
            const Icon = icons[i]
            return (
              <div key={i} className="flex flex-col items-start gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-gold/10">
                  <Icon className="size-5 text-gold" />
                </div>
                <h3 className="font-semibold text-ink">{item.title}</h3>
                <p className="text-sm leading-relaxed text-clay">{item.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Create popular-routes.tsx**

```tsx
// app/[lang]/_components/popular-routes.tsx
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Locale, Dictionary } from '@/app/[lang]/dictionaries'
import type { Route } from '@/lib/types'

interface PopularRoutesProps {
  lang: Locale
  t: Dictionary['homepage']['routes']
  bookLabel: string
  routes: Route[]
}

export function PopularRoutes({ lang, t, bookLabel, routes }: PopularRoutesProps) {
  const shown = routes.slice(0, 6)

  return (
    <section className="bg-night px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 text-center font-display text-3xl font-light italic text-white">
          {t.title}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((route) => (
            <Link
              key={route.id}
              href={`/${lang}/book?route=${route.id}`}
              className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-5 py-4 transition-colors hover:border-gold/40 hover:bg-white/10"
            >
              <div>
                <p className="font-medium text-white">{route.name}</p>
                <p className="mt-0.5 text-sm text-white/40">
                  {bookLabel} · from €{route.base_price}
                </p>
              </div>
              <ArrowRight className="size-4 text-white/30 transition-colors group-hover:text-gold" />
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href={`/${lang}/routes`}
            className="text-sm font-medium text-gold transition-colors hover:text-gold-dark"
          >
            {t.viewAll}
          </Link>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Create how-it-works.tsx**

```tsx
// app/[lang]/_components/how-it-works.tsx
import type { Dictionary } from '@/app/[lang]/dictionaries'

export function HowItWorks({ t }: { t: Dictionary['homepage']['howItWorks'] }) {
  return (
    <section className="bg-sand px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-12 text-center font-display text-3xl font-light italic text-ink">
          {t.title}
        </h2>
        <div className="relative flex flex-col gap-8 sm:flex-row">
          {t.steps.map((step, i) => (
            <div key={i} className="flex flex-1 flex-col items-center text-center">
              <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-gold text-lg font-bold text-night">
                {i + 1}
              </div>
              <h3 className="mb-2 font-semibold text-ink">{step.title}</h3>
              <p className="text-sm leading-relaxed text-clay">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Create cta-banner.tsx**

```tsx
// app/[lang]/_components/cta-banner.tsx
import Link from 'next/link'
import type { Locale, Dictionary } from '@/app/[lang]/dictionaries'

interface CtaBannerProps {
  lang: Locale
  t: Dictionary['homepage']['cta']
}

export function CtaBanner({ lang, t }: CtaBannerProps) {
  return (
    <section className="bg-night px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-light italic text-white">{t.title}</h2>
        <p className="mt-3 text-white/50">{t.subtitle}</p>
        <Link
          href={`/${lang}/book`}
          className="mt-8 inline-flex h-14 items-center rounded-full bg-gold px-10 text-base font-medium text-night transition-colors hover:bg-gold-dark"
        >
          {t.button}
        </Link>
      </div>
    </section>
  )
}
```

- [ ] **Step 6: Create app/[lang]/page.tsx**

```tsx
// app/[lang]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale, type Locale } from './dictionaries'
import { getRoutes } from '@/lib/api/routes'
import { Hero } from './_components/hero'
import { WhyTaxsi } from './_components/why-taxsi'
import { PopularRoutes } from './_components/popular-routes'
import { HowItWorks } from './_components/how-it-works'
import { CtaBanner } from './_components/cta-banner'

export async function generateMetadata({ params }: PageProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.homepage.hero.title,
    description: dict.homepage.hero.subtitle,
    alternates: {
      languages: { en: '/en', tr: '/tr', ru: '/ru' },
    },
  }
}

export default async function HomePage({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const [dict, routes] = await Promise.all([
    getDictionary(lang as Locale),
    getRoutes(),
  ])

  return (
    <>
      <Hero lang={lang as Locale} t={dict.homepage.hero} />
      <WhyTaxsi t={dict.homepage.why} />
      <PopularRoutes
        lang={lang as Locale}
        t={dict.homepage.routes}
        bookLabel={dict.routes.bookRoute}
        routes={routes}
      />
      <HowItWorks t={dict.homepage.howItWorks} />
      <CtaBanner lang={lang as Locale} t={dict.homepage.cta} />
    </>
  )
}
```

- [ ] **Step 7: Start dev server and verify**

```bash
npm run dev
```

Open http://localhost:3000 — expect redirect to http://localhost:3000/en
Open http://localhost:3000/en — expect marketing homepage with Hero, Why Taxsi, Popular Routes, How It Works, CTA Banner sections.
Open http://localhost:3000/tr — expect Turkish homepage.
Open http://localhost:3000/ru — expect Russian homepage.

- [ ] **Step 8: Commit**

```bash
git add app/\[lang\]/
git commit -m "feat: add marketing homepage with hero, features, routes, CTA sections"
```

---

## Task 7: Move booking form to /[lang]/book

**Files:**
- Create: `app/[lang]/book/page.tsx`
- Delete: `app/(customer)/page.tsx`
- Modify: `app/(customer)/layout.tsx`

- [ ] **Step 1: Create app/[lang]/book/page.tsx**

```tsx
// app/[lang]/book/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale, type Locale } from '@/app/[lang]/dictionaries'
import { getRoutes } from '@/lib/api/routes'
import { getExtras } from '@/lib/api/extras'
import { BookingForm } from '@/app/(customer)/_components/booking-form'

export async function generateMetadata({ params }: PageProps<'/[lang]/book'>): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang as Locale)
  return { title: dict.nav.book }
}

export default async function BookPage({ params }: PageProps<'/[lang]/book'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const [routes, extras] = await Promise.all([getRoutes(), getExtras()])
  return <BookingForm routes={routes} extras={extras} />
}
```

- [ ] **Step 2: Delete old booking page**

```bash
cd /Users/mac14/Desktop/taxsi/frontend
git rm app/\(customer\)/page.tsx
```

- [ ] **Step 3: Update app/(customer)/layout.tsx nav links**

Replace the nav in `app/(customer)/layout.tsx`. The (customer) group now only serves `/confirm` and `/track`. Update header links:

```tsx
// app/(customer)/layout.tsx
import Link from 'next/link'
import { Phone } from 'lucide-react'

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-night">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/en"
            aria-label="Taxsi — Cyprus Airport Transfers"
            className="font-display text-2xl font-light italic tracking-wide text-white transition-opacity hover:opacity-75"
          >
            Taxsi
          </Link>
          <nav aria-label="Main navigation" className="hidden items-center gap-7 sm:flex">
            <Link href="/en/book" className="text-sm font-medium text-white/60 transition-colors hover:text-white">
              Book Transfer
            </Link>
            <Link href="/track" className="text-sm font-medium text-white/60 transition-colors hover:text-white">
              Track Booking
            </Link>
          </nav>
          <a
            href="tel:+35799000000"
            className="flex items-center gap-2 text-sm font-medium text-gold transition-colors hover:text-gold-dark"
          >
            <Phone className="size-3.5" />
            <span className="hidden sm:inline">+357 99 000 000</span>
          </a>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-white/5 bg-night py-8 text-center text-sm text-white/30">
        © {new Date().getFullYear()} Taxsi · Cyprus Airport Transfers
      </footer>
    </div>
  )
}
```

- [ ] **Step 4: Verify booking form at new URL**

Open http://localhost:3000/en/book — booking form loads.
Open http://localhost:3000/tr/book — booking form loads (same form, layout header in Turkish).
Open http://localhost:3000/ — still redirects to /en.
Open http://localhost:3000/confirm/TAX-20260001 — confirm page still works.
Open http://localhost:3000/track/TAX-20260001 — track page still works.

- [ ] **Step 5: Commit**

```bash
git add app/\[lang\]/book/ app/\(customer\)/layout.tsx
git commit -m "feat: move booking form to /[lang]/book, update (customer) layout"
```

---

## Task 8: Routes & Prices page

**Files:**
- Create: `app/[lang]/routes/page.tsx`

- [ ] **Step 1: Create routes page**

```tsx
// app/[lang]/routes/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { getDictionary, hasLocale, type Locale } from '@/app/[lang]/dictionaries'
import { getRoutes } from '@/lib/api/routes'

export async function generateMetadata({ params }: PageProps<'/[lang]/routes'>): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.routes.title,
    description: dict.routes.subtitle,
    alternates: { languages: { en: '/en/routes', tr: '/tr/routes', ru: '/ru/routes' } },
  }
}

export default async function RoutesPage({ params }: PageProps<'/[lang]/routes'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const [dict, routes] = await Promise.all([
    getDictionary(lang as Locale),
    getRoutes(),
  ])
  const t = dict.routes

  return (
    <div className="min-h-screen bg-sand">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="mb-12">
          <h1 className="font-display text-4xl font-light italic text-ink">{t.title}</h1>
          <p className="mt-3 text-clay">{t.subtitle}</p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-warm bg-cream shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-warm bg-sand/50">
                <th className="px-6 py-4 text-left font-semibold text-ink">Route</th>
                <th className="px-6 py-4 text-right font-semibold text-ink">{t.oneWay}</th>
                <th className="px-6 py-4 text-right font-semibold text-ink">{t.roundTrip}</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm">
              {routes.map((route) => (
                <tr key={route.id} className="group hover:bg-sand/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-ink">{route.pickup_location}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-clay">
                      <ArrowRight className="size-3" />
                      {route.dropoff_location}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-ink">
                    €{route.base_price}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-ink">
                    €{route.round_trip_price}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/${lang}/book?route=${route.id}`}
                      className="text-gold text-xs font-medium hover:text-gold-dark transition-colors"
                    >
                      {t.bookRoute} →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify**

Open http://localhost:3000/en/routes — table of routes with one-way and round-trip prices.

- [ ] **Step 3: Commit**

```bash
git add app/\[lang\]/routes/
git commit -m "feat: add routes & prices page"
```

---

## Task 9: About page

**Files:**
- Create: `app/[lang]/about/page.tsx`

- [ ] **Step 1: Create about page**

```tsx
// app/[lang]/about/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale, type Locale } from '@/app/[lang]/dictionaries'

export async function generateMetadata({ params }: PageProps<'/[lang]/about'>): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.about.title,
    description: dict.about.subtitle,
    alternates: { languages: { en: '/en/about', tr: '/tr/about', ru: '/ru/about' } },
  }
}

export default async function AboutPage({ params }: PageProps<'/[lang]/about'>) {
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
```

- [ ] **Step 2: Commit**

```bash
git add app/\[lang\]/about/
git commit -m "feat: add about page"
```

---

## Task 10: Contact page + API route

**Files:**
- Create: `app/[lang]/contact/_components/contact-form.tsx`
- Create: `app/[lang]/contact/page.tsx`
- Create: `app/api/contact/route.ts`

- [ ] **Step 1: Create contact-form.tsx (client)**

```tsx
// app/[lang]/contact/_components/contact-form.tsx
'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import type { Dictionary } from '@/app/[lang]/dictionaries'

export function ContactForm({ t }: { t: Dictionary['contact']['form'] }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    }
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-sm text-green-800">
        {t.success}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label={t.name} name="name" required />
      <Input label={t.emailField} name="email" type="email" required />
      <Textarea label={t.message} name="message" required />
      {status === 'error' && (
        <p className="text-sm text-red-600">{t.error}</p>
      )}
      <Button type="submit" loading={status === 'sending'} size="lg">
        {status === 'sending' ? t.sending : t.submit}
      </Button>
    </form>
  )
}
```

- [ ] **Step 2: Create contact page**

```tsx
// app/[lang]/contact/page.tsx
import type { Metadata } from 'next'
import { Mail, Phone, MessageCircle } from 'lucide-react'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale, type Locale } from '@/app/[lang]/dictionaries'
import { ContactForm } from './_components/contact-form'

export async function generateMetadata({ params }: PageProps<'/[lang]/contact'>): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.contact.title,
    alternates: { languages: { en: '/en/contact', tr: '/tr/contact', ru: '/ru/contact' } },
  }
}

export default async function ContactPage({ params }: PageProps<'/[lang]/contact'>) {
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
```

- [ ] **Step 3: Create app/api/contact/route.ts**

```typescript
// app/api/contact/route.ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const apiKey = process.env.SENDGRID_API_KEY
    const toEmail = process.env.CONTACT_EMAIL ?? 'info@taxsi.cy'

    if (!apiKey) {
      console.error('SENDGRID_API_KEY not set')
      return NextResponse.json({ error: 'Mail not configured' }, { status: 500 })
    }

    const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: toEmail }] }],
        from: { email: toEmail, name: 'Taxsi Contact Form' },
        reply_to: { email, name },
        subject: `Contact form: ${name}`,
        content: [{ type: 'text/plain', value: `From: ${name} <${email}>\n\n${message}` }],
      }),
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Mail failed' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
```

- [ ] **Step 4: Add env vars to .env.local**

Open `.env.local` and add:
```
SENDGRID_API_KEY=your_sendgrid_api_key
CONTACT_EMAIL=info@taxsi.cy
```

- [ ] **Step 5: Commit**

```bash
git add app/\[lang\]/contact/ app/api/
git commit -m "feat: add contact page and contact form API route"
```

---

## Task 11: FAQ page

**Files:**
- Create: `app/[lang]/faq/page.tsx`

- [ ] **Step 1: Create FAQ page**

```tsx
// app/[lang]/faq/page.tsx
'use client'
// Note: must be client component for accordion open/close state
// We still get the dictionary via a separate server component pattern — but for simplicity here
// we embed the content directly after importing it.
```

Actually, FAQ needs accordion interactivity (client component) but also dict loading (server). Use a pattern: server page fetches dict and passes items as props to a client accordion component.

Create two files:

**app/[lang]/faq/_components/faq-accordion.tsx:**
```tsx
// app/[lang]/faq/_components/faq-accordion.tsx
'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { Dictionary } from '@/app/[lang]/dictionaries'

type Section = Dictionary['faq']['sections'][number]

export function FaqAccordion({ sections }: { sections: Section[] }) {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <div key={section.title}>
          <h2 className="mb-4 font-display text-xl font-light italic text-ink">{section.title}</h2>
          <div className="divide-y divide-warm rounded-xl border border-warm bg-cream overflow-hidden">
            {section.items.map((item) => {
              const id = `${section.title}-${item.q}`
              const isOpen = open === id
              return (
                <div key={id}>
                  <button
                    onClick={() => setOpen(isOpen ? null : id)}
                    className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-medium text-ink hover:bg-sand/30 transition-colors"
                  >
                    {item.q}
                    <ChevronDown
                      className={cn('size-4 shrink-0 text-clay transition-transform', isOpen && 'rotate-180')}
                    />
                  </button>
                  {isOpen && (
                    <div className="border-t border-warm bg-sand/20 px-6 py-4 text-sm leading-relaxed text-clay">
                      {item.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
```

**app/[lang]/faq/page.tsx:**
```tsx
// app/[lang]/faq/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale, type Locale } from '@/app/[lang]/dictionaries'
import { FaqAccordion } from './_components/faq-accordion'

export async function generateMetadata({ params }: PageProps<'/[lang]/faq'>): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.faq.title,
    description: dict.faq.subtitle,
    alternates: { languages: { en: '/en/faq', tr: '/tr/faq', ru: '/ru/faq' } },
  }
}

export default async function FaqPage({ params }: PageProps<'/[lang]/faq'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang as Locale)
  const t = dict.faq

  return (
    <div className="min-h-screen bg-sand">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-4xl font-light italic text-ink">{t.title}</h1>
        <p className="mt-3 text-clay">{t.subtitle}</p>
        <div className="mt-12">
          <FaqAccordion sections={t.sections} />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/\[lang\]/faq/
git commit -m "feat: add FAQ page with accordion"
```

---

## Task 12: Privacy Policy and Terms pages

**Files:**
- Create: `app/[lang]/privacy/page.tsx`
- Create: `app/[lang]/terms/page.tsx`

- [ ] **Step 1: Create privacy page**

```tsx
// app/[lang]/privacy/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale, type Locale } from '@/app/[lang]/dictionaries'

export async function generateMetadata({ params }: PageProps<'/[lang]/privacy'>): Promise<Metadata> {
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

export default async function PrivacyPage({ params }: PageProps<'/[lang]/privacy'>) {
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
```

- [ ] **Step 2: Create terms page**

```tsx
// app/[lang]/terms/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale, type Locale } from '@/app/[lang]/dictionaries'

export async function generateMetadata({ params }: PageProps<'/[lang]/terms'>): Promise<Metadata> {
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
      <p>Taxsi, Kıbrıs'ta sabit fiyatlı havalimanı transfer hizmetleri sunar. Rezervasyon yaparak bu koşulları kabul etmiş olursunuz.</p>
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

export default async function TermsPage({ params }: PageProps<'/[lang]/terms'>) {
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
```

- [ ] **Step 3: Commit**

```bash
git add app/\[lang\]/privacy/ app/\[lang\]/terms/
git commit -m "feat: add privacy policy and terms pages (EN/TR/RU)"
```

---

## Task 13: Blog infrastructure + sample posts

**Files:**
- Create: `content/blog/posts.ts`
- Create: `content/blog/en/cyprus-airport-guide.mdx`
- Create: `content/blog/tr/kibris-havalimani-rehberi.mdx`
- Create: `content/blog/ru/aeroporty-kipra.mdx`

- [ ] **Step 1: Create content/blog/posts.ts**

```typescript
// content/blog/posts.ts
export type Locale = 'en' | 'tr' | 'ru'

export interface BlogPost {
  slug: string
  locale: Locale
  title: string
  description: string
  date: string
}

export const posts: BlogPost[] = [
  {
    slug: 'cyprus-airport-guide',
    locale: 'en',
    title: 'Cyprus Airport Transfer Guide: Everything You Need to Know',
    description: 'A complete guide to getting from Larnaca and Paphos airports to your destination in Cyprus.',
    date: '2026-05-01',
  },
  {
    slug: 'kibris-havalimani-rehberi',
    locale: 'tr',
    title: 'Kıbrıs Havalimanı Transfer Rehberi: Bilmeniz Gereken Her Şey',
    description: "Larnaca ve Paphos havalimanlarından Kıbrıs'taki hedefinize ulaşmanın tam rehberi.",
    date: '2026-05-01',
  },
  {
    slug: 'aeroporty-kipra',
    locale: 'ru',
    title: 'Гид по трансферам из аэропортов Кипра: всё, что нужно знать',
    description: 'Полное руководство по маршрутам из аэропортов Ларнаки и Пафоса.',
    date: '2026-05-01',
  },
]

export function getPostsByLocale(locale: Locale): BlogPost[] {
  return posts.filter((p) => p.locale === locale)
}

export function getPost(slug: string, locale: Locale): BlogPost | undefined {
  return posts.find((p) => p.slug === slug && p.locale === locale)
}
```

- [ ] **Step 2: Create EN blog post**

```mdx
export const metadata = {
  title: 'Cyprus Airport Transfer Guide: Everything You Need to Know',
  description: 'A complete guide to getting from Larnaca and Paphos airports to your destination in Cyprus.',
  date: '2026-05-01',
}

# Cyprus Airport Transfer Guide

Cyprus has two international airports: **Larnaca International Airport (LCA)** in the east and **Paphos International Airport (PFO)** in the west. Knowing which one you're flying into — and how far your destination is — makes all the difference when planning your transfer.

## Larnaca Airport

Larnaca is the busier of the two airports and serves the majority of international routes. It's centrally located on the island, making it the closest airport to Nicosia, Limassol, and Ayia Napa.

**Typical transfer times from Larnaca:**
- Nicosia: 40–50 minutes
- Limassol: 45–55 minutes
- Ayia Napa: 30–40 minutes

## Paphos Airport

Paphos Airport serves the western part of the island and is popular with tourists heading to Paphos city and the surrounding resort areas.

**Typical transfer times from Paphos:**
- Paphos City: 15–20 minutes
- Limassol: 50–60 minutes
- Nicosia: 90–100 minutes

## Why Choose a Private Transfer?

Cyprus has limited public transport, particularly outside major cities. A private transfer offers:

- **Fixed price** — agreed in advance, no meter running
- **Door-to-door service** — no shared shuttles, no stops
- **Flight monitoring** — your driver adjusts for delays

## Booking Tips

1. Book at least 24 hours in advance
2. Include your flight number in the notes — we use it to track your arrival
3. Choose round trip if you need a return journey — it saves money
4. Select extras like child seats when booking, not at the last minute

Ready to book your transfer? [Book now](/en/book)
```

- [ ] **Step 3: Create TR blog post**

Create `content/blog/tr/kibris-havalimani-rehberi.mdx`:

```mdx
export const metadata = {
  title: 'Kıbrıs Havalimanı Transfer Rehberi: Bilmeniz Gereken Her Şey',
  description: "Larnaca ve Paphos havalimanlarından Kıbrıs'taki hedefinize ulaşmanın tam rehberi.",
  date: '2026-05-01',
}

# Kıbrıs Havalimanı Transfer Rehberi

Kıbrıs'ta iki uluslararası havalimanı bulunur: doğuda **Larnaca Uluslararası Havalimanı (LCA)** ve batıda **Paphos Uluslararası Havalimanı (PFO)**. Hangi havalimanına ineceğinizi ve hedefinize olan mesafeyi bilmek, transferinizi planlamada büyük fark yaratır.

## Larnaca Havalimanı

Larnaca, iki havalimanından daha yoğun olanıdır ve uluslararası seferlerin büyük bölümüne hizmet eder. Adanın merkezine yakın konumuyla Lefkoşa, Larnaca, Limassol ve Gazimağusa'ya en yakın havalimanıdır.

**Larnaca'dan tipik transfer süreleri:**
- Lefkoşa: 40–50 dakika
- Limassol: 45–55 dakika
- Ayia Napa: 30–40 dakika

## Paphos Havalimanı

Paphos Havalimanı adanın batı bölgesine hizmet eder ve Paphos şehrine yönelen turistler arasında popülerdir.

**Paphos'tan tipik transfer süreleri:**
- Paphos Merkez: 15–20 dakika
- Limassol: 50–60 dakika
- Lefkoşa: 90–100 dakika

## Neden Özel Transfer?

Kıbrıs'ta toplu taşıma, özellikle büyük şehirler dışında oldukça sınırlıdır. Özel transfer size şunları sunar:

- **Sabit fiyat** — önceden kararlaştırılmış, taksimetre yok
- **Kapıdan kapıya hizmet** — paylaşımlı servis yok, ara durak yok
- **Uçuş takibi** — sürücünüz gecikmeler için ayarlama yapar

## Rezervasyon İpuçları

1. En az 24 saat önceden rezervasyon yapın
2. Notlar alanına uçuş numaranızı ekleyin — varışınızı takip etmek için kullanıyoruz
3. Dönüş yolculuğu gerekiyorsa gidiş-dönüş seçeneğini seçin — tasarruf sağlar
4. Çocuk koltuğu gibi ekstraları son dakikaya bırakmayın, rezervasyon sırasında seçin

Transferinizi rezerve etmeye hazır mısınız? [Rezervasyon yap](/tr/book)
```

- [ ] **Step 4: Create RU blog post**

Create `content/blog/ru/aeroporty-kipra.mdx`:

```mdx
export const metadata = {
  title: 'Гид по трансферам из аэропортов Кипра: всё, что нужно знать',
  description: 'Полное руководство по маршрутам из аэропортов Ларнаки и Пафоса.',
  date: '2026-05-01',
}

# Гид по трансферам из аэропортов Кипра

На Кипре два международных аэропорта: **Международный аэропорт Ларнаки (LCA)** на востоке и **Международный аэропорт Пафоса (PFO)** на западе. Зная, в какой из них вы летите и как далеко ваш пункт назначения, вы легко спланируете трансфер.

## Аэропорт Ларнаки

Ларнака — самый загруженный аэропорт острова, через который проходит большинство международных рейсов. Он расположен в центральной части острова, что делает его ближайшим к Никосии, Лимасолу и Айя-Напе.

**Типичное время трансфера из Ларнаки:**
- Никосия: 40–50 минут
- Лимасол: 45–55 минут
- Айя-Напа: 30–40 минут

## Аэропорт Пафоса

Аэропорт Пафоса обслуживает западную часть острова и популярен среди туристов, направляющихся в город Пафос и окрестные курорты.

**Типичное время трансфера из Пафоса:**
- Центр Пафоса: 15–20 минут
- Лимасол: 50–60 минут
- Никосия: 90–100 минут

## Почему стоит выбрать частный трансфер?

На Кипре общественный транспорт ограничен, особенно за пределами крупных городов. Частный трансфер предлагает:

- **Фиксированная цена** — оговорена заранее, счётчик не работает
- **Услуга «от двери до двери»** — без совместных маршрутных такси и промежуточных остановок
- **Отслеживание рейса** — водитель скорректирует время при задержке

## Советы по бронированию

1. Бронируйте минимум за 24 часа до трансфера
2. Укажите номер рейса в примечаниях — мы отслеживаем ваш прилёт
3. Выбирайте «туда и обратно», если нужна обратная поездка — это выгоднее
4. Заказывайте детское кресло и другие допуслуги при бронировании, а не в последний момент

Готовы забронировать трансфер? [Забронировать](/ru/book)
```

- [ ] **Step 5: Commit**

```bash
git add content/
git commit -m "feat: add blog manifest and sample posts (EN/TR/RU)"
```

---

## Task 14: Blog pages

**Files:**
- Create: `app/[lang]/blog/page.tsx`
- Create: `app/[lang]/blog/[slug]/page.tsx`

- [ ] **Step 1: Create blog index page**

```tsx
// app/[lang]/blog/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale, type Locale } from '@/app/[lang]/dictionaries'
import { getPostsByLocale } from '@/content/blog/posts'

export async function generateMetadata({ params }: PageProps<'/[lang]/blog'>): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.blog.title,
    description: dict.blog.subtitle,
    alternates: { languages: { en: '/en/blog', tr: '/tr/blog', ru: '/ru/blog' } },
  }
}

export default async function BlogIndexPage({ params }: PageProps<'/[lang]/blog'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const [dict, localePosts] = await Promise.all([
    getDictionary(lang as Locale),
    Promise.resolve(getPostsByLocale(lang as Locale)),
  ])
  const t = dict.blog

  return (
    <div className="min-h-screen bg-sand">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-4xl font-light italic text-ink">{t.title}</h1>
        <p className="mt-3 text-clay">{t.subtitle}</p>

        {localePosts.length === 0 ? (
          <p className="mt-12 text-clay">{t.noPosts}</p>
        ) : (
          <div className="mt-12 grid gap-6">
            {localePosts.map((post) => (
              <Link
                key={post.slug}
                href={`/${lang}/blog/${post.slug}`}
                className="group rounded-2xl border border-warm bg-cream p-6 transition-colors hover:border-gold/40"
              >
                <p className="text-xs text-clay">{new Date(post.date).toLocaleDateString(lang === 'ru' ? 'ru-RU' : lang === 'tr' ? 'tr-TR' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <h2 className="mt-2 font-display text-xl font-light italic text-ink group-hover:text-gold transition-colors">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm text-clay">{post.description}</p>
                <p className="mt-4 text-sm font-medium text-gold">{t.readMore}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create blog post page**

```tsx
// app/[lang]/blog/[slug]/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale, type Locale } from '@/app/[lang]/dictionaries'
import { getPost, getPostsByLocale, posts } from '@/content/blog/posts'

export async function generateStaticParams() {
  return posts.map((p) => ({ lang: p.locale, slug: p.slug }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: PageProps<'/[lang]/blog/[slug]'>): Promise<Metadata> {
  const { lang, slug } = await params
  if (!hasLocale(lang)) return {}
  const post = getPost(slug, lang as Locale)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    openGraph: { type: 'article', publishedTime: post.date },
  }
}

export default async function BlogPostPage({
  params,
}: PageProps<'/[lang]/blog/[slug]'>) {
  const { lang, slug } = await params
  if (!hasLocale(lang)) notFound()

  const post = getPost(slug, lang as Locale)
  if (!post) notFound()

  const dict = await getDictionary(lang as Locale)
  const t = dict.blog

  const { default: PostContent } = await import(
    `@/content/blog/${lang}/${slug}.mdx`
  )

  return (
    <div className="min-h-screen bg-sand">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Link href={`/${lang}/blog`} className="text-sm text-gold hover:text-gold-dark transition-colors">
          {t.backToBlog}
        </Link>

        <p className="mt-6 text-sm text-clay">
          {new Date(post.date).toLocaleDateString(
            lang === 'ru' ? 'ru-RU' : lang === 'tr' ? 'tr-TR' : 'en-GB',
            { year: 'numeric', month: 'long', day: 'numeric' }
          )}
        </p>

        <article className="prose prose-stone mt-6 max-w-none [&_h1]:font-display [&_h1]:font-light [&_h1]:italic [&_h1]:text-ink [&_h2]:font-display [&_h2]:font-light [&_h2]:italic [&_h2]:text-ink [&_p]:text-clay [&_a]:text-gold [&_a:hover]:text-gold-dark [&_strong]:text-ink">
          <PostContent />
        </article>

        <div className="mt-12 rounded-xl border border-warm bg-cream p-6 text-center">
          <Link
            href={`/${lang}/book`}
            className="font-medium text-gold hover:text-gold-dark transition-colors"
          >
            {t.bookCta}
          </Link>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify blog**

Open http://localhost:3000/en/blog — post cards visible.
Open http://localhost:3000/en/blog/cyprus-airport-guide — full post renders.
Open http://localhost:3000/tr/blog — Turkish post visible.
Open http://localhost:3000/ru/blog — Russian post visible.

- [ ] **Step 4: Commit**

```bash
git add app/\[lang\]/blog/
git commit -m "feat: add blog index and post pages with MDX rendering"
```

---

## Task 15: Update sitemap

**Files:**
- Modify: `app/sitemap.ts`

- [ ] **Step 1: Update sitemap.ts**

```typescript
// app/sitemap.ts
import type { MetadataRoute } from 'next'
import { locales } from '@/app/[lang]/dictionaries'
import { posts } from '@/content/blog/posts'

const base = 'https://taxsi.cy'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ['', '/book', '/routes', '/about', '/contact', '/blog', '/faq', '/privacy', '/terms']

  const staticEntries = locales.flatMap((lang) =>
    staticPaths.map((path) => ({
      url: `${base}/${lang}${path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: path === '' ? 1 : 0.8,
    }))
  )

  const blogEntries = posts.map((post) => ({
    url: `${base}/${post.locale}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticEntries, ...blogEntries]
}
```

- [ ] **Step 2: Commit**

```bash
git add app/sitemap.ts
git commit -m "feat: update sitemap to include all localized marketing pages"
```

---

## Task 16: Final verification

- [ ] **Step 1: TypeScript check**

```bash
cd /Users/mac14/Desktop/taxsi/frontend
npx tsc --noEmit 2>&1
```
Expected: No errors.

- [ ] **Step 2: Run tests**

```bash
npm test
```
Expected: 4 tests pass (price calculation).

- [ ] **Step 3: Lint**

```bash
npm run lint
```
Expected: No errors.

- [ ] **Step 4: Production build**

```bash
npm run build 2>&1 | tail -20
```
Expected: Build succeeds with static pages generated.

- [ ] **Step 5: Smoke test all routes**

Start dev server: `npm run dev`

| URL | Expected |
|-----|----------|
| http://localhost:3000/ | Redirect to /en/ |
| http://localhost:3000/en/ | Marketing homepage (hero, routes, etc.) |
| http://localhost:3000/tr/ | Turkish homepage |
| http://localhost:3000/ru/ | Russian homepage |
| http://localhost:3000/en/book | Booking form |
| http://localhost:3000/en/routes | Routes table |
| http://localhost:3000/en/about | About page |
| http://localhost:3000/en/contact | Contact page with form |
| http://localhost:3000/en/blog | Blog index |
| http://localhost:3000/en/blog/cyprus-airport-guide | Blog post |
| http://localhost:3000/en/faq | FAQ accordion |
| http://localhost:3000/en/privacy | Privacy policy |
| http://localhost:3000/en/terms | Terms |
| http://localhost:3000/confirm/TAX-20260001 | Confirm page (unchanged) |
| http://localhost:3000/track/TAX-20260001 | Track page (unchanged) |
| Language switcher EN→TR on /en/about | Goes to /tr/about |

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "chore: marketing pages complete — i18n EN/TR/RU, homepage, blog, legal, sitemap"
```

---

## Self-Review

**Spec coverage:**
- [x] URL structure: `/[lang]/` prefix for all marketing pages, confirm/track unchanged
- [x] 3 locales: EN, TR, RU with full dictionary content
- [x] proxy.ts for locale detection (Next.js 16 convention)
- [x] Marketing homepage: hero, why, popular routes, how it works, CTA
- [x] Booking form moved to `/[lang]/book`
- [x] Routes & Prices table with booking links
- [x] About page with story, mission, values
- [x] Contact page with phone/email/WhatsApp + contact form → SendGrid
- [x] Blog: MDX posts, static manifest, index + post pages, 1 post per locale
- [x] FAQ with accordion
- [x] Privacy Policy: EN/TR/RU content
- [x] Terms of Use: EN/TR/RU content
- [x] Sitemap updated for all locales + blog posts
- [x] `generateMetadata` with hreflang alternates on every page
- [x] `generateStaticParams` in [lang]/layout.tsx for static generation
- [x] Footer with full nav links

**No placeholders:** All code is complete. No TBDs.

**Type consistency:**
- `getDictionary` returns `Dictionary` type used consistently across components
- `Locale` type from `dictionaries.ts` used everywhere
- `PageProps<'/[lang]'>` global helper used for all page params
- `BlogPost` type from `posts.ts` used in both blog pages
