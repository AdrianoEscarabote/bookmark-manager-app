import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import ForgotPasswordForm from './index'

describe('ForgotPasswordForm', () => {
  it('renders the input and button', () => {
    render(<ForgotPasswordForm />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument()
  })

  it('shows error when submitting empty (required)', async () => {
    render(<ForgotPasswordForm />)
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /send reset link/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Email is required')
  })

  it('submits with valid email and does not show error', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    render(<ForgotPasswordForm />)
    const user = userEvent.setup()

    await user.clear(screen.getByLabelText(/email/i))
    await user.type(screen.getByLabelText(/email/i), 'user@example.com')
    await user.click(screen.getByRole('button', { name: /send reset link/i }))

    await waitFor(() => {
      expect(logSpy).toHaveBeenCalledWith({ email: 'user@example.com' })
    })
    expect(screen.queryByRole('alert')).toBeNull()

    logSpy.mockRestore()
  })
})
