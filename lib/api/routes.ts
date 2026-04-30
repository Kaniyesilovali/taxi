import { api } from '@/lib/api'
import { mockRoutes } from '@/lib/mock/routes'
import type { Route } from '@/lib/types'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

export async function getRoutes(): Promise<Route[]> {
  if (USE_MOCK) return mockRoutes.filter(r => r.is_active)
  return api.get<Route[]>('/routes')
}
