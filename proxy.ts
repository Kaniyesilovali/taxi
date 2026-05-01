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
