import { ImageResponse } from 'next/og'
import { getDictionary, hasLocale, type Locale } from './dictionaries'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Taxsi — Cyprus Chauffeur Service'

interface Props {
  params: Promise<{ lang: string }>
}

export default async function OG({ params }: Props) {
  const { lang } = await params
  if (!hasLocale(lang)) {
    return new ImageResponse(<div />, size)
  }
  const dict = await getDictionary(lang as Locale)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          backgroundColor: '#0a0a0a',
          color: '#faf7f2',
          fontFamily: 'serif',
        }}
      >
        {/* Top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div
            style={{
              fontFamily: 'serif',
              fontStyle: 'italic',
              fontSize: 56,
              fontWeight: 300,
              letterSpacing: 1,
            }}
          >
            Taxsi
          </div>
          <div
            style={{
              fontSize: 14,
              letterSpacing: 6,
              textTransform: 'uppercase',
              color: '#c9a961',
            }}
          >
            {lang} · {dict.footer.tagline}
          </div>
        </div>

        {/* Middle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div style={{ height: 1, width: 80, backgroundColor: '#c9a961' }} />
          <div
            style={{
              fontFamily: 'serif',
              fontStyle: 'italic',
              fontSize: 100,
              fontWeight: 300,
              lineHeight: 1.05,
              letterSpacing: -1,
              maxWidth: 980,
            }}
          >
            {dict.homepage.hero.title}
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 300,
              color: 'rgba(250,247,242,0.7)',
              maxWidth: 820,
              lineHeight: 1.4,
            }}
          >
            {dict.homepage.hero.subtitle}
          </div>
        </div>

        {/* Bottom */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            fontSize: 16,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: 'rgba(250,247,242,0.55)',
          }}
        >
          <div>{dict.footer.hours}</div>
          <div style={{ color: '#c9a961' }}>taxsi.cy</div>
        </div>
      </div>
    ),
    size
  )
}
