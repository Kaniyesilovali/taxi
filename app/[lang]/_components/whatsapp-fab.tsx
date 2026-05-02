'use client'
import { useEffect, useState } from 'react'

interface WhatsappFabProps {
  ariaLabel: string
  phone?: string
}

export function WhatsappFab({ ariaLabel, phone = '35799000000' }: WhatsappFabProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 240)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <a
      href={`https://wa.me/${phone}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={`group fixed bottom-6 right-6 z-40 inline-flex size-14 items-center justify-center rounded-full border border-gold/60 bg-night text-gold shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-all duration-500 ease-out hover:bg-gold hover:text-night sm:bottom-8 sm:right-8 sm:size-16 ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <span className="relative flex size-full items-center justify-center">
        <span
          aria-hidden
          className="absolute inset-0 rounded-full border border-gold/30 transition-transform duration-700 group-hover:scale-110 group-hover:border-gold/0"
        />
        <svg
          viewBox="0 0 32 32"
          fill="currentColor"
          className="size-6 sm:size-7"
          aria-hidden
        >
          <path d="M16.001 3.2C8.93 3.2 3.2 8.93 3.2 16c0 2.26.59 4.46 1.71 6.4L3.2 28.8l6.56-1.7A12.79 12.79 0 0 0 16 28.8c7.07 0 12.8-5.73 12.8-12.8S23.07 3.2 16.001 3.2Zm0 23.36c-1.96 0-3.86-.52-5.51-1.5l-.4-.24-3.9 1.01 1.04-3.79-.26-.41a10.55 10.55 0 1 1 19.59-5.63 10.56 10.56 0 0 1-10.56 10.56Zm5.78-7.91c-.32-.16-1.88-.93-2.17-1.03-.29-.11-.5-.16-.71.16-.21.31-.82 1.03-1 1.24-.18.21-.37.24-.69.08a8.66 8.66 0 0 1-2.55-1.57 9.55 9.55 0 0 1-1.76-2.19c-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.55.16-.18.21-.31.32-.52.11-.21.05-.39-.03-.55-.08-.16-.71-1.71-.97-2.34-.26-.62-.52-.53-.71-.54l-.61-.01c-.21 0-.55.08-.84.39-.29.31-1.1 1.08-1.1 2.63 0 1.55 1.13 3.05 1.29 3.26.16.21 2.22 3.39 5.39 4.75.75.32 1.34.51 1.8.65.76.24 1.45.21 2 .13.61-.09 1.88-.77 2.15-1.51.27-.74.27-1.37.19-1.51-.08-.13-.29-.21-.61-.37Z" />
        </svg>
      </span>
    </a>
  )
}
