import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import SignInForm from './index'

describe('SignInForm', () => {
  const setup = () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    render(<SignInForm />)
    return { logSpy, user: userEvent.setup() }
  }

  it('renders email and password fields and submit button', () => {
    setup()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Log in/i })).toBeInTheDocument()
  })

  it('shows required errors on empty submit', async () => {
    const { user } = setup()
    await user.click(screen.getByRole('button', { name: /Log in/i }))
    expect(await screen.findByText('Email is required')).toBeInTheDocument()
    expect(screen.getByText('Password is required')).toBeInTheDocument()
  })

  it('shows invalid email error', async () => {
    const { user } = setup()
    const emailInput = screen.getByLabelText(/Email/i)
    const passwordInput = screen.getByLabelText(/Password/i)

    await user.click(screen.getByRole('button', { name: /Log in/i }))

    await user.type(emailInput, 'invalid-email')
    await user.type(passwordInput, 'ValidPass123')

    expect(await screen.findByText('Invalid email address')).toBeInTheDocument()
  })

  it('shows password min length error', async () => {
    const { user } = setup()

    await user.click(screen.getByRole('button', { name: /Log in/i }))

    await user.type(screen.getByLabelText(/Email/i), 'john@example.com')

    const passwordInput = screen.getByLabelText(/Password/i)
    await user.clear(passwordInput)
    await user.type(passwordInput, '1234567')

    await user.tab()

    expect(await screen.findByText('Password must be at least 8 characters')).toBeInTheDocument()
  })

  it('shows password max length error', async () => {
    const { user } = setup()
    await user.type(screen.getByLabelText(/Email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/Password/i), 'a'.repeat(25))
    await user.click(screen.getByRole('button', { name: /Log in/i }))
    expect(await screen.findByText('Password must be at most 24 characters')).toBeInTheDocument()
  })

  it('submits valid data without errors', async () => {
    const { user, logSpy } = setup()
    const email = 'john@example.com'
    const password = 'StrongPass123'

    await user.type(screen.getByLabelText(/Email/i), email)
    await user.type(screen.getByLabelText(/Password/i), password)
    await user.click(screen.getByRole('button', { name: /Log in/i }))

    expect(screen.queryByText(/required/i)).toBeNull()
    expect(screen.queryByText(/Invalid email address/i)).toBeNull()
    expect(logSpy).toHaveBeenCalledWith(`${JSON.stringify({ email, password })}`)
  })
})
