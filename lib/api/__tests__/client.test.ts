/**
 * @jest-environment jsdom
 */
import { apiFetch, ApiError } from '../client'

const originalFetch = global.fetch

beforeEach(() => {
  process.env.NEXT_PUBLIC_API_BASE_URL = 'http://api.test/v1'
})

afterEach(() => {
  global.fetch = originalFetch
})

describe('apiFetch', () => {
  it('attaches admin_token from cookie as bearer header', async () => {
    document.cookie = 'admin_token=tok-123;path=/'
    const fetchSpy = jest.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }))
    global.fetch = fetchSpy as unknown as typeof fetch
    await apiFetch('/foo')
    const init = fetchSpy.mock.calls[0][1] as RequestInit
    expect((init.headers as Record<string, string>)['Authorization']).toBe('Bearer tok-123')
  })

  it('throws ApiError on non-2xx', async () => {
    global.fetch = jest.fn(async () => new Response(JSON.stringify({ message: 'boom' }), { status: 500 })) as unknown as typeof fetch
    await expect(apiFetch('/foo')).rejects.toBeInstanceOf(ApiError)
  })

  it('clears cookie and throws on 401', async () => {
    document.cookie = 'admin_token=tok-123;path=/'
    global.fetch = jest.fn(async () => new Response('', { status: 401 })) as unknown as typeof fetch
    await expect(apiFetch('/foo')).rejects.toThrow(ApiError)
    expect(document.cookie).not.toContain('admin_token=tok')
  })

  it('returns parsed JSON on success', async () => {
    global.fetch = jest.fn(async () => new Response(JSON.stringify({ a: 1 }), { status: 200 })) as unknown as typeof fetch
    await expect(apiFetch<{ a: number }>('/foo')).resolves.toEqual({ a: 1 })
  })
})
