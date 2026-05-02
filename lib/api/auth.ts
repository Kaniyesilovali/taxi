import type { AdminUser, LoginBody, LoginResponse } from '@/lib/types/admin'
import { apiFetch } from './client'
import { mockLogin, mockLogout, mockGetMe } from '@/lib/mock/auth'

export function login(body: LoginBody): Promise<LoginResponse> {
  if (process.env.NEXT_PUBLIC_API_MOCK === 'true') return mockLogin(body)
  return apiFetch<LoginResponse>('/auth/admin/login', { method: 'POST', body: JSON.stringify(body) })
}

export function logout(): Promise<void> {
  if (process.env.NEXT_PUBLIC_API_MOCK === 'true') return mockLogout()
  return apiFetch<void>('/auth/admin/logout', { method: 'POST' })
}

export function getMe(): Promise<AdminUser> {
  if (process.env.NEXT_PUBLIC_API_MOCK === 'true') return mockGetMe()
  return apiFetch<AdminUser>('/auth/admin/me')
}
