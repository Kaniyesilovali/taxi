import type { AdminUser, LoginBody, LoginResponse } from '@/lib/types/admin'
import { apiFetch } from './client'
import { mockLogin, mockLogout, mockGetMe } from '@/lib/mock/auth'

const USE_MOCK = process.env.NEXT_PUBLIC_API_MOCK === 'true'

export function login(body: LoginBody): Promise<LoginResponse> {
  if (USE_MOCK) return mockLogin(body)
  return apiFetch<LoginResponse>('/auth/admin/login', { method: 'POST', body: JSON.stringify(body) })
}

export function logout(): Promise<void> {
  if (USE_MOCK) return mockLogout()
  return apiFetch<void>('/auth/admin/logout', { method: 'POST' })
}

export function getMe(): Promise<AdminUser> {
  if (USE_MOCK) return mockGetMe()
  return apiFetch<AdminUser>('/auth/admin/me')
}
