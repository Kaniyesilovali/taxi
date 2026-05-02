/** Tests proxy purely as a unit — exercises NextRequest cookie + URL handling. */
import { proxy } from '../proxy'
import { NextRequest } from 'next/server'

function makeReq(url: string, cookies: Record<string, string> = {}): NextRequest {
  const req = new NextRequest(new URL(url, 'http://test.local'))
  for (const [k, v] of Object.entries(cookies)) req.cookies.set(k, v)
  return req
}

function validToken(): string {
  const exp = Math.floor(Date.now() / 1000) + 3600
  const payload = Buffer.from(JSON.stringify({ sub: 'u', exp })).toString('base64url')
  return `h.${payload}.s`
}

function expiredToken(): string {
  const exp = Math.floor(Date.now() / 1000) - 60
  const payload = Buffer.from(JSON.stringify({ sub: 'u', exp })).toString('base64url')
  return `h.${payload}.s`
}

describe('proxy', () => {
  it('allows /admin/login through unauthenticated', () => {
    const res = proxy(makeReq('/admin/login'))
    expect(res?.headers?.get('location') ?? null).toBeNull()
  })

  it('redirects unauthenticated /admin/dashboard to /admin/login', () => {
    const res = proxy(makeReq('/admin/dashboard'))
    expect(res?.headers.get('location')).toContain('/admin/login')
  })

  it('redirects expired token to /admin/login', () => {
    const res = proxy(makeReq('/admin/dashboard', { admin_token: expiredToken() }))
    expect(res?.headers.get('location')).toContain('/admin/login')
  })

  it('allows valid token through to /admin/dashboard', () => {
    const res = proxy(makeReq('/admin/dashboard', { admin_token: validToken() }))
    expect(res?.headers?.get('location') ?? null).toBeNull()
  })

  it('redirects authenticated /admin/login to /admin/dashboard', () => {
    const res = proxy(makeReq('/admin/login', { admin_token: validToken() }))
    expect(res?.headers.get('location')).toContain('/admin/dashboard')
  })

  it('does not auth-redirect for non-admin paths (customer portal locale flow)', () => {
    // Path with a locale prefix should pass through unchanged
    const passes = proxy(makeReq('/en/about'))
    expect(passes).toBeUndefined()

    // Path without a locale gets rewritten — exact target depends on Accept-Language;
    // we only verify the response is a redirect to /<locale>/about, not /admin/login.
    const rewritten = proxy(makeReq('/about'))
    const loc = rewritten?.headers.get('location') ?? ''
    expect(loc).not.toContain('/admin/login')
    expect(loc).toMatch(/\/(en|tr|ru)\/about/)
  })
})
