import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale } from '@/app/[lang]/locale'
import { isJwtExpired } from '@/lib/auth/jwt'

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language') ?? ''
  for (const part of acceptLanguage.split(',')) {
    const tag = part.split(';')[0].trim().toLowerCase().slice(0, 2)
    if (locales.includes(tag as typeof locales[number])) return tag
  }
  return defaultLocale
}

function handleAdminAuth(request: NextRequest): NextResponse | undefined {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('admin_token')?.value
  const tokenValid = token != null && !isJwtExpired(token)
  const isLoginPage = pathname === '/admin/login'

  if (isLoginPage && tokenValid) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }
  if (!isLoginPage && !tokenValid) {
    const url = new URL('/admin/login', request.url)
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }
  return undefined
}

export function proxy(request: NextRequest): NextResponse | undefined {
  const { pathname } = request.nextUrl

  // Admin section — JWT auth, no locale routing.
  if (pathname.startsWith('/admin')) {
    return handleAdminAuth(request)
  }

  // Customer portal — locale routing (existing behavior, unchanged).
  const pathnameHasLocale = locales.some(
    (locale) =>
      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  )
  if (pathnameHasLocale) {
    // Forward the pathname so server components (e.g. not-found.tsx) can
    // recover the locale even when params aren't available.
    const headers = new Headers(request.headers)
    headers.set('x-pathname', pathname)
    return NextResponse.next({ request: { headers } })
  }
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  // Removed `admin` from the negative-lookahead so admin paths now flow through proxy.
  // Driver section is still excluded (handled separately when implemented).
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api|confirm|track|driver).*)',
  ],
}
