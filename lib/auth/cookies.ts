export const ADMIN_TOKEN_COOKIE = 'admin_token'

export function setAdminToken(token: string): void {
  if (typeof document === 'undefined') return
  // 7-day cookie; mock mode only — real prod cookie is httpOnly server-set.
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()
  document.cookie = `${ADMIN_TOKEN_COOKIE}=${token};path=/;expires=${expires};SameSite=Lax`
}

export function getAdminToken(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${ADMIN_TOKEN_COOKIE}=([^;]+)`))
  return match ? decodeURIComponent(match[1]) : null
}

export function clearAdminToken(): void {
  if (typeof document === 'undefined') return
  document.cookie = `${ADMIN_TOKEN_COOKIE}=;path=/;expires=${new Date(0).toUTCString()};SameSite=Lax`
}
