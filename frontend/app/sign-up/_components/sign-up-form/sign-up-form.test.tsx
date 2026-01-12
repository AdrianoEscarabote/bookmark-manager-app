/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import SignUpForm from './index'

const pushMock = jest.fn()
const apiPostMock = jest.fn()
const resetMock = jest.fn()

jest.mock('next/navigation', () => ({
  __esModule: true,
  useRouter: () => ({
    push: pushMock,
  }),
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
  return {
    __esModule: true,
    useBookmarksStore: store,
  }
})

describe('SignUpForm', () => {
  const setup = () => {
    const user = userEvent.setup()
    render(<SignUpForm />)
    return { user }
  }

  beforeEach(() => {
    pushMock.mockClear()
    apiPostMock.mockClear()
    resetMock.mockClear()
  })

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

  it('shows password min length error', async () => {
    const { user } = setup()

    await user.type(screen.getByLabelText(/Full Name/i), 'John Doe')
    await user.type(screen.getByLabelText(/Email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/Password/i), '1234567')

    await user.click(screen.getByRole('button', { name: /Sign up/i }))

    expect(await screen.findByText('Password must be at least 8 characters')).toBeInTheDocument()
  })

  it('shows password max length error', async () => {
    const { user } = setup()

    await user.type(screen.getByLabelText(/Full Name/i), 'John Doe')
    await user.type(screen.getByLabelText(/Email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/Password/i), 'a'.repeat(25))

    await user.click(screen.getByRole('button', { name: /Sign up/i }))

    expect(await screen.findByText('Password must be at most 24 characters')).toBeInTheDocument()
  })

  it('submits valid data: calls API, resets store and redirects on 201', async () => {
    apiPostMock.mockResolvedValueOnce({ status: 201 })

    const { user } = setup()

    await user.type(screen.getByLabelText(/Full Name/i), 'John Doe')
    await user.type(screen.getByLabelText(/Email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/Password/i), 'StrongPass123')

    await user.click(screen.getByRole('button', { name: /Sign up/i }))

    await waitFor(() => expect(apiPostMock).toHaveBeenCalledTimes(1))

    expect(apiPostMock).toHaveBeenCalledWith('/auth/sign-up', {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'StrongPass123',
    })

    expect(resetMock).toHaveBeenCalledTimes(1)
    expect(pushMock).toHaveBeenCalledWith('/')
  })

  it('shows server error message when API fails with message', async () => {
    apiPostMock.mockRejectedValueOnce({
      isAxiosError: true,
      response: { data: { message: 'Email already in use' } },
      message: 'Request failed',
    })

    const { user } = setup()

    await user.type(screen.getByLabelText(/Full Name/i), 'John Doe')
    await user.type(screen.getByLabelText(/Email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/Password/i), 'StrongPass123')

    await user.click(screen.getByRole('button', { name: /Sign up/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Email already in use')
    expect(pushMock).not.toHaveBeenCalled()
  })
})
