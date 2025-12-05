import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import SignUpForm from './index'

describe('SignUpForm', () => {
  const setup = () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    render(<SignUpForm />)
    const user = userEvent.setup()
    return { user, logSpy }
  }

  it('renders full name, email, password fields and submit button', () => {
    setup()
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Sign up/i })).toBeInTheDocument()
  })

  it('shows required errors on empty submit', async () => {
    const { user } = setup()
    await user.click(screen.getByRole('button', { name: /Sign up/i }))
    expect(await screen.findByText('Full Name is required')).toBeInTheDocument()
    expect(screen.getByText('Email is required')).toBeInTheDocument()
    expect(screen.getByText('Password is required')).toBeInTheDocument()
  })

  it('shows invalid email error', async () => {
    const { user } = setup()

    const fullNameInput = screen.getByLabelText(/Full Name/i)
    const emailInput = screen.getByLabelText(/Email/i)
    const passwordInput = screen.getByLabelText(/Password/i)

    await user.click(screen.getByRole('button', { name: /Sign up/i }))

    await user.type(fullNameInput, 'John Doe')
    await user.type(emailInput, 'invalid-email')
    await user.type(passwordInput, 'ValidPass123')

    expect(await screen.findByText('Invalid email address')).toBeInTheDocument()
  })

  it('shows password min length error', async () => {
    const { user } = setup()

    await user.type(screen.getByLabelText(/Full Name/i), 'john@example.com')
    await user.type(screen.getByLabelText(/Email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/Password/i), '1234567')

    await user.click(screen.getByRole('button', { name: /Sign up/i }))
    expect(await screen.findByText('Password must be at least 8 characters')).toBeInTheDocument()
  })

  it('shows password max length error', async () => {
    const { user } = setup()

    await user.type(screen.getByLabelText(/Full Name/i), 'john@example.com')
    await user.type(screen.getByLabelText(/Email/i), 'john@example.com')

    const pwd = screen.getByLabelText(/Password/i)

    fireEvent.change(pwd, { target: { value: 'a'.repeat(25) } })
    await user.click(screen.getByRole('button', { name: /Sign up/i }))
    expect(await screen.findByText('Password must be at most 24 characters')).toBeInTheDocument()
  })

  it('submits valid data', async () => {
    const { user, logSpy } = setup()
    await user.type(screen.getByLabelText(/Full Name/i), 'john@example.com')
    await user.type(screen.getByLabelText(/Email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/Password/i), 'StrongPass123')
    await user.click(screen.getByRole('button', { name: /Sign up/i }))
    expect(logSpy).toHaveBeenCalledWith(
      'data ' +
        JSON.stringify({
          fullName: 'john@example.com',
          email: 'john@example.com',
          password: 'StrongPass123',
        }),
    )
  })
})
