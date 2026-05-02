/**
 * @jest-environment jsdom
 */
import { mockLogin, mockLogout, mockGetMe } from '../auth'

describe('mock auth', () => {
  beforeEach(() => {
    document.cookie.split(';').forEach((c) => {
      document.cookie = c.replace(/^ +/, '').replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`)
    })
  })

  it('logs in with valid credentials and sets cookie', async () => {
    const res = await mockLogin({ email: 'admin@taxsi.test', password: 'admin123' })
    expect(res.user.email).toBe('admin@taxsi.test')
    expect(res.accessToken).toMatch(/^[\w-]+\.[\w-]+\.[\w-]+$/)
    expect(document.cookie).toContain('admin_token=')
  })

  it('rejects invalid credentials', async () => {
    await expect(mockLogin({ email: 'admin@taxsi.test', password: 'wrong' })).rejects.toThrow(/invalid/i)
  })

  it('logout clears the cookie', async () => {
    await mockLogin({ email: 'admin@taxsi.test', password: 'admin123' })
    await mockLogout()
    expect(document.cookie).not.toContain('admin_token=eyJ')
  })

  it('getMe returns the user when token is valid', async () => {
    await mockLogin({ email: 'admin@taxsi.test', password: 'admin123' })
    const user = await mockGetMe()
    expect(user.email).toBe('admin@taxsi.test')
  })

  it('getMe throws when no token', async () => {
    await expect(mockGetMe()).rejects.toThrow(/unauthor/i)
  })
})
