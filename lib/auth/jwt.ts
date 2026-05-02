export interface JwtPayload {
  sub: string
  exp: number
  [key: string]: unknown
}

export function decodeJwt(token: string): JwtPayload | null {
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  try {
    const json = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
    const payload = JSON.parse(json) as JwtPayload
    if (typeof payload.exp !== 'number') return null
    return payload
  } catch {
    return null
  }
}

export function isJwtExpired(token: string): boolean {
  const payload = decodeJwt(token)
  if (!payload) return true
  return payload.exp * 1000 < Date.now()
}
