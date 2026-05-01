import type { Metadata } from 'next'
import { TrackSearch } from './_components/track-search'

export const metadata: Metadata = {
  title: 'Track Your Booking',
  description: 'Enter your booking reference to track the live status of your Taxsi Cyprus airport transfer.',
  alternates: {
    canonical: 'https://taxsi.cy/track',
  },
  openGraph: {
    title: 'Track Your Booking | Taxsi',
    description: 'Enter your booking reference to track the live status of your Cyprus airport transfer.',
    url: 'https://taxsi.cy/track',
  },
}

export default function TrackLandingPage() {
  return (
    <div>
      <div className="bg-night py-16 text-center">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/30">
            Booking Status
          </p>
          <h1 className="font-display text-4xl font-light italic text-white sm:text-5xl">
            Track Your Booking
          </h1>
          <p className="mt-3 text-base text-white/50">
            Enter your booking reference to see your transfer status in real time.
          </p>
        </div>
      </div>
      <div className="bg-sand">
        <div className="mx-auto max-w-md px-4 py-10 sm:px-6">
          <TrackSearch />
        </div>
      </div>
    </div>
  )
}
