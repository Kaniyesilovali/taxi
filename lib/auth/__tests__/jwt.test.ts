import { decodeJwt, isJwtExpired } from '../jwt'

describe('decodeJwt', () => {
  it('decodes a payload from a valid 3-part token', () => {
    const payload = Buffer.from(JSON.stringify({ sub: 'u1', exp: 9999999999 })).toString('base64url')
    const token = `aGVhZGVy.${payload}.c2ln`
    expect(decodeJwt(token)).toEqual({ sub: 'u1', exp: 9999999999 })
  })

  it('returns null for malformed tokens', () => {
    expect(decodeJwt('not.a.jwt.too.many.parts')).toBeNull()
    expect(decodeJwt('only.two')).toBeNull()
    expect(decodeJwt('')).toBeNull()
  })
})

describe('isJwtExpired', () => {
  it('returns true when exp is in the past', () => {
    const past = Math.floor(Date.now() / 1000) - 60
    const payload = Buffer.from(JSON.stringify({ exp: past })).toString('base64url')
    const token = `h.${payload}.s`
    expect(isJwtExpired(token)).toBe(true)
  })

  it('returns false when exp is in the future', () => {
    const future = Math.floor(Date.now() / 1000) + 3600
    const payload = Buffer.from(JSON.stringify({ exp: future })).toString('base64url')
    const token = `h.${payload}.s`
    expect(isJwtExpired(token)).toBe(false)
  })

  it('returns true for malformed tokens', () => {
    expect(isJwtExpired('garbage')).toBe(true)
  })
})
