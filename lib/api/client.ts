// Stub — Task 8 implements the real apiFetch + ApiError.
// This file exists only so Task 7's auth.ts can import it without breaking typecheck.

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiFetch<T>(_path: string, _options: RequestInit = {}): Promise<T> {
  throw new Error('apiFetch stub — implement in Task 8')
}
