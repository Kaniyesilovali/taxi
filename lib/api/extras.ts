import { api } from '@/lib/api'
import { mockExtras } from '@/lib/mock/extras'
import type { Extra } from '@/lib/types'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

export async function getExtras(): Promise<Extra[]> {
  if (USE_MOCK) return mockExtras.filter(e => e.is_active)
  return api.get<Extra[]>('/extras')
}
