/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom'

import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import SignInForm from './index'

const pushMock = jest.fn()
const apiPostMock = jest.fn()
const resetMock = jest.fn()

jest.mock('next/navigation', () => ({
  __esModule: true,
  useRouter: () => ({ push: pushMock }),
}))

jest.mock('@/utils/api', () => ({
  __esModule: true,
  api: {
    post: (...args: any[]) => apiPostMock(...args),
  },
}))

jest.mock('@/app/_store/bookmarks', () => {
  const store: any = () => ({})
  store.getState = () => ({ reset: resetMock })
  return { __esModule: true, useBookmarksStore: store }
})

const isAxiosErrorMock = jest.fn()
jest.mock('axios', () => ({
  __esModule: true,
  default: { isAxiosError: (...args: any[]) => isAxiosErrorMock(...args) },
}))

jest.mock('@/app/_components/input', () => {
  return {
    __esModule: true,
    default: React.forwardRef(function InputMock(
      { label, helperText, showHelperText, error, ...props }: any,
      ref: any,
    ) {
      const id = props.id ?? label
      return (
        <div>
          <label htmlFor={id}>{label}</label>
          <input id={id} ref={ref} {...props} />
          {showHelperText ? <span>{helperText}</span> : null}
        </div>
      )
    }),
  }
})

jest.mock('@/app/_components/button', () => ({
  __esModule: true,
  default: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}))

const flushMicrotasks = async () => {
  await act(async () => {
    await Promise.resolve()
  })
}

describe('SignInForm', () => {
  const setup = () => {
    const user = userEvent.setup()
    render(<SignInForm />)
    return { user }
  }

  beforeEach(() => {
    pushMock.mockClear()
    apiPostMock.mockClear()
    resetMock.mockClear()
    isAxiosErrorMock.mockClear()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

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

  it('shows password min length error', async () => {
    const { user } = setup()

    await user.type(screen.getByLabelText(/Email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/Password/i), '1234567')

    await user.click(screen.getByRole('button', { name: /Log in/i }))

    expect(await screen.findByText('Password must be at least 8 characters')).toBeInTheDocument()
  })

  it('shows password max length error', async () => {
    const { user } = setup()

    await user.type(screen.getByLabelText(/Email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/Password/i), 'a'.repeat(25))

    await user.click(screen.getByRole('button', { name: /Log in/i }))

    expect(await screen.findByText('Password must be at most 24 characters')).toBeInTheDocument()
  })

  it('submits valid data: calls API, resets store and redirects on 200', async () => {
    apiPostMock.mockResolvedValueOnce({ status: 200 })

    const { user } = setup()
    await user.type(screen.getByLabelText(/Email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/Password/i), 'StrongPass123')

    await user.click(screen.getByRole('button', { name: /Log in/i }))

    await waitFor(() => expect(apiPostMock).toHaveBeenCalledTimes(1))
    expect(apiPostMock).toHaveBeenCalledWith('/auth/sign-in', {
      email: 'john@example.com',
      password: 'StrongPass123',
    })

    expect(resetMock).toHaveBeenCalledTimes(1)
    expect(pushMock).toHaveBeenCalledWith('/')
  })

  it('shows serverError when api throws axios error with string payload', async () => {
    isAxiosErrorMock.mockReturnValueOnce(true)
    apiPostMock.mockRejectedValueOnce({
      response: { data: 'Invalid password' },
      message: 'Request failed',
    })

    const { user } = setup()
    await user.type(screen.getByLabelText(/Email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/Password/i), 'StrongPass123')

    await user.click(screen.getByRole('button', { name: /Log in/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid password')
    expect(pushMock).not.toHaveBeenCalled()
  })
})
