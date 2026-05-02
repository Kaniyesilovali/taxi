process.env.NEXT_PUBLIC_API_MOCK = 'true'

/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LoginForm } from '@/components/admin/auth/login-form'

const push = jest.fn()
const refresh = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push, refresh }),
  useSearchParams: () => new URLSearchParams(),
}))

jest.mock('sonner', () => ({ toast: { error: jest.fn(), success: jest.fn() } }))

describe('LoginForm', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_MOCK = 'true'
    document.cookie.split(';').forEach((c) => {
      document.cookie = c.replace(/^ +/, '').replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`)
    })
    push.mockClear()
    refresh.mockClear()
  })

  it('shows validation errors when fields are empty', async () => {
    render(<LoginForm />)
    fireEvent.click(screen.getByRole('button', { name: /giriş yap/i }))
    expect(await screen.findByText(/geçerli bir email/i)).toBeInTheDocument()
    expect(screen.getByText(/şifre zorunlu/i)).toBeInTheDocument()
  })

  it('redirects on successful login', async () => {
    render(<LoginForm />)
    fireEvent.input(screen.getByLabelText(/email/i), { target: { value: 'admin@taxsi.test' } })
    fireEvent.input(screen.getByLabelText(/şifre/i), { target: { value: 'admin123' } })
    fireEvent.click(screen.getByRole('button', { name: /giriş yap/i }))
    await waitFor(() => expect(push).toHaveBeenCalledWith('/admin/dashboard'))
  })
})
