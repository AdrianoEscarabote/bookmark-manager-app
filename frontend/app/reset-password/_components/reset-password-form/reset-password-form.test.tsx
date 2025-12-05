import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import ResetPasswordForm from './index'

describe('ResetPasswordForm', () => {
  it('renders both fields and the button', () => {
    render(<ResetPasswordForm />)

    expect(screen.getByTestId(/new-password/i)).toBeInTheDocument()
    expect(screen.getByTestId(/confirm-password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reset password/i })).toBeInTheDocument()
  })

  it('shows errors when submitting empty (required)', async () => {
    render(<ResetPasswordForm />)
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: /reset password/i }))

    const alerts = await screen.findAllByRole('alert')
    expect(alerts[0]).toHaveTextContent(/password is required/i)
    expect(alerts[1]).toHaveTextContent(/please confirm your new password/i)
  })

  it('shows error when passwords do not match', async () => {
    render(<ResetPasswordForm />)
    const user = userEvent.setup()

    await user.type(screen.getByTestId(/new-password/i), 'Password123!')
    await user.type(screen.getByTestId(/confirm-password/i), 'OtherPassword!')
    await user.click(screen.getByRole('button', { name: /reset password/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/passwords do not match/i)
  })

  it('submits with valid and matching passwords without showing error', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

    render(<ResetPasswordForm />)
    const user = userEvent.setup()

    await user.type(screen.getByTestId(/new-password/i), 'Password123!')
    await user.type(screen.getByTestId(/confirm-password/i), 'Password123!')
    await user.click(screen.getByRole('button', { name: /reset password/i }))

    await waitFor(() => {
      expect(logSpy).toHaveBeenCalled()
    })
    expect(screen.queryByRole('alert')).toBeNull()

    logSpy.mockRestore()
  })
})
