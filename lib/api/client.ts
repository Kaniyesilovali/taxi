import { ADMIN_TOKEN_COOKIE, clearAdminToken, getAdminToken } from '@/lib/auth/cookies'

export class ApiError extends Error {
  constructor(public readonly status: number, message: string, public readonly body?: unknown) {
    super(message)
    this.name = 'ApiError'
  }
}

interface FetchOptions extends Omit<RequestInit, 'body'> {
  body?: BodyInit | null
}

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''
  const token = getAdminToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) ?? {}),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${baseUrl}${path}`, { ...options, headers, credentials: 'include' })

  if (res.status === 401) {
    clearAdminToken()
    throw new ApiError(401, 'Unauthorized')
  }

  if (!res.ok) {
    let body: unknown = undefined
    try { body = await res.json() } catch { /* ignore */ }
    const message = (body as { message?: string } | undefined)?.message ?? `Request failed: ${res.status}`
    throw new ApiError(res.status, message, body)
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const ADMIN_COOKIE_NAME = ADMIN_TOKEN_COOKIE
