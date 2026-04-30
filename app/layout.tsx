import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://taxsi.cy'),
  title: {
    default: 'Taxsi — Cyprus Airport Transfers',
    template: '%s | Taxsi',
  },
  description:
    'Book your Cyprus airport transfer in minutes. Fixed prices, no surprises. Larnaca & Paphos airports.',
  keywords: ['Cyprus airport transfer', 'Larnaca airport taxi', 'Paphos airport taxi', 'Cyprus taxi booking'],
  authors: [{ name: 'Taxsi' }],
  openGraph: {
    type: 'website',
    locale: 'en_CY',
    siteName: 'Taxsi',
    title: 'Taxsi — Cyprus Airport Transfers',
    description: 'Book your Cyprus airport transfer in minutes. Fixed prices, no surprises.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Taxsi — Cyprus Airport Transfers',
    description: 'Book your Cyprus airport transfer in minutes. Fixed prices, no surprises.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-sand font-sans">{children}</body>
    </html>
  )
}
