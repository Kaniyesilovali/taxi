export function sleep(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const MOCK_DELAY_MS = 300
