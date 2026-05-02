import { sleep } from './sleep'
import { mockStore } from './store'
import { setAdminToken, clearAdminToken, getAdminToken } from '@/lib/auth/cookies'
import type { AdminUser, LoginBody, LoginResponse } from '@/lib/types/admin'

function mintMockJwt(sub: string): string {
  const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' })).replace(/=/g, '')
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 // 7 days
  const payload = btoa(JSON.stringify({ sub, exp })).replace(/=/g, '')
  return `${header}.${payload}.mock-signature`
}

export async function mockLogin(body: LoginBody): Promise<LoginResponse> {
  await sleep()
  if (body.email !== mockStore.adminUser.email || body.password !== mockStore.adminPassword) {
    throw new Error('Invalid credentials')
  }
  const accessToken = mintMockJwt(mockStore.adminUser.id)
  const refreshToken = mintMockJwt(mockStore.adminUser.id)
  setAdminToken(accessToken)
  return { user: mockStore.adminUser, accessToken, refreshToken }
}

export async function mockLogout(): Promise<void> {
  await sleep(100)
  clearAdminToken()
}

export async function mockGetMe(): Promise<AdminUser> {
  await sleep(100)
  if (!getAdminToken()) throw new Error('Unauthorized')
  return mockStore.adminUser
}
