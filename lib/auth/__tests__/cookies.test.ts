/**
 * @jest-environment jsdom
 */
import { setAdminToken, getAdminToken, clearAdminToken, ADMIN_TOKEN_COOKIE } from '../cookies'

describe('admin token cookies', () => {
  beforeEach(() => {
    document.cookie.split(';').forEach((c) => {
      document.cookie = c.replace(/^ +/, '').replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`)
    })
  })

  it('sets and reads the admin_token cookie', () => {
    setAdminToken('abc.def.ghi')
    expect(getAdminToken()).toBe('abc.def.ghi')
  })

  it('clears the cookie', () => {
    setAdminToken('abc.def.ghi')
    clearAdminToken()
    expect(getAdminToken()).toBeNull()
  })

  it('returns null when cookie is absent', () => {
    expect(getAdminToken()).toBeNull()
  })

  it('exposes the cookie name', () => {
    expect(ADMIN_TOKEN_COOKIE).toBe('admin_token')
  })
})
